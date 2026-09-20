import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only privileged client for recording automatic review decisions.
// The secret key must never be exposed to the browser or committed.
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
