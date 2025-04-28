import { Navbar } from "@/components/layout/navbar"
import { CreateTimerForm } from "@/components/ui/create-timer-form"
import { TimerCard } from "@/components/ui/timer-card"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { requireAuth } from "@/utils/auth"
import { getUserTimers, getMainTimer } from "@/utils/timer-actions"
import { Clock, Star } from "lucide-react"

export default async function DashboardPage() {
  const user = await requireAuth()
  const { timers } = await getUserTimers()
  const mainTimer = await getMainTimer()

  return (
    <>
      <Navbar username={user.username} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-8">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            My Countdown Timers
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {mainTimer ? (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg mb-8 transform transition-all hover:scale-[1.01] hover:shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                  </div>
                  <h2 className="text-xl font-semibold">Main Display Timer</h2>
                </div>
                <CountdownTimer
                  eventName={mainTimer.event_name}
                  eventDate={mainTimer.event_date}
                  className="py-8"
                  size="large"
                />
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-md mb-8 text-center border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">No Main Timer Set</h2>
                <p className="text-gray-600">Create a new timer or set an existing timer as your main display.</p>
              </div>
            )}

            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-2xl font-bold">All Timers</h2>
              <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
                {timers.length} {timers.length === 1 ? "timer" : "timers"}
              </div>
            </div>

            {timers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timers.map((timer, index) => (
                  <TimerCard
                    key={timer.id}
                    id={timer.id}
                    eventName={timer.event_name}
                    eventDate={timer.event_date}
                    isMainDisplay={timer.is_main_display}
                    shareId={timer.share_id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-100">
                <p className="text-gray-600">You don't have any timers yet. Create your first timer!!!!!</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <CreateTimerForm />
          </div>
        </div>
      </div>
    </>
  )
}
