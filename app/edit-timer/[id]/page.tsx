import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { EditTimerForm } from "@/components/ui/edit-timer-form"
import { requireAuth } from "@/utils/auth"
import { createClient } from "@/utils/supabase/server"

interface EditTimerPageProps {
  params: {
    id: string
  }
}

export default async function EditTimerPage({ params }: EditTimerPageProps) {
  const user = await requireAuth()
  const { id } = params

  const supabase = createClient()

  // Get the timer
  const { data: timer, error } = await supabase.from("timers").select("*").eq("id", id).eq("user_id", user.id).single()

  // If timer doesn't exist or doesn't belong to user
  if (error || !timer) {
    notFound()
  }

  return (
    <>
      <Navbar username={user.username} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Timer</h1>

        <div className="max-w-md mx-auto">
          <EditTimerForm id={timer.id} eventName={timer.event_name} eventDate={timer.event_date} />
        </div>
      </div>
    </>
  )
}
