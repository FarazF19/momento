export type VerificationPayload = Record<string, string>;
export function safePublicUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password && !u.hash && u.hostname.includes(".") && !u.hostname.endsWith(".local") && !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname); } catch { return false; }
}
export function validateVerification(role: "creator" | "brand", data: VerificationPayload): string | null {
  if (data.adult !== "yes" || data.accurate !== "yes") return "Confirm your age and that these details are accurate.";
  if (!safePublicUrl(data.profileUrl || "")) return "Add a public HTTPS profile or business link without credentials.";
  if (!data.summary || data.summary.trim().length < 30 || data.summary.length > 1500) return "Tell us about your plans in 30–1,500 characters.";
  if (role === "creator") {
    const hosts: Record<string, string[]> = { instagram: ["instagram.com", "www.instagram.com"], tiktok: ["tiktok.com", "www.tiktok.com"], x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"] };
    const u = new URL(data.profileUrl);
    if (!hosts[data.platform]?.includes(u.hostname) || !/^\/@?[a-zA-Z0-9_.]+\/?$/.test(u.pathname)) return "Choose Instagram, TikTok, or X and link directly to your public profile.";
    if (!safePublicUrl(data.portraitUrl || "")) return "Add a public HTTPS link to your own portrait.";
    if (!/^\d{1,10}$/.test(data.followers || "") || Number(data.followers) > 2147483647) return "Enter your current follower count as a whole number.";
    if (data.accountAge !== "yes" || data.recentPosts !== "yes") return "Your public account needs 90 days of history and at least 3 original posts in the last 60 days.";
    if (Number(data.followers) < 10000) return "You need at least 10,000 followers on one Instagram, TikTok, or X account. Counts cannot be combined.";
  } else if (!data.businessName || data.businessName.trim().length < 2 || data.businessName.length > 150 || data.authority !== "yes") return "Add your business name and confirm you can represent it.";
  return null;
}
