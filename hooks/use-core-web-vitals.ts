"use client"

import { useEffect } from "react"

import { trackEvent } from "@/lib/analytics"
import { trackPerformance } from "@/lib/performance"

export function useCoreWebVitals() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      return
    }

    let lcpObserver: PerformanceObserver | undefined
    let clsObserver: PerformanceObserver | undefined
    let fidObserver: PerformanceObserver | undefined
    let cumulativeLayoutShift = 0

    const reportMetric = (metricName: string, metricValue: number) => {
      trackPerformance(metricName, metricValue)

      trackEvent("performance", metricName, { value: metricValue }).catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Performance analytics error:", error)
        }
      })
    }

    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]

        if (lastEntry) {
          reportMetric("LCP", lastEntry.startTime)
        }
      })

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
    } catch (error) {
      console.error("LCP observer failed to start:", error)
    }

    try {
      clsObserver = new PerformanceObserver((entryList) => {
        const layoutShifts = entryList.getEntries() as LayoutShift[]

        for (const layoutShift of layoutShifts) {
          if (!layoutShift.hadRecentInput) {
            cumulativeLayoutShift += layoutShift.value
            reportMetric("CLS", cumulativeLayoutShift)
          }
        }
      })

      clsObserver.observe({ type: "layout-shift", buffered: true })
    } catch (error) {
      console.error("CLS observer failed to start:", error)
    }

    try {
      fidObserver = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0] as PerformanceEventTiming | undefined
        if (firstInput) {
          const fid = firstInput.processingStart - firstInput.startTime
          reportMetric("FID", fid)
          fidObserver?.disconnect()
        }
      })

      fidObserver.observe({ type: "first-input", buffered: true })
    } catch (error) {
      console.error("FID observer failed to start:", error)
    }

    return () => {
      lcpObserver?.disconnect()
      clsObserver?.disconnect()
      fidObserver?.disconnect()
    }
  }, [])
}
