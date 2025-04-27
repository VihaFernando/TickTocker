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
  const [formState, setFormState] = useState({
    eventDate: eventDate,
  })

  // Define a minimum date for the datetime-local input
  const minDate = new Date().toISOString().slice(0, 16) // Current date and time in "YYYY-MM-DDTHH:mm" format

  // Format the date for the input when component mounts
  useEffect(() => {
    const date = new Date(eventDate)

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

    // Fix: make sure eventDate is not empty (important for iPhone)
    const eventDateValue = formState.eventDate
    if (!eventDateValue) {
      toast({
        title: "Error",
        description: "Please select a valid date and time.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const localDate = new Date(eventDateValue)
    const isoDate = localDate.toISOString()

    formData.set("eventDate", isoDate)

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
          <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700 mb-1 block">
            Event Date & Time
          </Label>

          <div className="relative mt-1">
            {/* Calendar icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>

            {/* Spacer div */}
            <div className="absolute left-0 top-0 h-full w-10 bg-transparent pointer-events-none" />

            {/* Displayed input */}
            <Input
              id="eventDate"
              name="eventDate"
              type="text"
              required
              className="pl-10 py-2 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              value={new Date(formState.eventDate).toLocaleString()}
              readOnly
              onClick={() => {
                const hiddenInput = document.getElementById("hiddenDateInput") as HTMLInputElement | null
                if (hiddenInput) {
                  hiddenInput.style.opacity = "0.01"
                  hiddenInput.classList.remove("pointer-events-none")
                  hiddenInput.showPicker?.()
                  hiddenInput.focus()
                  hiddenInput.click()
                  setTimeout(() => {
                    hiddenInput.style.opacity = "0"
                    hiddenInput.classList.add("pointer-events-none")
                  }, 500)
                }
              }}
            />

            {/* Hidden datetime-local input */}
            <input
              id="hiddenDateInput"
              type="datetime-local"
              min={minDate}
              value={formState.eventDate}
              onChange={(e) => {
                // Fix for iPhone: force update immediately on change
                const newValue = e.target.value
                if (newValue) {
                  setFormState({ ...formState, eventDate: newValue })
                }
              }}
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
              }}
            />
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
