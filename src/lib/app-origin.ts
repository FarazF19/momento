// Only trusted configuration may determine authentication redirects.
export function appOrigin(env: Record<string, string | undefined> = process.env) {
  const fallback = env.NODE_ENV === "development" ? "http://localhost:3000" : "https://momento-nine-rho.vercel.app";
  try {
    const url = new URL(env.APP_URL?.trim() || fallback);
    if (url.username || url.password || !["https:", "http:"].includes(url.protocol)) return fallback;
    if (url.protocol === "http:" && env.NODE_ENV !== "development") return fallback;
    return url.origin;
  } catch { return fallback; }
}
