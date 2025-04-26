"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { createClient } from "./supabase/server"

export async function signUp(formData: FormData) {
  try {
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!username || !email || !password) {
      return { error: "All fields are required" }
    }

    const supabase = createClient()

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError)
      return { error: "An error occurred while checking email availability" }
    }

    if (existingUser) {
      return { error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          username,
          email,
          password: hashedPassword,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return { error: error.message }
    }

    if (!data || data.length === 0) {
      return { error: "Failed to create user" }
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "user_id",
      value: data[0].id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, userId: data[0].id };
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An unexpected error occurred during signup" }
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const supabase = createClient()

    // Get user with matching email
    const { data: user, error } = await supabase.from("profiles").select("*").eq("email", email).single()

    if (error) {
      console.error("Error finding user:", error)
      return { error: "Invalid email or password" }
    }

    if (!user) {
      return { error: "Invalid email or password" }
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { error: "Invalid email or password" }
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "user_id",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred during login" }
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  redirect("/login")
}

export async function getCurrentUser() {
  try {
    // Use a different approach to get cookies
    const cookiesList = await cookies()
    const hasCookie = cookiesList.get("user_id") !== undefined

    if (!hasCookie) {
      return null
    }

    const userId = cookiesList.get("user_id")?.value

    if (!userId) {
      return null
    }

    const supabase = createClient()
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, username, email")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
