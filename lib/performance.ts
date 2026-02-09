import { trackPerformanceMetric } from "./analytics"

// Performance tracking utilities - now routes through analytics pipeline
export function trackPerformance(metricName: string, metricValue: number) {
  if (typeof window === "undefined") return

  // Route through unified analytics pipeline for server-side visibility
  trackPerformanceMetric(metricName, metricValue)
}

export function observeCoreWebVitals() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return () => {}

  const observers: PerformanceObserver[] = []

  try {
    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        trackPerformanceMetric("LCP", lastEntry.startTime)
      }
    })
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
    observers.push(lcpObserver)

    // CLS Observer
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
    })
    clsObserver.observe({ type: "layout-shift", buffered: true })
    observers.push(clsObserver)

    // FID Observer
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      if (entries.length > 0) {
        const firstInput = entries[0] as PerformanceEventTiming
        trackPerformanceMetric("FID", firstInput.processingStart - firstInput.startTime)
      }
    })
    fidObserver.observe({ type: "first-input", buffered: true })
    observers.push(fidObserver)

    // Report CLS on page hide
    const reportCLS = () => {
      if (clsValue > 0) {
        trackPerformanceMetric("CLS", clsValue)
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        reportCLS()
      }
    })
  } catch (e) {
    // Silently fail - not all browsers support all metrics
  }

  return () => {
    observers.forEach((obs) => obs.disconnect())
  }
}
