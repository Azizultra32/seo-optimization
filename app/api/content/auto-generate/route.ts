import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

// Topics for automatic content generation
const AUTO_TOPICS = [
  { type: "blog", topic: "Latest advances in AI-powered clinical documentation" },
  { type: "blog", topic: "Ethical considerations in healthcare AI implementation" },
  { type: "blog", topic: "Improving patient outcomes through virtual care technology" },
  { type: "blog", topic: "Data privacy and security in modern healthcare systems" },
  { type: "product_update", topic: "New features improving clinical workflow efficiency" },
  { type: "case_study", topic: "How AI is transforming primary care delivery" },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error("[v0] CRON_SECRET environment variable is not set")
      return NextResponse.json({ error: "Server configuration error: CRON_SECRET not configured" }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const supabase = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey())

    // Check how many drafts were created in the last week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { data: recentDrafts } = await supabase
      .from("content_drafts")
      .select("id")
      .gte("created_at", oneWeekAgo.toISOString())

    // Generate 2-3 pieces per week max
    const draftsToGenerate = Math.max(0, 3 - (recentDrafts?.length || 0))

    if (draftsToGenerate === 0) {
      return NextResponse.json({
        success: true,
        message: "Content quota reached for this week",
        generated: 0,
      })
    }

    const results = []

    // Select random topics
    const selectedTopics = AUTO_TOPICS.sort(() => Math.random() - 0.5).slice(0, draftsToGenerate)

    for (const { type, topic } of selectedTopics) {
      try {
        // Get template
        const { data: template } = await supabase
          .from("content_templates")
          .select("prompt_template")
          .eq("type", type)
          .eq("active", true)
          .single()

        let prompt = template?.prompt_template || `Write a professional ${type} about ${topic}`
        prompt = prompt.replace("{topic}", topic)

        const contextPrompt = `${prompt}

Context about Armada MD:
- Founded by Dr. Ali Ghahary, a board-certified physician with 20+ years of experience
- Focuses on ethical AI in healthcare
- Products: Armada Housecall (virtual care), Armada AssistMD (AI documentation), Armada ArkPass (patient data management)
- Core values: Patient-centricity, clinician-centricity, data sovereignty, compliance
- Presented "The KNGHT Doctrine" at World Economic Forum on AI ethics in healthcare

Write in a professional, authoritative tone that reflects medical expertise and technological innovation.`

        // Generate content
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert medical writer and healthcare technology thought leader.",
            },
            { role: "user", content: contextPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        })

        const content = completion.choices[0].message.content || ""

        // Generate title
        const titleCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Generate a compelling SEO-friendly title. Return only the title.",
            },
            { role: "user", content: content.substring(0, 500) },
          ],
          temperature: 0.7,
          max_tokens: 100,
        })

        const title = titleCompletion.choices[0].message.content?.trim() || topic

        // Generate excerpt
        const excerptCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Generate a compelling 2-3 sentence excerpt.",
            },
            { role: "user", content: content.substring(0, 500) },
          ],
          temperature: 0.7,
          max_tokens: 150,
        })

        const excerpt = excerptCompletion.choices[0].message.content?.trim() || ""

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")

        // Extract keywords
        const keywordCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Extract 5-7 SEO keywords. Return as JSON array.",
            },
            { role: "user", content },
          ],
          temperature: 0.3,
          max_tokens: 100,
        })

        let keywords = []
        try {
          keywords = JSON.parse(keywordCompletion.choices[0].message.content || "[]")
        } catch {
          keywords = ["healthcare", "AI", "innovation"]
        }

        // Suggest internal links
        const internalLinks = []
        if (content.includes("Armada Housecall")) internalLinks.push("/products/housecall")
        if (content.includes("Armada AssistMD")) internalLinks.push("/products/assistmd")
        if (content.includes("Armada ArkPass")) internalLinks.push("/products/arkpass")
        if (content.includes("ethics") || content.includes("ethical")) internalLinks.push("/#ethical-ai")

        // Save draft
        const { data: draft, error: dbError } = await supabase
          .from("content_drafts")
          .insert({
            type,
            title,
            slug,
            content,
            excerpt,
            status: "draft",
            keywords,
            internal_links: internalLinks,
            metadata: { topic, auto_generated: true, generated_at: new Date().toISOString() },
          })
          .select()
          .single()

        if (!dbError) {
          await supabase.from("content_generation_log").insert({
            content_id: draft.id,
            prompt: contextPrompt,
            model: "gpt-4o",
            tokens_used: completion.usage?.total_tokens || 0,
            success: true,
          })

          results.push({ success: true, title, type })
        }
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error)
        results.push({ success: false, type, error: error instanceof Error ? error.message : "Unknown" })
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.filter((r) => r.success).length,
      results,
    })
  } catch (error) {
    console.error("Auto-generation error:", error)
    return NextResponse.json(
      { error: "Auto-generation failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
