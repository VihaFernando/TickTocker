import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { getCurrentUser } from "@/utils/auth"
import { getMainTimer } from "@/utils/timer-actions"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { Clock, ArrowRight } from "lucide-react"

export default async function Home() {
  const user = await getCurrentUser()
  const mainTimer = user ? await getMainTimer() : null

  return (
    <>
      <Navbar username={user?.username} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-white rounded-lg p-2">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-6">
            Count Down to Your Special Moments
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Create beautiful countdown timers for your important events and share them with friends and family.
          </p>

          {mainTimer && (
            <div className="w-full max-w-2xl mb-12 overflow-hidden rounded-xl shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] mix-blend-overlay opacity-10"></div>
              <div className="relative p-8 text-white">
                <CountdownTimer eventName={mainTimer.event_name} eventDate={mainTimer.event_date} size="large" />

                {user && (
                  <div className="mt-6 text-center">
                    <Link href="/dashboard">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                      >
                        <span>Manage Timers</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {mainTimer ? "View All Timers" : "Create Your First Timer"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 border-2 hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-purple-600" />}
            title="Create Timers"
            description="Set up countdown timers for birthdays, anniversaries, holidays, or any special event."
            color="purple"
          />

          <FeatureCard
            icon={
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            }
            title="Sync Across Devices"
            description="Access your timers from any device with your account. Always stay updated."
            color="indigo"
          />

          <FeatureCard
            icon={
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            }
            title="Share With Others"
            description="Generate shareable links for your timers to share the excitement with friends and family."
            color="blue"
          />
        </div>
      </div>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} TikTocker. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`h-12 w-12 bg-${color}-100 rounded-full flex items-center justify-center mb-4`}>{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
