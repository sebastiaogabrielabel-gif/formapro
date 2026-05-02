import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client avec service_role — uniquement côté serveur, jamais exposé au client
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
