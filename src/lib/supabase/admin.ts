import { createClient } from "@supabase/supabase-js";

// Service-role client. SERVER ONLY. Bypasses RLS.
// Used to bootstrap rooms/members during the public submit flow,
// where the freshly-created guest user can't yet insert protected rows.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
