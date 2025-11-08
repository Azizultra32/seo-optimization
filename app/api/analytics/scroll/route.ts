import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/api-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, maxScrollPercentage, timeOnPage, sessionId } = body

    const supabase = getServerClient()

    const { error } = await supabase.from("events").insert({
      event_type: "scroll",
      event_name: "scroll_depth",
      page_url: pageUrl,
      session_id: sessionId,
      tenant: "harvest-studio",
      metadata: {
        max_scroll_percentage: maxScrollPercentage,
        time_on_page: timeOnPage,
      },
    })

    if (error) {
      console.error("[v0] Scroll tracking error:", error.message)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Scroll tracking error:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
