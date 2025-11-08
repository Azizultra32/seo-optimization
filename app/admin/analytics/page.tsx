"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface DashboardData {
  summary: {
    totalEvents: number
    avgScrollDepth: number
    avgTimeOnPage: number
  }
  eventsByType: Array<{ type: string; count: number }>
  performance: Record<string, number>
  topPages: Array<{ url: string; count: number }>
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/analytics/dashboard")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
        <p className="text-gray-600 mb-8">Last 30 days</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{data.summary.totalEvents.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Scroll Depth</h3>
            <p className="text-3xl font-bold text-gray-900">{data.summary.avgScrollDepth}%</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Time on Page</h3>
            <p className="text-3xl font-bold text-gray-900">{data.summary.avgTimeOnPage}s</p>
          </Card>
        </div>

        {/* Events by Type */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Events by Type</h2>
          <div className="space-y-3">
            {data.eventsByType.map((event) => (
              <div key={event.type} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{event.type}</span>
                <span className="text-sm font-medium text-gray-900">{event.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.performance).map(([metric, value]) => (
              <div key={metric} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xs font-medium text-gray-600 uppercase mb-1">{metric}</h3>
                <p className="text-2xl font-bold text-gray-900">{Math.round(value)}ms</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Pages */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Pages</h2>
          <div className="space-y-3">
            {data.topPages.map((page) => (
              <div key={page.url} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-mono">{page.url}</span>
                <span className="text-sm font-medium text-gray-900">{page.count} events</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
