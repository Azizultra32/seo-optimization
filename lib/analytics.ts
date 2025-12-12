// Client-side analytics utilities

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = sessionStorage.getItem("analytics_session_id")
  if (!sessionId) {
    // Use native Web Crypto API for UUID generation
    sessionId = window.crypto.randomUUID()
    sessionStorage.setItem("analytics_session_id", sessionId)
  }
  return sessionId
}

// Track custom event
export async function trackEvent(eventType: string, eventName: string, metadata: Record<string, any> = {}) {
  try {
    if (!eventType || !eventName) return

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        eventName,
        pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
        metadata,
        sessionId: getSessionId(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok && process.env.NODE_ENV === "development") {
      console.log("[v0] Analytics tracking returned non-ok status:", response.status)
    }
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Analytics tracking skipped:", error)
    }
  }
}

// Track page view
export async function trackPageView(pathname: string) {
  return trackEvent("page_view", "Page View", { pathname })
}

// Track scroll depth
export function trackScrollDepth() {
  // Scroll tracking is currently disabled to prevent database errors
  // To re-enable, ensure the scroll_tracking table exists in Supabase
  return () => {} // Return empty cleanup function
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
        if (process.env.NODE_ENV === "development") {
          console.log("[v0] Performance tracking skipped:", error)
        }
      }
    }, 0)
  })
}

export async function trackPerformanceMetric(metricName: string, metricValue: number) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    await fetch("/api/analytics/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: window.location.pathname,
        metricName,
        metricValue,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Performance tracking skipped:", error)
    }
  }
}
