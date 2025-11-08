import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "./config"

let serverClient: ReturnType<typeof createClient> | null = null

export function getServerClient() {
  if (!serverClient) {
    const supabaseUrl = getSupabaseUrl()
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured")
    }

    serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serverClient
}
