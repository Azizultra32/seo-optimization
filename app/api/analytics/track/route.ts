import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 200 })
    }

    const { eventType, eventName, pageUrl, metadata, sessionId } = body

    if (!eventType || !eventName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 200 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Silently skip analytics if not configured
      return NextResponse.json({ success: true, skipped: true })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      event_name: eventName,
      page_url: pageUrl,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
      session_id: sessionId,
      metadata: metadata || {},
    })

    if (error) {
      // Log but don't throw - analytics should not break the app
      console.error("[v0] Analytics insert error:", error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Analytics tracking error:", error)
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 200 })
  }
}
