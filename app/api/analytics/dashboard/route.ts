import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/api-client"

export async function GET() {
  try {
    const supabase = getServerClient()

    // Get date range for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total events
    const { count: totalEvents } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString())

    // Events by type
    const { data: eventsByType } = await supabase
      .from("events")
      .select("event_type, event_name")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const eventTypeCount: Record<string, number> = {}
    eventsByType?.forEach((event) => {
      const key = `${event.event_type}:${event.event_name}`
      eventTypeCount[key] = (eventTypeCount[key] || 0) + 1
    })

    // Average scroll depth
    const { data: scrollData } = await supabase
      .from("events")
      .select("metadata")
      .eq("event_type", "scroll")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const avgScrollDepth =
      scrollData?.reduce((sum, item) => sum + (item.metadata?.max_scroll_percentage || 0), 0) /
        (scrollData?.length || 1) || 0

    const avgTimeOnPage =
      scrollData?.reduce((sum, item) => sum + (item.metadata?.time_on_page || 0), 0) / (scrollData?.length || 1) || 0

    // Performance metrics averages
    const { data: performanceData } = await supabase
      .from("events")
      .select("event_name, metadata")
      .eq("event_type", "performance")
      .gte("created_at", thirtyDaysAgo.toISOString())

    const performanceAverages: Record<string, number> = {}
    const performanceCounts: Record<string, number> = {}

    performanceData?.forEach((item) => {
      const value = item.metadata?.value || 0
      performanceAverages[item.event_name] = (performanceAverages[item.event_name] || 0) + value
      performanceCounts[item.event_name] = (performanceCounts[item.event_name] || 0) + 1
    })

    Object.keys(performanceAverages).forEach((key) => {
      performanceAverages[key] = performanceAverages[key] / performanceCounts[key]
    })

    // Top pages by events
    const { data: topPages } = await supabase
      .from("events")
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
