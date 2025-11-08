import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/api-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, metrics } = body

    const supabase = getServerClient()

    const entries = Object.entries(metrics).map(([metricName, metricValue]) => ({
      event_type: "performance",
      event_name: metricName,
      page_url: pageUrl,
      tenant: "harvest-studio",
      metadata: { value: metricValue },
      user_agent: request.headers.get("user-agent"),
    }))

    const { error } = await supabase.from("events").insert(entries)

    if (error) {
      console.error("[v0] Performance tracking error:", error.message)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Performance tracking error:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
