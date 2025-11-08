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
          
          Return your analysis as JSON with this structure:
          {
            "meta_title": "optimized title (50-60 chars)",
            "meta_description": "compelling description (150-160 chars)",
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "schema_recommendations": {
              "type": "schema type to add",
              "properties": ["list of important properties"]
            },
            "content_improvements": ["suggestion 1", "suggestion 2"],
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

    const recommendations = JSON.parse(completion.choices[0].message.content || "{}")

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
