export function getSupabaseUrl(): string {
  // Check if URL is explicitly set
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  // Derive from Postgres URL if available
  const postgresUrl = process.env.SUPABASE_POSTGRES_URL
  if (postgresUrl) {
    // Extract project reference from postgres://postgres.{PROJECT_REF}:...@aws-0-us-east-1.pooler.supabase.com
    const match = postgresUrl.match(/postgres\.([a-z0-9]+):/)
    if (match && match[1]) {
      const supabaseUrl = `https://${match[1]}.supabase.co`
      console.log("[v0] Derived Supabase URL:", supabaseUrl)
      return supabaseUrl
    }
  }

  console.error("[v0] Failed to derive Supabase URL. SUPABASE_POSTGRES_URL:", postgresUrl)
  throw new Error("Missing Supabase URL configuration")
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return key
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }
  return key
}
