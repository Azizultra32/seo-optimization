import { type NextRequest, NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/api-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventName, pageUrl, metadata, sessionId } = body

    const supabase = getServerClient()

    const { error } = await supabase.from("events").insert({
      event_type: eventType,
      event_name: eventName,
      page_url: pageUrl,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
      session_id: sessionId,
      metadata: metadata || {},
      tenant: "harvest-studio",
    })

    if (error) {
      console.error("[v0] Event tracking error:", error.message)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Analytics tracking error:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
