import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client navigateur — pour les Client Components uniquement
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
