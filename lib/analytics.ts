// Client-side analytics utilities
import { v4 as uuidv4 } from "uuid"

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = sessionStorage.getItem("analytics_session_id")
  if (!sessionId) {
    sessionId = uuidv4()
    sessionStorage.setItem("analytics_session_id", sessionId)
  }
  return sessionId
}

// Track custom event
export async function trackEvent(eventType: string, eventName: string, metadata: Record<string, any> = {}) {
  if (typeof window === "undefined") return

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        eventName,
        pageUrl: window.location.pathname,
        metadata,
        sessionId: getSessionId(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
  } catch (error) {
    // Silently fail
  }
}

// Track scroll depth
export function trackScrollDepth() {
  if (typeof window === "undefined") return

  let maxScroll = 0
  const startTime = Date.now()
  let tracked = false

  const handleScroll = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const scrollPercentage = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)

    maxScroll = Math.max(maxScroll, scrollPercentage)
  }

  const trackOnExit = async () => {
    if (tracked) return
    tracked = true

    const timeOnPage = Math.round((Date.now() - startTime) / 1000)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      await fetch("/api/analytics/scroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageUrl: window.location.pathname,
          maxScrollPercentage: maxScroll,
          timeOnPage,
          sessionId: getSessionId(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("[v0] Scroll tracking skipped:", error)
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true })
  window.addEventListener("beforeunload", trackOnExit)

  // Track after 30 seconds as well
  setTimeout(trackOnExit, 30000)

  return () => {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("beforeunload", trackOnExit)
  }
}

// Track performance metrics
export function trackPerformance() {
  if (typeof window === "undefined" || !window.performance) return

  window.addEventListener("load", async () => {
    setTimeout(async () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType("paint")

      const metrics = {
        // Core Web Vitals
        fcp: paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0,
        lcp: 0, // Will be set by observer below
        cls: 0, // Will be set by observer below
        fid: 0, // Will be set by observer below

        // Page load metrics
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
        loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        await fetch("/api/analytics/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageUrl: window.location.pathname,
            metrics,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
      } catch (error) {
        // Silently fail
      }
    }, 0)
  })
}
