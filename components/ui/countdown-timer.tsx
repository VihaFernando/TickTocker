"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CountdownTimerProps {
  eventName: string
  eventDate: string
  className?: string
  size?: "small" | "medium" | "large"
}

export function CountdownTimer({ eventName, eventDate, className = "", size = "medium" }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLessThanWeek: false,
    isPast: false,
    totalHours: 0,
  })

  useEffect(() => {
    function updateCountdown() {
      const now = new Date()
      const target = new Date(eventDate)
      const diff = target.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLessThanWeek: true,
          isPast: true,
          totalHours: 0,
        })
        return
      }

      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Calculate total hours for display when less than a week
      const totalHours = Math.floor(diff / (1000 * 60 * 60))

      // Less than a week is 7 days or 168 hours
      const isLessThanWeek = days < 7

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isLessThanWeek,
        isPast: false,
        totalHours,
      })
    }

    // Update immediately
    updateCountdown()

    // Then update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [eventDate])

  const { days, hours, minutes, seconds, isLessThanWeek, isPast, totalHours } = timeRemaining

  // Determine font sizes based on the size prop
  const titleSize = size === "large" ? "text-3xl md:text-4xl" : size === "medium" ? "text-2xl" : "text-xl"
  const digitSize =
    size === "large" ? "text-5xl md:text-7xl" : size === "medium" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"
  const labelSize = size === "large" ? "text-sm" : size === "medium" ? "text-xs" : "text-xs"

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.h2
        className={`${titleSize} font-bold mb-4 text-center`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {eventName}
      </motion.h2>

      {isPast ? (
        <motion.div
          className="text-2xl font-bold text-red-500"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Event has passed
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex space-x-2 md:space-x-4">
            {isLessThanWeek ? (
              <>
                <TimeDigit value={totalHours} label="HOURS" size={digitSize} labelSize={labelSize} />
                <TimeSeparator size={digitSize} />
                <TimeDigit value={minutes} label="MINUTES" size={digitSize} labelSize={labelSize} />
                <TimeSeparator size={digitSize} />
                <TimeDigit value={seconds} label="SECONDS" size={digitSize} labelSize={labelSize} />
              </>
            ) : (
              <>
                <TimeDigit value={days} label="DAYS" size={digitSize} labelSize={labelSize} />
                <TimeSeparator size={digitSize} />
                <TimeDigit value={hours} label="HOURS" size={digitSize} labelSize={labelSize} />
                <TimeSeparator size={digitSize} />
                <TimeDigit value={minutes} label="MINUTES" size={digitSize} labelSize={labelSize} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface TimeDigitProps {
  value: number
  label: string
  size: string
  labelSize: string
}

function TimeDigit({ value, label, size, labelSize }: TimeDigitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-lg px-2 py-2 sm:px-3 sm:py-2 min-w-0 w-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            className={`${size} font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {value.toString().padStart(2, "0")}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        className={`${labelSize} font-semibold text-gray-200 mt-2 tracking-wider`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.div>
    </div>
  )
}

function TimeSeparator({ size }: { size: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className={`${size} font-bold text-gray-300 mx-1`}>:</div>
    </div>
  )
}