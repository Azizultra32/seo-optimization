"use client"

import { useEffect } from "react"

// Web Vitals types
interface WebVitalsMetric {
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB"
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  id: string
}

// Thresholds for Core Web Vitals
const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: keyof typeof thresholds, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = thresholds[name]
  if (value <= threshold.good) return "good"
  if (value <= threshold.poor) return "needs-improvement"
  return "poor"
}

// Report to analytics
async function reportWebVitals(metric: WebVitalsMetric) {
  // Only report in production
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)
    return
  }

  try {
    await fetch("/api/analytics/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageUrl: window.location.pathname,
        metricName: metric.name,
        metricValue: metric.value,
        rating: metric.rating,
      }),
    })
  } catch (error) {
    // Silent fail
  }
}

// Observe LCP
function observeLCP(callback: (metric: WebVitalsMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

  const po = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
    
    callback({
      name: "LCP",
      value: lastEntry.startTime,
      rating: getRating("LCP", lastEntry.startTime),
      delta: lastEntry.startTime,
      id: `lcp-${Date.now()}`,
    })
  })

  po.observe({ type: "largest-contentful-paint", buffered: true })
  return () => po.disconnect()
}

// Observe FID
function observeFID(callback: (metric: WebVitalsMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

  const po = new PerformanceObserver((list) => {
    const entries = list.getEntries() as (PerformanceEntry & { processingStart: number; startTime: number })[]
    
    entries.forEach((entry) => {
      const value = entry.processingStart - entry.startTime
      callback({
        name: "FID",
        value,
        rating: getRating("FID", value),
        delta: value,
        id: `fid-${Date.now()}`,
      })
    })
  })

  po.observe({ type: "first-input", buffered: true })
  return () => po.disconnect()
}

// Observe CLS
function observeCLS(callback: (metric: WebVitalsMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

  let clsValue = 0

  const po = new PerformanceObserver((list) => {
    const entries = list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]
    
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    })

    callback({
      name: "CLS",
      value: clsValue,
      rating: getRating("CLS", clsValue),
      delta: clsValue,
      id: `cls-${Date.now()}`,
    })
  })

  po.observe({ type: "layout-shift", buffered: true })
  return () => po.disconnect()
}

// Observe FCP
function observeFCP(callback: (metric: WebVitalsMetric) => void) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

  const po = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const fcpEntry = entries.find((e) => e.name === "first-contentful-paint")
    
    if (fcpEntry) {
      callback({
        name: "FCP",
        value: fcpEntry.startTime,
        rating: getRating("FCP", fcpEntry.startTime),
        delta: fcpEntry.startTime,
        id: `fcp-${Date.now()}`,
      })
    }
  })

  po.observe({ type: "paint", buffered: true })
  return () => po.disconnect()
}

// Hook to track all web vitals
export function useWebVitals() {
  useEffect(() => {
    const cleanups: (() => void)[] = []

    cleanups.push(observeLCP(reportWebVitals) || (() => {}))
    cleanups.push(observeFID(reportWebVitals) || (() => {}))
    cleanups.push(observeCLS(reportWebVitals) || (() => {}))
    cleanups.push(observeFCP(reportWebVitals) || (() => {}))

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])
}

// Component to add to layout
export function WebVitalsReporter() {
  useWebVitals()
  return null
}
