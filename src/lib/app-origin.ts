// Only trusted configuration may determine authentication redirects.
export const AUTH_NEXT_PATHS = ["/dashboard", "/list", "/studio", "/verify", "/auth/reset", "/discover"] as const;

export function appOrigin(env: Record<string, string | undefined> = process.env) {
  const fallback = env.NODE_ENV === "development" ? "http://localhost:3000" : "https://momento-nine-rho.vercel.app";
  try {
    const url = new URL(env.APP_URL?.trim() || fallback);
    if (url.username || url.password || !["https:", "http:"].includes(url.protocol)) return fallback;
    if (url.protocol === "http:" && env.NODE_ENV !== "development") return fallback;
    return url.origin;
  } catch { return fallback; }
}

export function safeNext(value: string | null | undefined, fallback = "/dashboard") {
  const raw = (value || "").trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
  const pathname = raw.split("?")[0];
  return (AUTH_NEXT_PATHS as readonly string[]).includes(pathname) ? pathname : fallback;
}

export function authCallbackUrl(origin: string, next?: string, role?: string) {
  const url = new URL("/auth/callback", origin);
  if (next && next !== "/dashboard") url.searchParams.set("next", next);
  if (role === "brand" || role === "creator") url.searchParams.set("role", role);
  return url.toString();
}
