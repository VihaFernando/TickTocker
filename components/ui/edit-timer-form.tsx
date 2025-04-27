"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { updateTimer } from "@/utils/timer-actions"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"

interface EditTimerFormProps {
  id: string
  eventName: string
  eventDate: string
}

export function EditTimerForm({ id, eventName, eventDate }: EditTimerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formattedDate, setFormattedDate] = useState("")

  // Format the date for the input when component mounts
  useEffect(() => {
    // Convert the UTC date to local date for the input
    const date = new Date(eventDate)

    // Format to YYYY-MM-DDThh:mm in local timezone
    // This properly handles the timezone conversion for the datetime-local input
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    const localDatetime = `${year}-${month}-${day}T${hours}:${minutes}`
    setFormattedDate(localDatetime)
  }, [eventDate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    // Ensure the date is preserved in the user's timezone
    const eventDate = formData.get("eventDate") as string
    if (eventDate) {
      // Create a Date object in the user's local timezone
      const localDate = new Date(eventDate)

      // Convert to ISO string (this will be in UTC)
      const isoDate = localDate.toISOString()

      // Replace the form data with the ISO string
      formData.set("eventDate", isoDate)
    }

    const result = await updateTimer(id, formData)

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Timer updated successfully",
      })
      router.push("/dashboard")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Timer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" name="eventName" defaultValue={eventName} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="eventDate">Event Date & Time</Label>
          <div className="relative">
            <Input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              value={formattedDate}
              onChange={(e) => setFormattedDate(e.target.value)}
              required
              className="pl-10 py-2 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg mt-1"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Times are shown in your local timezone</p>
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            {isSubmitting ? "Updating..." : "Update Timer"}
          </Button>

          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
