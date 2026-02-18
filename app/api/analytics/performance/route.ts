import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

const performancePayloadSchema = z.object({
  pageUrl: z.string().min(1, "pageUrl is required"),
  metrics: z.record(z.coerce.number({ invalid_type_error: "metrics values must be numbers" })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedResult = performancePayloadSchema.safeParse(body)

    if (!parsedResult.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
    }

    const { pageUrl, metrics } = parsedResult.data

    // Gracefully skip if Supabase is not configured
    const supabaseUrl = getSupabaseUrl()
    const supabaseKey = getSupabaseServiceRoleKey()

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const entries = Object.entries(metrics)
      .filter(([, v]) => Number.isFinite(v))
      .map(([name, value]) => ({
        page_url: pageUrl,
        metric_name: name,
        metric_value: value,
        user_agent: request.headers.get("user-agent"),
      }))

    if (entries.length === 0) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const { error } = await supabase.from("page_performance").insert(entries)

    if (error) {
      return NextResponse.json({ success: true, skipped: true })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true, skipped: true })
  }
}
