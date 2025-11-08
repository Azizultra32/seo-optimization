import { type NextRequest, NextResponse } from "next/server"

// This endpoint will be called by a cron job to audit all pages
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized cron job request
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting SEO audit of all pages")

    // Define pages to audit
    const pagesToAudit = [
      {
        url: "/",
        content: "Homepage with hero, about, projects, ethical AI, and contact sections",
        currentMeta: {
          title: "Dr. Ali Ghahary - Healthcare Innovation",
          description:
            "Physician, entrepreneur, and thought leader reimagining healthcare through ethical AI and patient-centered technology.",
        },
      },
      // Add more pages as they are created
    ]

    const results = []

    for (const page of pagesToAudit) {
      try {
        // Call the analyze endpoint for each page
        const response = await fetch(`${process.env.SITE_URL}/api/seo/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        })

        const result = await response.json()
        results.push({ url: page.url, success: result.success })

        console.log(`[v0] Audited ${page.url}:`, result.success ? "✓" : "✗")
      } catch (error) {
        console.error(`[v0] Failed to audit ${page.url}:`, error)
        results.push({ url: page.url, success: false, error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      message: "SEO audit completed",
      results,
    })
  } catch (error) {
    console.error("[v0] SEO audit error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run SEO audit" },
      { status: 500 },
    )
  }
}
