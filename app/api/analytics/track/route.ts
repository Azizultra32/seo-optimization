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
      return NextResponse.json({ success: true, skipped: true, reason: "no_credentials" })
    }

    // Validate Supabase URL format
    try {
      new URL(supabaseUrl)
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "invalid_url" })
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
      const errorMsg = typeof error.message === "string" ? error.message : "Database error"
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Analytics insert error:", errorMsg)
      }
      return NextResponse.json({ success: false, error: errorMsg }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // Safely extract error message
    const errorMsg = error instanceof Error ? error.message : "Internal error"
    if (process.env.NODE_ENV === "development") {
      console.error("[v0] Analytics tracking error:", errorMsg)
    }
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 200 })
  }
}
