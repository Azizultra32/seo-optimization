"use client"

import { useEffect, useState } from "react"

export type VisitorType = "physician" | "patient" | "investor" | "press" | "unknown"

export interface VisitorProfile {
  type: VisitorType
  isReturning: boolean
  visitCount: number
  lastVisit: string | null
  preferences: {
    hasViewedDemo: boolean
    hasRequestedDemo: boolean
    interestedProducts: string[]
  }
}

const STORAGE_KEY = "visitor_profile"
const SESSION_KEY = "visitor_session"

// Detect visitor type based on various signals
export function detectVisitorType(): VisitorType {
  if (typeof window === "undefined") return "unknown"

  // Check URL parameters
  const params = new URLSearchParams(window.location.search)
  const utmCampaign = params.get("utm_campaign")?.toLowerCase()
  const utmSource = params.get("utm_source")?.toLowerCase()
  const ref = params.get("ref")?.toLowerCase()

  // URL parameter-based detection
  if (utmCampaign?.includes("physician") || utmSource?.includes("medical") || ref === "physician") {
    return "physician"
  }
  if (utmCampaign?.includes("patient") || ref === "patient") {
    return "patient"
  }
  if (utmCampaign?.includes("investor") || utmSource?.includes("investor") || ref === "investor") {
    return "investor"
  }
  if (utmCampaign?.includes("press") || utmSource?.includes("media") || ref === "press") {
    return "press"
  }

  // Referrer-based detection
  const referrer = document.referrer.toLowerCase()
  if (referrer.includes("linkedin.com/in/alighahary") || referrer.includes("linkedin")) {
    return "physician" // Professional network suggests physician
  }
  if (referrer.includes("techcrunch") || referrer.includes("forbes") || referrer.includes("wired")) {
    return "press"
  }

  return "unknown"
}

// Get or create visitor profile
export function getVisitorProfile(): VisitorProfile {
  if (typeof window === "undefined") {
    return {
      type: "unknown",
      isReturning: false,
      visitCount: 0,
      lastVisit: null,
      preferences: {
        hasViewedDemo: false,
        hasRequestedDemo: false,
        interestedProducts: [],
      },
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const profile: VisitorProfile = JSON.parse(stored)
    return profile
  }

  // New visitor
  const type = detectVisitorType()
  const newProfile: VisitorProfile = {
    type,
    isReturning: false,
    visitCount: 1,
    lastVisit: null,
    preferences: {
      hasViewedDemo: false,
      hasRequestedDemo: false,
      interestedProducts: [],
    },
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile))
  return newProfile
}

// Update visitor profile
export function updateVisitorProfile(updates: Partial<VisitorProfile>): void {
  if (typeof window === "undefined") return

  const profile = getVisitorProfile()
  const updatedProfile = {
    ...profile,
    ...updates,
    visitCount: profile.visitCount + (updates.isReturning === false ? 1 : 0),
    lastVisit: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile))
}

// Track demo view
export function trackDemoView(productName: string): void {
  const profile = getVisitorProfile()
  if (!profile.preferences.interestedProducts.includes(productName)) {
    profile.preferences.interestedProducts.push(productName)
  }
  profile.preferences.hasViewedDemo = true
  updateVisitorProfile(profile)
}

// Hook for using personalization in components
export function usePersonalization() {
  const [profile, setProfile] = useState<VisitorProfile>({
    type: "unknown",
    isReturning: false,
    visitCount: 0,
    lastVisit: null,
    preferences: {
      hasViewedDemo: false,
      hasRequestedDemo: false,
      interestedProducts: [],
    },
  })
  const [isNewVisitor, setIsNewVisitor] = useState(false)

  useEffect(() => {
    const currentProfile = getVisitorProfile()
    setProfile(currentProfile)

    // Check if this is a new session
    const sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!sessionId) {
      setIsNewVisitor(currentProfile.visitCount === 1)
      sessionStorage.setItem(SESSION_KEY, Date.now().toString())

      // Update visit count for returning visitors
      if (currentProfile.visitCount > 1 || currentProfile.lastVisit) {
        updateVisitorProfile({ isReturning: true })
      }
    }
  }, [])

  const updateProfile = (updates: Partial<VisitorProfile>) => {
    updateVisitorProfile(updates)
    setProfile(getVisitorProfile())
  }

  return {
    profile,
    isNewVisitor,
    updateProfile,
    trackDemoView,
  }
}

// Get personalized content based on visitor type
export function getPersonalizedContent(visitorType: VisitorType) {
  const content = {
    physician: {
      heroTitle: "Empowering Physicians with Ethical AI",
      heroSubtitle: "Reduce administrative burden. Focus on patient care. Maintain clinical autonomy.",
      ctaPrimary: "Schedule a Clinical Demo",
      ctaSecondary: "See How It Works",
      benefits: [
        "Save 2-3 hours per day on documentation",
        "Maintain full clinical control",
        "HIPAA-compliant AI assistance",
        "Built by physicians, for physicians",
      ],
    },
    patient: {
      heroTitle: "Your Health Data, Your Control",
      heroSubtitle: "Access quality care from trusted physicians. Keep your medical records secure and portable.",
      ctaPrimary: "Learn About Patient Benefits",
      ctaSecondary: "Find a Physician",
      benefits: [
        "Access care from anywhere",
        "Control your health data",
        "Secure, encrypted records",
        "Seamless provider communication",
      ],
    },
    investor: {
      heroTitle: "Transforming Healthcare with Ethical AI",
      heroSubtitle: "Backing the future of physician-led innovation. $50M+ market opportunity in digital health.",
      ctaPrimary: "View Investment Deck",
      ctaSecondary: "Schedule Meeting",
      benefits: [
        "Proven clinical leadership",
        "Ethical AI differentiation",
        "Enterprise healthcare market",
        "Strong regulatory compliance",
      ],
    },
    press: {
      heroTitle: "AI Ethics Meet Healthcare Innovation",
      heroSubtitle: "Physician-entrepreneur Dr. Ali Ghahary brings ethical AI framework to medical technology.",
      ctaPrimary: "Download Press Kit",
      ctaSecondary: "Request Interview",
      benefits: [
        "World Economic Forum speaker",
        "Author of The KNGHT Doctrine",
        "20+ years clinical experience",
        "Media-ready healthcare insights",
      ],
    },
    unknown: {
      heroTitle: "Dr. Ali Ghahary MD, CCFP",
      heroSubtitle: "Physician · Entrepreneur · Founder",
      ctaPrimary: "Request Demo",
      ctaSecondary: "Learn More",
      benefits: [
        "Ethical AI in healthcare",
        "Patient-centered innovation",
        "Clinical excellence",
        "Global healthcare impact",
      ],
    },
  }

  return content[visitorType] || content.unknown
}
