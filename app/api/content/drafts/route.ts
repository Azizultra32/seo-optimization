import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const supabase = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey())

    let query = supabase.from("content_drafts").select("*").order("created_at", { ascending: false }).limit(limit)

    if (status) query = query.eq("status", status)
    if (type) query = query.eq("type", type)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ drafts: data || [] })
  } catch (error) {
    console.error("Fetch drafts error:", error)
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, content, reviewed_by } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Draft ID is required" }, { status: 400 })
    }

    const supabase = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey())

    const updates: any = { updated_at: new Date().toISOString() }
    if (status) updates.status = status
    if (content) updates.content = content
    if (reviewed_by) updates.reviewed_by = reviewed_by
    if (status === "published") updates.published_at = new Date().toISOString()

    const { data, error } = await supabase.from("content_drafts").update(updates).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, draft: data })
  } catch (error) {
    console.error("Update draft error:", error)
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 })
  }
}
