import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

const emptyDashboard = {
  summary: { totalEvents: 0, avgScrollDepth: 0, avgTimeOnPage: 0 },
  eventsByType: [],
  performance: {},
  topPages: [],
}

export async function GET() {
  try {
    const supabaseUrl = getSupabaseUrl()
    if (!supabaseUrl) {
      return NextResponse.json(emptyDashboard)
    }

    let supabaseKey: string
    try {
      supabaseKey = getSupabaseServiceRoleKey()
    } catch {
      return NextResponse.json(emptyDashboard)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get date range for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total events
    const { count: totalEvents } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())

    // Events by type
    const { data: eventsByType } = await supabase
      .from("analytics_events")
      .select("event_type, event_name")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const eventTypeCount: Record<string, number> = {}
    eventsByType?.forEach((event) => {
      const key = `${event.event_type}:${event.event_name}`
      eventTypeCount[key] = (eventTypeCount[key] || 0) + 1
    })

    // Average scroll depth
    const { data: scrollData } = await supabase
      .from("scroll_tracking")
      .select("max_scroll_percentage, time_on_page")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const scrollRows = scrollData ?? []
    const avgScrollDepth = scrollRows.reduce((sum, item) => sum + item.max_scroll_percentage, 0) / (scrollRows.length || 1)
    const avgTimeOnPage = scrollRows.reduce((sum, item) => sum + item.time_on_page, 0) / (scrollRows.length || 1)

    // Performance metrics averages
    const { data: performanceData } = await supabase
      .from("page_performance")
      .select("metric_name, metric_value")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const performanceAverages: Record<string, number> = {}
    const performanceCounts: Record<string, number> = {}

    performanceData?.forEach((item) => {
      performanceAverages[item.metric_name] = (performanceAverages[item.metric_name] || 0) + item.metric_value
      performanceCounts[item.metric_name] = (performanceCounts[item.metric_name] || 0) + 1
    })

    Object.keys(performanceAverages).forEach((key) => {
      performanceAverages[key] = performanceAverages[key] / performanceCounts[key]
    })

    // Top pages by events
    const { data: topPages } = await supabase
      .from("analytics_events")
      .select("page_url")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const pageCount: Record<string, number> = {}
    topPages?.forEach((item) => {
      pageCount[item.page_url] = (pageCount[item.page_url] || 0) + 1
    })

    const topPagesSorted = Object.entries(pageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, count]) => ({ url, count }))

    return NextResponse.json({
      summary: {
        totalEvents: totalEvents || 0,
        avgScrollDepth: Math.round(avgScrollDepth),
        avgTimeOnPage: Math.round(avgTimeOnPage),
      },
      eventsByType: Object.entries(eventTypeCount)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => ({ type, count })),
      performance: performanceAverages,
      topPages: topPagesSorted,
    })
  } catch (error) {
    console.error("[v0] Dashboard data error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
