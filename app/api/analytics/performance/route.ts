import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

const performancePayloadSchema = z.object({
  pageUrl: z.string().min(1, "pageUrl is required"),
  metrics: z.record(z.coerce.number({ invalid_type_error: "metrics values must be numbers" })),
})

export async function POST(request: NextRequest) {
  let parsedPayload: z.infer<typeof performancePayloadSchema> | undefined

  try {
    const body = await request.json()
    const parsedResult = performancePayloadSchema.safeParse(body)

    if (!parsedResult.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
    }

    parsedPayload = parsedResult.data
    const { pageUrl, metrics } = parsedPayload

    const supabaseUrl = getSupabaseUrl()
    if (!supabaseUrl) {
      return NextResponse.json({ success: true, skipped: true, reason: "no_credentials" }, { status: 200 })
    }

    let supabaseKey: string
    try {
      supabaseKey = getSupabaseServiceRoleKey()
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "missing_configuration" }, { status: 200 })
    }

    try {
      new URL(supabaseUrl)
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "invalid_url" }, { status: 200 })
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const entries = Object.entries(metrics)
        .filter(([, metricValue]) => Number.isFinite(metricValue))
        .map(([metricName, metricValue]) => ({
          page_url: pageUrl,
          metric_name: metricName,
          metric_value: metricValue,
          user_agent: request.headers.get("user-agent"),
        }))

      if (entries.length === 0) {
        return NextResponse.json({ error: "No valid performance metrics provided" }, { status: 400 })
      }

      const { error } = await supabase.from("page_performance").insert(entries)

      if (error) {
        return NextResponse.json({ success: true, skipped: true, reason: "db_error" }, { status: 200 })
      }

      return NextResponse.json({ success: true })
    } catch {
      return NextResponse.json({ success: true, skipped: true, reason: "connection_error" }, { status: 200 })
    }
  } catch (error) {
    console.error("[v0] Performance tracking error", {
      error,
      pageUrl: parsedPayload?.pageUrl,
      metricCount: parsedPayload ? Object.keys(parsedPayload.metrics).length : undefined,
    })
    return NextResponse.json({ error: "Failed to track performance" }, { status: 500 })
  }
}
