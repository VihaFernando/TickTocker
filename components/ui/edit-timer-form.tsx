"use client"

import type React from "react"
import { useState } from "react"
import { updateTimer } from "@/utils/timer-actions"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

// Helper function to format date as local YYYY-MM-DDThh:mm
function formatLocalDateTime(dateString: string): string {
  // Check if the dateString is already in YYYY-MM-DDThh:mm format
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
  if (dateTimeRegex.test(dateString)) {
    return dateString
  }

  // Parse the date and format as local time
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

interface EditTimerFormProps {
  id: string
  eventName: string
  eventDate: string
}

export function EditTimerForm({ id, eventName, eventDate }: EditTimerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({
    eventName,
    eventDate: formatLocalDateTime(eventDate),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
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
          <Input
            id="eventName"
            name="eventName"
            value={formState.eventName}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="eventDate">Event Date & Time</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="datetime-local"
            value={formState.eventDate}
            onChange={handleChange}
            required
            className="mt-1"
          />
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