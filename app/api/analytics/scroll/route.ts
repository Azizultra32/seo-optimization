import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageUrl, maxScrollPercentage, timeOnPage, sessionId } = body

    // Gracefully skip if Supabase is not configured
    const supabaseUrl = getSupabaseUrl()
    const supabaseKey = getSupabaseServiceRoleKey()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from("scroll_tracking").insert({
      page_url: pageUrl,
      max_scroll_percentage: maxScrollPercentage,
      time_on_page: timeOnPage,
      session_id: sessionId,
    })

    if (error) {
      return NextResponse.json({ success: true, skipped: true })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true, skipped: true })
  }
}
