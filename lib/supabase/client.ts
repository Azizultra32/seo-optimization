import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from "./config"

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null
  }
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
