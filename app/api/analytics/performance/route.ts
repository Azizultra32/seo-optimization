import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, metrics } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Silently skip if not configured
      return NextResponse.json({ success: true, skipped: true, reason: "no_credentials" })
    }

    // Validate URL format
    try {
      new URL(supabaseUrl)
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "invalid_url" })
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const entries = Object.entries(metrics).map(([metricName, metricValue]) => ({
        page_url: pageUrl,
        metric_name: metricName,
        metric_value: metricValue as number,
        user_agent: request.headers.get("user-agent"),
      }))

      const { error } = await supabase.from("page_performance").insert(entries)

      if (error) {
        return NextResponse.json({ success: true, skipped: true, reason: "db_error" })
      }

      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "connection_error" })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Internal error"
    if (process.env.NODE_ENV === "development") {
      console.error("[v0] Performance tracking error:", errorMsg)
    }
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 200 })
  }
}
