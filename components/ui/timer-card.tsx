"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Star, Trash, Share2, Edit, ChevronDown, ChevronUp } from "lucide-react"
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

  return (
    <motion.div
      className={`overflow-hidden rounded-xl shadow-lg border ${
        isMainDisplay
          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-transparent"
          : "bg-white border-gray-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      layout
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <motion.h3
            className="font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {eventName}
          </motion.h3>
          <div className="flex space-x-1">
            <Button
              variant={isMainDisplay ? "secondary" : "ghost"}
              size="icon"
              onClick={handleSetMain}
              disabled={isSetting || isMainDisplay}
              className="h-8 w-8 rounded-full"
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
              className="h-8 w-8 rounded-full"
              title="Share timer"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8 rounded-full"
              title="Edit timer"
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 rounded-full"
              title="Delete timer"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          className="flex items-center space-x-2 text-sm mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className="h-4 w-4" />
          <span>{new Date(eventDate).toLocaleDateString()}</span>
        </motion.div>

        <motion.div
          className={`${isMainDisplay ? "bg-white/10" : "bg-gray-50"} rounded-lg p-4 cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          onClick={toggleExpand}
          layout
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <CountdownTimer eventName="" eventDate={eventDate} size="small" />
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`${isMainDisplay ? "bg-white/20" : "bg-gray-100"} rounded-full p-1`}
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
                <div className="flex items-center">
                  <div className={`w-24 text-sm ${isMainDisplay ? "text-white/70" : "text-gray-500"} font-medium`}>
                    Event Date:
                  </div>
                  <div className="text-sm font-medium">{new Date(eventDate).toLocaleString()}</div>
                </div>
                <div className="flex items-center">
                  <div className={`w-24 text-sm ${isMainDisplay ? "text-white/70" : "text-gray-500"} font-medium`}>
                    Share Link:
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isMainDisplay ? "text-white underline" : "text-blue-500"
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare()
                    }}
                  >
                    Click to copy
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
