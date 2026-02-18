import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, maxScrollPercentage, timeOnPage, sessionId } = body

    const supabaseUrl = getSupabaseUrl()
    if (!supabaseUrl) {
      return NextResponse.json({ success: true, skipped: true, reason: "no_credentials" }, { status: 200 })
    }

    let supabaseKey: string
    try {
      supabaseKey = getSupabaseServiceRoleKey()
    } catch {
      return NextResponse.json({ success: true, skipped: true }, { status: 200 })
    }

    try {
      new URL(supabaseUrl)
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "invalid_url" }, { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from("scroll_tracking").insert({
      page_url: pageUrl,
      max_scroll_percentage: maxScrollPercentage,
      time_on_page: timeOnPage,
      session_id: sessionId,
    })

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("Could not find")) {
        return NextResponse.json({ success: true, skipped: true }, { status: 200 })
      }
      return NextResponse.json({ success: true, skipped: true, reason: "db_error" }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Scroll tracking error:", error)
    return NextResponse.json({ success: true, skipped: true }, { status: 200 })
  }
}
