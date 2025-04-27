"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Star, Trash, Share2, Edit, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { setMainTimer, deleteTimer } from "@/utils/timer-actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { CountdownTimer } from "./countdown-timer"

interface TimerCardProps {
  id: string
  eventName: string
  eventDate: string
  isMainDisplay: boolean
  shareId: string
}

export function TimerCard({ id, eventName, eventDate, isMainDisplay, shareId }: TimerCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleSetMain = async () => {
    if (isMainDisplay) return

    setIsSetting(true)
    const result = await setMainTimer(id)
    setIsSetting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Main timer updated",
      })
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this timer?")) {
      setIsDeleting(true)
      const result = await deleteTimer(id)
      setIsDeleting(false)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Timer deleted",
        })
        router.refresh()
      }
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${shareId}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    })
  }

  const handleEdit = () => {
    router.push(`/edit-timer/${id}`)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Format the date in the user's local timezone
  const eventDateLocal = new Date(eventDate).toLocaleString()

  // Check if event is in the past
  const isPast = new Date(eventDate) < new Date()

  // Calculate how close the event is (for urgency indicator)
  const daysUntilEvent = Math.ceil((new Date(eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysUntilEvent <= 3 && daysUntilEvent > 0

  return (
    <motion.div
      className={`overflow-hidden rounded-xl relative ${
        isMainDisplay ? "bg-gradient-to-br from-purple-500 via-indigo-500 to-indigo-600 text-white" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* Glass effect overlay */}
      <div
        className={`absolute inset-0 ${
          isMainDisplay ? "bg-white/10" : "bg-gradient-to-br from-gray-50 to-white/80"
        } backdrop-blur-[1px] z-0`}
      />

      {/* Card border glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl z-[-1] ${
          isMainDisplay ? "shadow-lg shadow-purple-500/30" : "shadow-md"
        }`}
        animate={{
          boxShadow: isHovered
            ? isMainDisplay
              ? "0 10px 30px -10px rgba(139, 92, 246, 0.5)"
              : "0 10px 30px -10px rgba(0, 0, 0, 0.15)"
            : isMainDisplay
              ? "0 5px 20px -5px rgba(139, 92, 246, 0.3)"
              : "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Urgency indicator */}
      {isUrgent && !isPast && (
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
          >
            <AlertCircle className="h-3 w-3" />
            <span>Soon</span>
          </motion.div>
        </div>
      )}

      <div className="p-5 relative z-[1]">
        <div className="flex justify-between items-start mb-4">
          <motion.div className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3 className={`font-bold text-lg md:text-xl ${isMainDisplay ? "text-white" : "text-gray-800"}`}>
              {eventName}
            </h3>
            <motion.div
              className={`flex items-center space-x-2 text-sm mt-1 ${isMainDisplay ? "text-white/80" : "text-gray-500"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{eventDateLocal}</span>
            </motion.div>
          </motion.div>

          <div className="flex space-x-1">
            <Button
              variant={isMainDisplay ? "secondary" : "ghost"}
              size="icon"
              onClick={handleSetMain}
              disabled={isSetting || isMainDisplay}
              className={`h-8 w-8 rounded-full ${isMainDisplay ? "bg-white/20 hover:bg-white/30" : ""}`}
              title={isMainDisplay ? "Main timer" : "Set as main timer"}
            >
              <Star
                className={`h-4 w-4 ${isMainDisplay ? "fill-yellow-300" : ""}`}
                style={{ filter: isMainDisplay ? "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))" : "none" }}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className={`h-8 w-8 rounded-full ${isMainDisplay ? "text-white hover:bg-white/20" : ""}`}
              title="Share timer"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className={`h-8 w-8 rounded-full ${isMainDisplay ? "text-white hover:bg-white/20" : ""}`}
              title="Edit timer"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`h-8 w-8 rounded-full ${isMainDisplay ? "text-white hover:bg-white/20 hover:text-red-300" : "hover:text-red-500"}`}
              title="Delete timer"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          className={`${
            isMainDisplay
              ? "bg-gradient-to-br from-white/20 to-white/5 border border-white/10"
              : "bg-gradient-to-br from-gray-50 to-white border border-gray-100"
          } rounded-xl p-4 cursor-pointer overflow-hidden backdrop-blur-sm`}
          whileHover={{ scale: 1.02 }}
          onClick={toggleExpand}
          layout
        >
          <div className="flex justify-between items-center">
            <div className="flex-1 overflow-hidden">
              <CountdownTimer eventName="" eventDate={eventDate} size="small" />
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`${isMainDisplay ? "bg-white/20" : "bg-gray-100"} rounded-full p-1 flex-shrink-0 ml-2`}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 pt-4 ${isMainDisplay ? "border-t border-white/20" : "border-t border-gray-100"}`}
            >
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className={`md:w-24 text-sm ${isMainDisplay ? "text-white/70" : "text-gray-500"} font-medium`}>
                    Event Date:
                  </div>
                  <div className={`text-sm font-medium break-words ${isMainDisplay ? "text-white" : "text-gray-800"}`}>
                    {eventDateLocal}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className={`md:w-24 text-sm ${isMainDisplay ? "text-white/70" : "text-gray-500"} font-medium`}>
                    Share Link:
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isMainDisplay ? "text-white underline" : "text-blue-500"
                    } cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare()
                    }}
                  >
                    Click to copy
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className={`md:w-24 text-sm ${isMainDisplay ? "text-white/70" : "text-gray-500"} font-medium`}>
                    Status:
                  </div>
                  <div
                    className={`text-sm font-medium ${isPast ? (isMainDisplay ? "text-red-300" : "text-red-500") : isMainDisplay ? "text-green-300" : "text-green-500"}`}
                  >
                    {isPast ? "Event has passed" : isUrgent ? "Coming soon" : "Upcoming"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                  }}
                  className={`${
                    isMainDisplay
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } rounded-lg`}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className={`${
                    isMainDisplay
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } rounded-lg`}
                >
                  <Share2 className="h-3.5 w-3.5 mr-1" /> Share
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 rounded-full blur-xl z-0"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 -ml-4 -mb-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-xl z-0"></div>
    </motion.div>
  )
}
