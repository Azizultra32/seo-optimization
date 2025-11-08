import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "@/lib/supabase/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, maxScrollPercentage, timeOnPage, sessionId } = body

    const supabaseUrl = getSupabaseUrl()
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseKey) {
      console.error("[v0] Missing Supabase service role key")
      return NextResponse.json({ success: false, error: "Missing configuration" }, { status: 200 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from("scroll_tracking").insert({
      page_url: pageUrl,
      max_scroll_percentage: maxScrollPercentage,
      time_on_page: timeOnPage,
      session_id: sessionId,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Scroll tracking error:", error)
    return NextResponse.json({ error: "Failed to track scroll" }, { status: 500 })
  }
}
