import { createBrowserClient } from "@supabase/ssr"

// Create a singleton to prevent multiple instances
let supabase: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabase === null) {
    // Check if environment variables exist and provide fallback for development
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL and Anon Key are required! Check your environment variables.")
    }

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}
