import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { Button } from "@/components/ui/button"
import { getSharedTimer } from "@/utils/timer-actions"
import { getCurrentUser } from "@/utils/auth"

interface SharedTimerPageProps {
  params: {
    id: string
  }
}

export default async function SharedTimerPage({ params }: SharedTimerPageProps) {
  const { id } = params
  const user = await getCurrentUser()

  const timer = await getSharedTimer(id)

  // If timer doesn't exist
  if (!timer) {
    notFound()
  }

  return (
    <>
      <Navbar username={user?.username} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Shared Countdown</h1>

            <CountdownTimer eventName={timer.event_name} eventDate={timer.event_date} className="py-8" size="large" />

            <div className="mt-8 text-center">
              <p className="mb-4 text-white/80">This countdown was shared with you by a TikTocker user.</p>

              {!user && (
                <div className="mt-6">
                  <p className="mb-4 text-white/90 font-medium">Want to create your own countdowns?</p>
                  <Link href="/signup">
                    <Button className="bg-white text-indigo-600 hover:bg-gray-100">Sign Up for Free</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
