/**
 * Supabase configuration helpers.
 * All functions gracefully handle missing environment variables
 * by returning empty strings instead of throwing.
 */

export function getSupabaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  const postgresUrl = process.env.SUPABASE_POSTGRES_URL
  if (postgresUrl) {
    const match = postgresUrl.match(/postgres\.([a-z0-9]+):/)
    if (match?.[1]) {
      return `https://${match[1]}.supabase.co`
    }
  }

  return ""
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}
