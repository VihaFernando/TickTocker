export function formatTimeRemaining(targetDate: Date | string): {
  timeString: string
  isLessThanWeek: boolean
} {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate
  const now = new Date()

  // Calculate the difference in milliseconds
  const diff = target.getTime() - now.getTime()

  // If the date is in the past
  if (diff <= 0) {
    return { timeString: "Event has passed", isLessThanWeek: true }
  }

  // Calculate time units
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const totalHours = Math.floor(diff / (1000 * 60 * 60))

  const isLessThanWeek = days < 7

  // Format the string based on the time remaining
  if (isLessThanWeek) {
    return {
      timeString: `${totalHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      isLessThanWeek,
    }
  } else {
    return {
      timeString: `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`,
      isLessThanWeek,
    }
  }
}
