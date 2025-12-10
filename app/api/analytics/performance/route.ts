import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "@/lib/supabase/config"
import { z } from "zod"

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
      console.error("[v0] Invalid performance payload", {
        issues: parsedResult.error.issues,
      })

      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      )
    }

    parsedPayload = parsedResult.data
    const { pageUrl, metrics } = parsedPayload

    const supabaseUrl = getSupabaseUrl()
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseKey) {
      console.error("[v0] Missing Supabase service role key", {
        context: "performance-tracking",
      })

      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 },
      )
    }

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
      console.error("[v0] No valid metrics provided for performance payload", {
        metricKeys: Object.keys(metrics),
      })

      return NextResponse.json(
        { error: "No valid performance metrics provided" },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("page_performance").insert(entries)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Performance tracking error", {
      error,
      pageUrl: parsedPayload?.pageUrl,
      metricCount: parsedPayload ? Object.keys(parsedPayload.metrics).length : undefined,
    })
    return NextResponse.json({ error: "Failed to track performance" }, { status: 500 })
  }
}
