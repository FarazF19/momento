import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const client = await supabaseServer();
  if (client && code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      const next = url.searchParams.get("next") === "/auth/reset" ? "/auth/reset" : "/dashboard";
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/login?message=This+link+expired.+Sign+in+or+request+a+new+link.", url.origin));
}
