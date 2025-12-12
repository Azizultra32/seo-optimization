// Performance tracking utilities
export function trackPerformance(metricName: string, metricValue: number) {
  if (typeof window === "undefined") return

  try {
    // Log performance metrics
    console.log(`[Performance] ${metricName}: ${metricValue.toFixed(2)}ms`)

    // You can extend this to send to analytics service
    // trackEvent('performance', { metric: metricName, value: metricValue });
  } catch (error) {
    console.error("Performance tracking error:", error)
  }
}
