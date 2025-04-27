"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./supabase/server"
import { getCurrentUser } from "./auth"

export async function createTimer(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const eventName = formData.get("eventName") as string
  const eventDate = formData.get("eventDate") as string

  if (!eventName || !eventDate) {
    return { error: "Event name and date are required" }
  }

  const supabase = createClient()

  // Check if this is the first timer for the user
  const { count } = await supabase.from("timers").select("*", { count: "exact", head: true }).eq("user_id", user.id)

  const isFirstTimer = count === 0

  // Create the timer - store the date as is (it's already in ISO format)
  const { data, error } = await supabase
    .from("timers")
    .insert([
      {
        user_id: user.id,
        event_name: eventName,
        event_date: eventDate, // Already in ISO format from the form
        is_main_display: isFirstTimer, // Make first timer the main display
      },
    ])
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true, timer: data[0] }
}

export async function getUserTimers() {
  const user = await getCurrentUser()

  if (!user) {
    return { timers: [] }
  }

  const supabase = createClient()

  const { data: timers, error } = await supabase
    .from("timers")
    .select("*")
    .eq("user_id", user.id)
    .order("event_date", { ascending: true })

  if (error) {
    return { error: error.message, timers: [] }
  }

  return { timers }
}

export async function getMainTimer() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = createClient()

  const { data: timer, error } = await supabase
    .from("timers")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_main_display", true)
    .single()

  if (error) {
    // If no main timer is set, get the closest upcoming timer
    const { data: upcomingTimer } = await supabase
      .from("timers")
      .select("*")
      .eq("user_id", user.id)
      .gt("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(1)
      .single()

    return upcomingTimer || null
  }

  return timer
}

export async function setMainTimer(timerId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = createClient()

  // First, unset all main timers for this user
  await supabase.from("timers").update({ is_main_display: false }).eq("user_id", user.id)

  // Then set the selected timer as main
  const { error } = await supabase
    .from("timers")
    .update({ is_main_display: true })
    .eq("id", timerId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteTimer(timerId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("timers").delete().eq("id", timerId).eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getSharedTimer(shareId: string) {
  const supabase = createClient()

  const { data: timer, error } = await supabase
    .from("timers")
    .select("event_name, event_date, share_id")
    .eq("share_id", shareId)
    .single()

  if (error) {
    return null
  }

  return timer
}

export async function updateTimer(timerId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in" }
  }

  const eventName = formData.get("eventName") as string
  const eventDate = formData.get("eventDate") as string

  if (!eventName || !eventDate) {
    return { error: "Event name and date are required" }
  }

  const supabase = createClient()

  const { error } = await supabase
    .from("timers")
    .update({
      event_name: eventName,
      event_date: eventDate, // Already in ISO format from the form
      updated_at: new Date().toISOString(),
    })
    .eq("id", timerId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
