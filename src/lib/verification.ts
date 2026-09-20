export type VerificationPayload = Record<string, string>;

export const creatorPlatforms: Record<string, { label: string; hosts: string[] }> = {
  instagram: { label: "Instagram", hosts: ["instagram.com", "www.instagram.com"] },
  tiktok: { label: "TikTok", hosts: ["tiktok.com", "www.tiktok.com"] },
  x: { label: "X / Twitter", hosts: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"] },
};

const BLOCKED_HOSTS = new Set(["metadata.google.internal", "metadata.google.com"]);
export function safePublicUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password && !u.hash && u.hostname.includes(".") && !u.hostname.endsWith(".local") && !BLOCKED_HOSTS.has(u.hostname) && !/^(localhost|0\.|127\.|10\.|192\.168\.|169\.254\.|198\.1[89]\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname); } catch { return false; }
}

// Relaxed launch criteria: identity and audience details are read from the live
// public profile during the automatic check, so applicants only provide a link
// and a short plan. No follower minimum.
export function validateVerification(role: "creator" | "brand", data: VerificationPayload): string | null {
  if (data.adult !== "yes" || data.accurate !== "yes") return "Confirm your age and that these details are accurate.";
  if (!safePublicUrl(data.profileUrl || "")) return "Add a public HTTPS profile or business link without credentials.";
  if (!data.summary || data.summary.trim().length < 30 || data.summary.length > 1500) return "Tell us about your plans in 30–1,500 characters.";
  if (role === "creator") {
    const platform = creatorPlatforms[data.platform];
    const u = new URL(data.profileUrl);
    if (!platform?.hosts.includes(u.hostname) || !/^\/@?[a-zA-Z0-9_.]+\/?$/.test(u.pathname)) return "Choose Instagram, TikTok, or X and link directly to your public profile.";
  } else if (!data.businessName || data.businessName.trim().length < 2 || data.businessName.length > 150 || data.authority !== "yes") return "Add your business name and confirm you can represent it.";
  return null;
}
