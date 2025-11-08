import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseUrl, getSupabaseAnonKey } from "./config"

// Single shared browser client instance
export const supabase = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
