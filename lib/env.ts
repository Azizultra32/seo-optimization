// Server-side only environment variables
export function getServerEnv() {
  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabasePostgresUrl: process.env.SUPABASE_POSTGRES_URL,
    cronSecret: process.env.CRON_SECRET,
    googleServiceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    searchConsoleCredentials: process.env.SEARCH_CONSOLE_CREDENTIALS_JSON,
  }
}

// Client-side safe environment variables
export function getClientEnv() {
  return {
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    siteUrl: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  }
}

// Validate required environment variables
export function validateEnv(keys: string[]): void {
  const missing: string[] = []

  keys.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key)
    }
  })

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
