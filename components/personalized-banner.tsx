"use client"

import { usePersonalization, getPersonalizedContent } from "@/lib/personalization"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { useState } from "react"

export function PersonalizedBanner() {
  const { profile, isNewVisitor } = usePersonalization()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || profile.type === "unknown") return null

  const content = getPersonalizedContent(profile.type)

  // Show different messages for new vs returning visitors
  const message = profile.isReturning
    ? `Welcome back! ${content.benefits[0]}`
    : `We see you're interested in ${profile.type === "physician" ? "clinical solutions" : profile.type === "patient" ? "patient care" : profile.type === "investor" ? "healthcare innovation" : "our work"}. ${content.benefits[0]}`

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-3 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-white/80 flex-shrink-0" />
              <p className="font-alfabet text-sm font-light">{message}</p>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
