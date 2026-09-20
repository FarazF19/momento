import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { safeNext } from "@/lib/app-origin";
import { sanitizeHandle } from "@/lib/placement-validation";

function safeRole(value: string | null) {
  return value === "brand" ? "brand" : "creator";
}

async function finishGoogleProfile(
  client: NonNullable<Awaited<ReturnType<typeof supabaseServer>>>,
  requestedRole: "creator" | "brand",
) {
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;
  const existing = (user.user_metadata || {}) as Record<string, unknown>;
  const name = String(existing.name || existing.full_name || user.email?.split("@")[0] || "Member").trim().slice(0, 100);
  const role = existing.role === "brand" || existing.role === "creator" ? existing.role : requestedRole;
  const handle = sanitizeHandle(String(existing.handle || ""), name);
  const niche = typeof existing.niche === "string" && existing.niche.trim() ? existing.niche : "Lifestyle";
  await client.auth.updateUser({ data: { name, role, handle, niche } });
  const admin = adminClient();
  if (admin) await admin.from("profiles").update({ name, role }).eq("id", user.id);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const role = safeRole(url.searchParams.get("role"));
  const client = await supabaseServer();
  if (client && code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      await finishGoogleProfile(client, role);
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/login?message=" + encodeURIComponent("Google sign-in did not finish. Try again, or use email.") + "&next=" + encodeURIComponent(next), url.origin));
}
