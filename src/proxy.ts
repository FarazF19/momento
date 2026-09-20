import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PREFIXES = ["/dashboard", "/studio", "/list", "/verify", "/review", "/login", "/auth", "/api/marketplace", "/onboard", "/checkout"];

function needsSession(pathname: string) {
  return AUTH_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!needsSession(request.nextUrl.pathname)) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  let next = response;
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        next = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => next.cookies.set(name, value, options));
      },
    },
  });
  await client.auth.getUser();
  next.headers.set("Cache-Control", "private, no-store");
  return next;
}

export const config = {
  matcher: ["/dashboard/:path*", "/studio/:path*", "/list", "/verify", "/review", "/login", "/auth/:path*", "/api/marketplace/:path*", "/onboard/:path*", "/checkout/:path*"],
};
