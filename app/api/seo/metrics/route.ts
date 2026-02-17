import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Store Google Search Console metrics
export async function POST(request: NextRequest) {
  try {
    const { url, date, clicks, impressions, queries } = await request.json()

    if (!url || !date) {
      return NextResponse.json({ error: "URL and date are required" }, { status: 400 })
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ success: true, skipped: true, reason: "no_database" })
    }

    const { data, error } = await supabase
      .from("page_metrics")
      .insert({
        url,
        date,
        clicks: clicks || 0,
        impressions: impressions || 0,
        queries: queries || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("[v0] Error storing metrics:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to store metrics" },
      { status: 500 },
    )
  }
}

// Get metrics for a URL
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")
    const days = Number.parseInt(request.nextUrl.searchParams.get("days") || "30")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ success: true, metrics: [], totals: { clicks: 0, impressions: 0 }, ctr: 0 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from("page_metrics")
      .select("*")
      .eq("url", url)
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (error) throw error

    // Calculate totals
    const totals = data.reduce(
      (acc, row) => ({
        clicks: acc.clicks + (row.clicks || 0),
        impressions: acc.impressions + (row.impressions || 0),
      }),
      { clicks: 0, impressions: 0 },
    )

    return NextResponse.json({
      success: true,
      metrics: data,
      totals,
      ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch metrics" },
      { status: 500 },
    )
  }
}
