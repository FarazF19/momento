import "server-only";
import { creatorPlatforms, safePublicUrl, type VerificationPayload } from "./verification";

// Automatic marketplace review. The server fetches the applicant's public page,
// confirms the unique ownership code is visible on it, and picks up the public
// name, photo, and audience size. No passwords, tokens, or private data involved.

export type AutoReviewResult = {
  decision: "approved" | "needs_changes";
  note: string;
  identity: Record<string, string>;
};

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const MAX_BYTES = 3_000_000;

function decodeEntities(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&#x27;/gi, "'").trim();
}

function metaContent(html: string, key: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`, "i"),
  ];
  for (const pattern of patterns) { const match = html.match(pattern); if (match?.[1]) return decodeEntities(match[1]); }
  return "";
}

function cleanName(raw: string): string {
  return decodeEntities(raw)
    .replace(/\s*\(@[^)]*\).*$/, "")
    .replace(/\s*[|•·–-]\s*(Instagram|TikTok|Twitter|X)\b.*$/i, "")
    .replace(/\s+on\s+(Instagram|TikTok|X|Twitter)\s*$/i, "")
    .trim().slice(0, 120);
}

function parseCount(raw: string): number | null {
  const match = raw.trim().match(/^([\d.,]+)\s*([KMB])?$/i);
  if (!match) return null;
  const base = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(base)) return null;
  const factor = { K: 1e3, M: 1e6, B: 1e9 }[(match[2] || "").toUpperCase() as "K" | "M" | "B"] || 1;
  return Math.round(base * factor);
}

function extractFollowers(html: string): number | null {
  const json = html.match(/"(?:followerCount|follower_count)"\s*:\s*(\d{1,10})/) || html.match(/"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d{1,10})/);
  if (json) return Number(json[1]);
  const text = html.match(/([\d][\d.,]*\s*[KMB]?)\s*Followers/i);
  return text ? parseCount(text[1]) : null;
}

async function fetchPublicPage(url: string, hops = 0): Promise<{ html: string } | { error: string }> {
  if (hops > 4) return { error: "The page redirected too many times." };
  if (!safePublicUrl(url)) return { error: "The page redirected to a disallowed address." };
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en" },
      redirect: "manual", // every redirect hop is re-validated against safePublicUrl
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return { error: "The page redirected without a destination." };
      return fetchPublicPage(new URL(location, url).href, hops + 1);
    }
    if (!response.ok) return { error: `The page responded with status ${response.status}.` };
    const html = (await response.text()).slice(0, MAX_BYTES);
    return { html };
  } catch {
    return { error: "The page did not respond in time." };
  }
}

export async function runAutoReview(role: "creator" | "brand", payload: VerificationPayload, ownershipCode: string): Promise<AutoReviewResult> {
  const profileUrl = payload.profileUrl;
  const platformLabel = role === "creator" ? creatorPlatforms[payload.platform]?.label || "your platform" : "your website";
  if (!safePublicUrl(profileUrl)) return { decision: "needs_changes", note: "Add a public HTTPS link to your profile or website, then verify again.", identity: {} };

  const result = await fetchPublicPage(profileUrl);
  if ("error" in result) {
    return {
      decision: "needs_changes",
      note: `We couldn’t read your public page automatically (${result.error}) Make sure the page is public, then press Verify again. Creators: TikTok verifies most reliably; you can switch platforms at any time.`,
      identity: {},
    };
  }

  const { html } = result;
  const codeFound = html.toUpperCase().includes(ownershipCode.toUpperCase());
  if (!codeFound) {
    return {
      decision: "needs_changes",
      note: `We read your page but couldn’t find your code ${ownershipCode} on it yet. Add the exact code to your public ${role === "creator" ? "bio" : "website or business page"}, wait a minute for ${platformLabel} to update, then press Verify again.`,
      identity: {},
    };
  }

  const identity: Record<string, string> = { verifiedProfileUrl: profileUrl, verifiedAt: new Date().toISOString() };
  const name = cleanName(metaContent(html, "og:title") || metaContent(html, "twitter:title") || decodeEntities((html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "")));
  const photo = metaContent(html, "og:image") || metaContent(html, "twitter:image");
  const followers = role === "creator" ? extractFollowers(html) : null;
  if (name) identity.fetchedName = name;
  if (photo && safePublicUrl(photo)) identity.fetchedPhoto = photo.slice(0, 2000);
  if (followers !== null) identity.fetchedFollowers = String(followers);
  if (role === "brand") { const site = metaContent(html, "og:site_name"); if (site) identity.fetchedName = cleanName(site); }

  const picked = [identity.fetchedName && "name", identity.fetchedPhoto && "photo", identity.fetchedFollowers && "audience size"].filter(Boolean).join(", ");
  return {
    decision: "approved",
    note: `Automatically verified: your code was found live on ${new URL(profileUrl).hostname}.${picked ? ` We picked up your ${picked} from your public page.` : ""} You can remove the code from your ${role === "creator" ? "bio" : "page"} now.`,
    identity,
  };
}
