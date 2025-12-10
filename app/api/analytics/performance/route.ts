import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "@/lib/supabase/config"
import { z } from "zod"

const performanceMetricsSchema = z.record(
  z.coerce.number({ invalid_type_error: "metrics values must be numbers" }),
)

const performancePayloadSchema = z
  .object({
    pageUrl: z.string().min(1, "pageUrl is required"),
    metrics: performanceMetricsSchema.optional(),
    metricName: z.string().min(1, "metricName is required").optional(),
    metricValue: z
      .union([
        z.number({ invalid_type_error: "metricValue must be a number" }),
        z.string().transform((val) => Number(val)),
      ])
      .optional(),
  })
  .refine(
    (data) =>
      data.metrics && Object.keys(data.metrics).length > 0
        ? true
        : data.metricName !== undefined && data.metricValue !== undefined,
    {
      message: "metrics or metricName/metricValue is required",
      path: ["metrics"],
    },
  )

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
    const { pageUrl, metrics, metricName, metricValue } = parsedPayload

    const resolvedMetrics: Record<string, number> | undefined = metrics
      ? metrics
      : metricName !== undefined && metricValue !== undefined
        ? { [metricName]: metricValue }
        : undefined

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

    const entries = Object.entries(resolvedMetrics ?? {})
      .filter(([, metricValue]) => Number.isFinite(metricValue))
      .map(([metricName, metricValue]) => ({
        page_url: pageUrl,
        metric_name: metricName,
        metric_value: metricValue,
        user_agent: request.headers.get("user-agent"),
      }))

    if (entries.length === 0) {
      console.error("[v0] No valid metrics provided for performance payload", {
        metricKeys: resolvedMetrics ? Object.keys(resolvedMetrics) : [],
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
      metricCount: parsedPayload?.metrics
        ? Object.keys(parsedPayload.metrics).length
        : parsedPayload?.metricName
          ? 1
          : undefined,
    })
    return NextResponse.json({ error: "Failed to track performance" }, { status: 500 })
  }
}
