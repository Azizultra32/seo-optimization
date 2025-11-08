"use client"

import { usePersonalization, getPersonalizedContent } from "@/lib/personalization"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface PersonalizedCTAProps {
  variant?: "primary" | "secondary"
  className?: string
}

export function PersonalizedCTA({ variant = "primary", className = "" }: PersonalizedCTAProps) {
  const { profile } = usePersonalization()
  const content = getPersonalizedContent(profile.type)

  const buttonText = variant === "primary" ? content.ctaPrimary : content.ctaSecondary

  const handleClick = () => {
    // Track CTA click based on visitor type
    if (typeof window !== "undefined" && (window as any).trackEvent) {
      ;(window as any).trackEvent("personalized_cta_click", `${profile.type}_${variant}`)
    }

    // Route to appropriate action based on visitor type
    if (variant === "primary") {
      if (profile.type === "physician") {
        window.location.href = "mailto:demo@armadamd.com?subject=Clinical Demo Request"
      } else if (profile.type === "investor") {
        window.location.href = "mailto:partnerships@armadamd.com?subject=Investment Inquiry"
      } else if (profile.type === "press") {
        window.location.href = "mailto:press@armadamd.com?subject=Press Kit Request"
      } else {
        window.location.href = "mailto:demo@armadamd.com?subject=Demo Request"
      }
    }
  }

  const baseClasses =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/80"
      : "border border-black text-black hover:bg-black hover:text-white"

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 font-alfabet font-normal text-xs md:text-sm px-6 py-3 rounded-full transition-all ${baseClasses} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{buttonText}</span>
      <ArrowRight className="w-3 h-3" />
    </motion.button>
  )
}
