"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createTimer } from "@/utils/timer-actions"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, PlusCircle } from "lucide-react"

export function CreateTimerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({
    eventName: "",
    eventDate: "",
  })

  // Set the initial date value when component mounts
  useEffect(() => {
    // Get current date and time in local timezone
    const now = new Date()
    // Format to YYYY-MM-DDThh:mm
    const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

    setFormState((prev) => ({
      ...prev,
      eventDate: localDatetime,
    }))
  }, [])

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

    const result = await createTimer(formData)

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
        description: "Timer created successfully",
      })
      router.refresh()
      // Reset the form name but keep the date field with updated current time
      const now = new Date()
      const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

      setFormState({
        eventName: "",
        eventDate: localDatetime,
      })
    }
  }

  // Calculate minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().split("T")[0]

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <motion.div className="flex items-center mb-6" variants={itemVariants}>
        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md mr-3">
          <PlusCircle className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Create New Timer
        </h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={itemVariants}>
          <Label htmlFor="eventName" className="text-sm font-medium text-gray-700 mb-1 block">
            Event Name
          </Label>
          <div className="relative">
            <Input
              id="eventName"
              name="eventName"
              placeholder="Birthday, Anniversary, etc."
              required
              className="pl-10 py-2 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              value={formState.eventName}
              onChange={handleChange}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="h-5 w-5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
  <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700 mb-1 block">
    Event Date & Time
  </Label>

  <div className="relative">
    <Input
      id="eventDate"
      name="eventDate"
      type="text"
      required
      className="pl-10 py-2 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
      value={new Date(formState.eventDate).toLocaleString()}
      readOnly
      onClick={() => {
        const hiddenInput = document.getElementById("hiddenDateInput") as HTMLInputElement | null;
        if (hiddenInput) {
          // Temporarily make it minimally visible and interactive
          hiddenInput.style.opacity = '0.01'; 
          hiddenInput.classList.remove("pointer-events-none");

          // Try to open the picker
          hiddenInput.showPicker?.();
          hiddenInput.focus();
          hiddenInput.click();

          // After a short delay, make it fully invisible again
          setTimeout(() => {
            hiddenInput.style.opacity = '0';
            hiddenInput.classList.add("pointer-events-none");
          }, 500);
        }
      }}
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      <CalendarIcon className="h-5 w-5 text-gray-400" />
    </div>

    {/* Hidden input for actual date selection */}
    <input
      id="hiddenDateInput"
      type="datetime-local"
      min={minDate}
      value={formState.eventDate}
      onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
      className="absolute pointer-events-none"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0, 
      }}
    />
  </div>

  <p className="text-xs text-gray-500 mt-1">Times are shown in your local timezone</p>
</motion.div>


        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4" />
                Create Timer
              </div>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
