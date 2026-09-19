import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function authConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function supabaseServer() {
  if (!authConfigured()) return null;
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(items) {
        try { items.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Components are read-only; proxy.ts refreshes cookies. */ }
      },
    },
  });
}

export async function currentAccount() {
  const client = await supabaseServer();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || !user.email_confirmed_at) return null;
  const { data: profile } = await client.from("profiles").select("id, name, role").eq("id", user.id).single();
  return profile ? { client, user, profile: profile as { id: string; name: string; role: "creator" | "brand" } } : null;
}
