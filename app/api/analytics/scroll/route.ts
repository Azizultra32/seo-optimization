import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, maxScrollPercentage, timeOnPage, sessionId } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // Silently skip if not configured
      return NextResponse.json({ success: true, skipped: true, reason: "no_credentials" })
    }

    try {
      new URL(supabaseUrl)
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "invalid_url" })
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase.from("scroll_tracking").insert({
        page_url: pageUrl,
        max_scroll_percentage: maxScrollPercentage,
        time_on_page: timeOnPage,
        session_id: sessionId,
      })

      if (error) {
        return NextResponse.json({ success: true, skipped: true, reason: "db_error" })
      }

      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "connection_error" })
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[v0] Scroll tracking error:", error)
    }
    return NextResponse.json({ success: true, skipped: true }, { status: 200 })
  }
}
