import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { AuthForm } from "@/components/auth/auth-form"
import { getCurrentUser } from "@/utils/auth"

export default async function SignupPage() {
  const user = await getCurrentUser()

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <AuthForm mode="signup" />
      </div>
    </>
  )
}
