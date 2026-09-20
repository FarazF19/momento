import "server-only";
import { createClient } from "@supabase/supabase-js";
import { authConfigured } from "./supabase/server";
import type { Moment } from "./moments";

// Anonymous read client: public listing reads can never expose offers or profiles.
function publicClient() {
  if (!authConfigured()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}
export type ListingRow = {
  id: string; title: string; category: Moment["category"]; creator_name: string; handle: string;
  audience: string; followers: number; city: string; country: string; start_date: string; end_date: string;
  asking_price_minor: number; details: Record<string, string>;
};
export function asPlacement(row: ListingRow): Moment {
  const d = row.details;
  return {
    slug: row.id, title: row.title, category: row.category, city: row.city, country: row.country,
    dates: row.start_date + " – " + row.end_date, startDate: row.start_date, month: new Date(row.start_date + "T12:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase(),
    tagline: d.visibility, surface: d.surface, dimensions: d.dimensions, duration: row.start_date + " – " + row.end_date,
    itinerary: d.itinerary, visibility: d.visibility, proof: d.proof, production: d.production, exclusivity: d.exclusivity,
    isDemo: false, photoUrl: d.photoUrl, creator: { name: row.creator_name, handle: row.handle, niche: row.audience,
      portraitUrl: d.portraitUrl, socialUrl: d.socialUrl, followers: new Intl.NumberFormat("en", { notation: "compact" }).format(row.followers), avatar: row.creator_name.slice(0, 2).toUpperCase() },
    color: "#f5d8c4", accent: "#ffe04d", fit: [],
    inventory: [{ id: "placement", name: d.surface, description: d.dimensions, timing: row.start_date + " – " + row.end_date, reach: "No guaranteed impressions", price: row.asking_price_minor / 100, remaining: 1 }],
  };
}
export async function publishedPlacements() {
  const client = publicClient();
  if (!client) return { placements: [] as Moment[], unavailable: false };
  const { data, error } = await client.from("placements").select("*").eq("status", "published").gte("end_date", new Date().toISOString().slice(0, 10)).order("start_date").limit(100);
  return { placements: error ? [] : (data as ListingRow[]).map(asPlacement), unavailable: Boolean(error) };
}
export async function publishedPlacement(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const client = publicClient();
  if (!client) return null;
  const { data, error } = await client.from("placements").select("*").eq("id", id).eq("status", "published").single();
  return error || !data ? null : asPlacement(data as ListingRow);
}
