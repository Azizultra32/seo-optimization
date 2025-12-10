import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

type SchemaRecommendation = {
  type: string
  properties: string[]
}

type Recommendation = {
  meta_title: string
  meta_description: string
  keywords: string[]
  schema_recommendations: SchemaRecommendation
  content_improvements: string[]
  confidence: number
}

const DEFAULT_CONTENT_IMPROVEMENTS = [
  "Add an FAQ section that answers common patient questions to build trust.",
  "Include author credentials and medical review details to satisfy E-E-A-T.",
  "Add internal links to related services and blog posts for stronger topical authority.",
  "Compress and add descriptive alt text to images to improve accessibility and SEO.",
  "Surface calls-to-action that guide users to book appointments or learn more.",
  "Improve Core Web Vitals by optimizing LCP assets and reducing render-blocking scripts.",
  "Ensure canonical tags are present and correct to prevent duplicate content issues.",
]

// Normalize model output so downstream consumers always receive a complete, actionable payload
function normalizeRecommendations(raw: unknown): Recommendation {
  const fallback: Recommendation = {
    meta_title: "Add the correct meta title",
    meta_description: "Add the correct meta description",
    keywords: [],
    schema_recommendations: { type: "Article", properties: [] },
    content_improvements: DEFAULT_CONTENT_IMPROVEMENTS,
    confidence: 0.8,
  }

  if (!raw || typeof raw !== "object") return fallback

  const recommendation = raw as Partial<Recommendation>
  const normalizedSchema = recommendation.schema_recommendations
    ? {
        type: typeof recommendation.schema_recommendations.type === "string"
          ? recommendation.schema_recommendations.type
          : fallback.schema_recommendations.type,
        properties: Array.isArray(recommendation.schema_recommendations.properties)
          ? recommendation.schema_recommendations.properties.filter((prop): prop is string => typeof prop === "string")
          : fallback.schema_recommendations.properties,
      }
    : fallback.schema_recommendations

  const normalizedContentImprovements = Array.isArray(recommendation.content_improvements)
    ? recommendation.content_improvements.filter((improvement): improvement is string => typeof improvement === "string")
    : []

  // Ensure we always return at least six prioritized, actionable improvements with technical coverage
  const supplementedImprovements = [
    ...normalizedContentImprovements,
    ...DEFAULT_CONTENT_IMPROVEMENTS.filter(
      (fallbackImprovement) => !normalizedContentImprovements.includes(fallbackImprovement),
    ),
  ]
  const technicalKeywords = ["performance", "core web vitals", "index", "canonical", "schema", "crawl"]
  const technicalCount = supplementedImprovements.filter((item) =>
    technicalKeywords.some((keyword) => item.toLowerCase().includes(keyword)),
  ).length
  if (technicalCount < 2) {
    supplementedImprovements.push(
      "Audit indexing and robots directives to ensure priority pages are crawlable.",
      "Verify canonical, hreflang, and sitemap signals to resolve duplication or targeting conflicts.",
    )
  }

  const trimmedMetaTitle = typeof recommendation.meta_title === "string" ? recommendation.meta_title.trim() : ""
  const trimmedMetaDescription =
    typeof recommendation.meta_description === "string" ? recommendation.meta_description.trim() : ""

  return {
    meta_title: trimmedMetaTitle || fallback.meta_title,
    meta_description: trimmedMetaDescription || fallback.meta_description,
    keywords: Array.isArray(recommendation.keywords)
      ? recommendation.keywords.filter((keyword): keyword is string => typeof keyword === "string")
      : fallback.keywords,
    schema_recommendations: normalizedSchema,
    content_improvements: supplementedImprovements.slice(0, Math.max(6, supplementedImprovements.length)),
    confidence: typeof recommendation.confidence === "number" ? recommendation.confidence : fallback.confidence,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, content, currentMeta } = await request.json()

    if (!url || !content) {
      return NextResponse.json({ error: "URL and content are required" }, { status: 400 })
    }

    console.log("[v0] Analyzing SEO for URL:", url)

    const openai = getOpenAIClient()

    // Use OpenAI to analyze content and generate SEO recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO analyst specializing in medical and healthcare websites.
          Analyze the provided content and generate optimized SEO recommendations that:
          - Follow YMYL (Your Money Your Life) best practices
          - Meet E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) standards
          - Are optimized for both traditional search engines and AI answer engines
          - Include medical terminology appropriately
          - Maintain professional, trustworthy tone
          - Provide at least six prioritized suggestions that mix quick wins (alt text, headings, schema) and depth improvements (FAQs, trust signals, internal links)

          Return your analysis as JSON with this structure:
          {
            "meta_title": "optimized title (50-60 chars)",
            "meta_description": "compelling description (150-160 chars)",
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "schema_recommendations": {
              "type": "schema type to add",
              "properties": ["list of important properties"]
            },
            "content_improvements": [
              "At least six prioritized, actionable recommendations (on-page copy, headings, internal links, media, accessibility)",
              "Include at least two technical SEO fixes (performance, indexing, canonicalization, schema gaps)",
              "Call out quick wins with clear next steps and example phrasing"
            ],
            "confidence": 0.85
          }`,
        },
        {
          role: "user",
          content: `URL: ${url}
          
Current Meta:
Title: ${currentMeta?.title || "None"}
Description: ${currentMeta?.description || "None"}

Page Content:
${content.substring(0, 3000)}

Analyze and provide SEO recommendations.`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const recommendations = normalizeRecommendations(JSON.parse(completion.choices[0].message.content || "{}"))

    console.log("[v0] Generated recommendations:", recommendations)

    // Store recommendations in Supabase
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ai_recommendations")
      .insert({
        url,
        meta_title: recommendations.meta_title,
        meta_description: recommendations.meta_description,
        schema: recommendations.schema_recommendations,
        confidence: recommendations.confidence || 0.8,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Saved recommendations to database")

    return NextResponse.json({
      success: true,
      recommendations,
      saved: data,
    })
  } catch (error) {
    console.error("[v0] SEO analysis error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze SEO" },
      { status: 500 },
    )
  }
}

// GET endpoint to retrieve recommendations for a URL
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("url", url)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error
    }

    return NextResponse.json({
      success: true,
      recommendation: data || null,
    })
  } catch (error) {
    console.error("[v0] Error fetching recommendations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch recommendations" },
      { status: 500 },
    )
  }
}
