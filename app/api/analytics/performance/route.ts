import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "@/lib/supabase/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, metrics } = body

    const supabaseUrl = getSupabaseUrl()
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseKey) {
      console.error("[v0] Missing Supabase service role key")
      return NextResponse.json({ success: false, error: "Missing configuration" }, { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const entries = Object.entries(metrics).map(([metricName, metricValue]) => ({
      page_url: pageUrl,
      metric_name: metricName,
      metric_value: metricValue as number,
      user_agent: request.headers.get("user-agent"),
    }))

    const { error } = await supabase.from("page_performance").insert(entries)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Performance tracking error:", error)
    return NextResponse.json({ error: "Failed to track performance" }, { status: 500 })
  }
}
