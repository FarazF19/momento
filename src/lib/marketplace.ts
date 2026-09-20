import "server-only";
import { createClient } from "@supabase/supabase-js";
import { authConfigured } from "./supabase/server";
import type { AdSlot, Moment } from "./moments";

// Anonymous read client: public listing reads can never expose offers or profiles.
function publicClient() {
  if (!authConfigured()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}
export type ListingRow = {
  id: string; title: string; category: Moment["category"]; creator_name: string; handle: string;
  audience: string; followers: number; city: string; country: string; start_date: string; end_date: string;
  asking_price_minor: number; details: Record<string, unknown>;
};

function asText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asSlots(value: unknown): AdSlot[] | undefined {
  const parsed = typeof value === "string" ? (() => { try { return JSON.parse(value); } catch { return null; } })() : value;
  if (!Array.isArray(parsed) || !parsed.length) return undefined;
  return parsed.map((slot, index) => {
    const item = slot && typeof slot === "object" ? slot as Record<string, unknown> : {};
    const price = Number(item.price);
    return {
      id: asText(item.id, `s${index + 1}`),
      name: asText(item.name, `Slot ${index + 1}`),
      brand: asText(item.brand, "Open"),
      price: Number.isFinite(price) ? price : 0,
      color: asText(item.color, "#ffe04d"),
    };
  });
}

export function asPlacement(row: ListingRow): Moment {
  const d = row.details || {};
  const slots = asSlots(d.slots);
  const bodyKind = d.bodyKind === "dress" || d.bodyKind === "body" ? d.bodyKind : undefined;
  const priceMode = asText(d.priceMode);
  const duration = row.start_date + " – " + row.end_date;
  const surface = asText(d.surface);
  const dimensions = asText(d.dimensions);
  return {
    slug: row.id, title: row.title, category: row.category, industry: asText(d.industry), city: row.city, country: row.country,
    dates: duration, startDate: row.start_date, month: new Date(row.start_date + "T12:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase(),
    tagline: asText(d.visibility), surface, dimensions, duration,
    itinerary: asText(d.itinerary), visibility: asText(d.visibility), proof: asText(d.proof), production: asText(d.production), exclusivity: asText(d.exclusivity),
    isDemo: false, photoUrl: asText(d.photoUrl), bodyKind, slots, raisedLabel: priceMode === "offer" ? "Open to offers" : undefined, creator: { name: row.creator_name, handle: row.handle, niche: row.audience,
      portraitUrl: asText(d.portraitUrl) || undefined, socialUrl: asText(d.socialUrl) || undefined, audienceSource: asText(d.audienceSource) || undefined, followers: new Intl.NumberFormat("en", { notation: "compact" }).format(row.followers), avatar: row.creator_name.slice(0, 2).toUpperCase() },
    color: "#f5d8c4", accent: "#ffe04d", fit: [],
    inventory: slots?.length
      ? slots.map((slot) => ({ id: slot.id, name: slot.name, description: slot.brand, timing: duration, reach: "No guaranteed impressions", price: slot.price, remaining: 1 }))
      : [{ id: "placement", name: surface, description: dimensions, timing: duration, reach: "No guaranteed impressions", price: row.asking_price_minor / 100, remaining: 1 }],
  };
}
export async function publishedPlacements() {
  const client = publicClient();
  if (!client) return { placements: [] as Moment[], unavailable: false };
  const query = client.from("placements").select("*").eq("status", "published").gte("end_date", new Date().toISOString().slice(0, 10)).order("start_date").limit(24);
  const { data, error } = await Promise.race([
    query,
    new Promise<{ data: null; error: { message: string } }>((resolve) => setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 2500)),
  ]);
  return { placements: error || !data ? [] : (data as ListingRow[]).map(asPlacement), unavailable: Boolean(error) };
}
export async function publishedPlacement(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const client = publicClient();
  if (!client) return null;
  const { data, error } = await client.from("placements").select("*").eq("id", id).eq("status", "published").single();
  return error || !data ? null : asPlacement(data as ListingRow);
}
