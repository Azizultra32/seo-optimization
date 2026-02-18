import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

export async function POST(request: NextRequest) {
  try {
    const { type, topic, variables, customPrompt } = await request.json()

    // Validate input
    if (!type || !topic) {
      return NextResponse.json({ error: "Content type and topic are required" }, { status: 400 })
    }

    // Initialize OpenAI with lazy loading
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Initialize Supabase
    const supabase = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey())

    // Get template if no custom prompt
    let prompt = customPrompt
    if (!customPrompt) {
      const { data: template } = await supabase
        .from("content_templates")
        .select("prompt_template")
        .eq("type", type)
        .eq("active", true)
        .single()

      if (template) {
        prompt = template.prompt_template
        // Replace variables in template
        if (variables) {
          Object.entries(variables).forEach(([key, value]) => {
            prompt = prompt.replace(`{${key}}`, value as string)
          })
        }
      } else {
        prompt = `Write a professional ${type} about ${topic} for a healthcare AI company. Focus on innovation, ethics, and real-world impact.`
      }
    }

    // Add context about Armada MD
    const contextPrompt = `${prompt}

Context about Armada MD:
- Founded by Dr. Ali Ghahary, a board-certified physician with 20+ years of experience
- Focuses on ethical AI in healthcare
- Products: Armada Housecall (virtual care), Armada AssistMD (AI documentation), Armada ArkPass (patient data management)
- Core values: Patient-centricity, clinician-centricity, data sovereignty, compliance
- Presented "The KNGHT Doctrine" at World Economic Forum on AI ethics in healthcare

Write in a professional, authoritative tone that reflects medical expertise and technological innovation.`

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical writer and healthcare technology thought leader. Write clear, engaging, and authoritative content about healthcare AI and innovation.",
        },
        {
          role: "user",
          content: contextPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0].message.content || ""

    // Generate title from content
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Generate a compelling, SEO-friendly title for this content. Return only the title, no quotes or extra text.",
        },
        {
          role: "user",
          content: generatedContent.substring(0, 500),
        },
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
          content: "Generate a compelling 2-3 sentence excerpt/summary for this content.",
        },
        {
          role: "user",
          content: generatedContent.substring(0, 500),
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const excerpt = excerptCompletion.choices[0].message.content?.trim() || ""

    // Generate slug
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
          content: "Extract 5-7 relevant SEO keywords from this content. Return as a JSON array of strings.",
        },
        {
          role: "user",
          content: generatedContent,
        },
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
    if (generatedContent.includes("Armada Housecall")) internalLinks.push("/products/housecall")
    if (generatedContent.includes("Armada AssistMD")) internalLinks.push("/products/assistmd")
    if (generatedContent.includes("Armada ArkPass")) internalLinks.push("/products/arkpass")
    if (generatedContent.includes("ethics") || generatedContent.includes("ethical")) internalLinks.push("/#ethical-ai")
    if (generatedContent.includes("contact") || generatedContent.includes("demo")) internalLinks.push("/#contact")

    // Save draft to database
    const { data: draft, error: dbError } = await supabase
      .from("content_drafts")
      .insert({
        type,
        title,
        slug,
        content: generatedContent,
        excerpt,
        status: "draft",
        keywords,
        internal_links: internalLinks,
        metadata: { topic, variables, generated_at: new Date().toISOString() },
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Log generation
    await supabase.from("content_generation_log").insert({
      content_id: draft.id,
      prompt: contextPrompt,
      model: "gpt-4o",
      tokens_used: completion.usage?.total_tokens || 0,
      success: true,
    })

    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        title,
        slug,
        content: generatedContent,
        excerpt,
        keywords,
        internal_links: internalLinks,
        type,
        status: "draft",
      },
    })
  } catch (error) {
    console.error("Content generation error:", error)

    // Log error
    try {
      const supabase = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey())
      await supabase.from("content_generation_log").insert({
        success: false,
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
    } catch {}

    return NextResponse.json(
      { error: "Failed to generate content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
