import { createClient } from "@supabase/supabase-js"
import { getSupabaseUrl } from "./config"

/**
 * Create a Supabase client using the service role key.
 * Throws with a descriptive error when required configuration is missing.
 */
export function createServiceRoleClient() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseKey) {
    throw new Error("Missing Supabase service role key")
  }

  return createClient(getSupabaseUrl(), supabaseKey)
}
