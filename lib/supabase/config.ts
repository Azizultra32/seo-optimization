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
      return `https://${match[1]}.supabase.co`
    }
  }

  // Return empty string instead of throwing - callers should check before using
  return ""
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  return Boolean(url && key)
}
