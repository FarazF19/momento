export const categories = ["All", "Clothing", "Laptops", "Bags", "Travel"] as const;
export type PlacementCategory = Exclude<(typeof categories)[number], "All">;
export const industries = ["All", "Tech", "Fashion", "Beauty", "Fitness", "Food & Drink", "Travel", "Gaming", "Music", "Business", "Lifestyle"] as const;
export type Industry = Exclude<(typeof industries)[number], "All">;
export type InventoryItem = { id: string; name: string; description: string; timing: string; reach: string; price: number; remaining: number };
export type AdSlot = { id: string; name: string; brand: string; price: number; color: string };
export type Moment = {
  slug: string; title: string; city: string; country: string; dates: string; startDate: string; month: string;
  category: PlacementCategory; industry?: Industry | string; tagline: string; surface: string; dimensions: string; duration: string;
  itinerary: string; visibility: string; proof: string; production: string; exclusivity: string; isDemo: boolean;
  creator: { name: string; handle: string; niche: string; followers: string; avatar: string; portraitUrl?: string; socialUrl?: string; audienceSource?: string };
  color: string; accent: string; inventory: InventoryItem[]; fit: string[]; photoUrl?: string;
  campaignUrl?: string; bodyKind?: "body" | "dress"; slots?: AdSlot[]; raisedLabel?: string;
};

const examples = [
  {
    slug: "marc-lou-hyrox", title: "15 slots on a race-day body.", category: "Clothing" as const, industry: "Fitness" as const,
    city: "İzmir", country: "Turkey", startDate: "2026-09-19", dates: "19 Sep 2026", month: "SEP",
    tagline: "Numbered zones on a HYROX kit — chest, arms, thighs — worn for the race, then proven with photos on this page.",
    surface: "15 numbered body zones", dimensions: "Chest, arms, thighs, back", duration: "Race day",
    itinerary: "HYROX İzmir, 19 September. Full race, then the recap.",
    visibility: "Every zone worn for the race. Sponsors printed on the body and kit.",
    proof: "Race photos and finish uploaded to this Momento campaign.",
    production: "Brand sends a logo. The creator approves it. It goes on the zone.",
    exclusivity: "One brand per zone. Offers stay on this page.",
    name: "Marc Lou", handle: "@marclou", niche: "Indie maker · HYROX", followers: "public", avatar: "ML",
    portraitUrl: "/campaigns/marc-lou.png", photoUrl: "/campaigns/marc-lou-og.jpg",
    socialUrl: "https://x.com/marc_louvion",
    bodyKind: "body" as const, color: "#1a2333", accent: "#ffe04d", price: 112000, raisedLabel: "$112,000 raised",
    fit: ["Fitness", "SaaS", "Consumer apps"],
    slots: [
      { id: "chest-l", name: "Left chest", brand: "OpenAI", price: 8000, color: "#10a37f" },
      { id: "chest-r", name: "Right chest", brand: "Star", price: 8000, color: "#4f63ff" },
      { id: "bicep", name: "Right arm", brand: "Zero", price: 5000, color: "#ff5b3a" },
      { id: "forearm", name: "Forearm", brand: "DataFast", price: 3500, color: "#ffe04d" },
      { id: "thigh-l", name: "Left thigh", brand: "Ship", price: 4000, color: "#9cff57" },
      { id: "thigh-r", name: "Right thigh", brand: "Build", price: 4000, color: "#ff8bc7" },
    ],
  },
  {
    slug: "vanshu-token2049", title: "13 spots on a TOKEN2049 dress.", category: "Clothing" as const, industry: "Tech" as const,
    city: "Singapore", country: "Singapore", startDate: "2026-10-07", dates: "7 Oct 2026", month: "OCT",
    tagline: "A white dress mapped into 13 priced spots — six on the front, seven on the back — worn on the TOKEN2049 floor.",
    surface: "13 numbered dress spots", dimensions: "Front mega to back mini", duration: "Event day",
    itinerary: "TOKEN2049 Singapore, Marina Bay Sands, 7 October 2026.",
    visibility: "Worn all day on the floor. Photos and recap for every spot.",
    proof: "Event photos uploaded to this Momento campaign.",
    production: "Brand sends a logo. It prints on the dress after approval.",
    exclusivity: "One brand per numbered spot. Offers stay on this page.",
    name: "Vanshu", handle: "@vanshueth", niche: "Video · crypto events", followers: "public", avatar: "VA",
    portraitUrl: "/campaigns/vanshu.jpg", photoUrl: "/campaigns/vanshu-dress.png",
    socialUrl: "https://x.com/vanshueth",
    bodyKind: "dress" as const, color: "#f4f0ea", accent: "#111111", price: 350, raisedLabel: "$350–$1,200 / spot",
    fit: ["Crypto", "AI", "Consumer apps"],
    slots: [
      { id: "f1", name: "01 Mega", brand: "Variational", price: 1200, color: "#111111" },
      { id: "f2", name: "02 Semi-mega", brand: "LeverUp", price: 900, color: "#4f63ff" },
      { id: "f3", name: "03 Low key", brand: "Bagel", price: 700, color: "#ff5b3a" },
      { id: "f4", name: "04 Low key", brand: "Bagel", price: 700, color: "#ffe04d" },
      { id: "f5", name: "05 Zero chill", brand: "tiptop", price: 500, color: "#10a37f" },
      { id: "f6", name: "06 Prime", brand: "Central", price: 900, color: "#9cff57" },
    ],
  },
];

// Public campaigns used as structure examples. Offers and payments stay off.
export const moments: Moment[] = examples.map((item) => ({
  slug: item.slug, title: item.title, category: item.category, industry: item.industry, city: item.city, country: item.country,
  startDate: item.startDate, dates: item.dates, month: item.month, tagline: item.tagline, surface: item.surface,
  dimensions: item.dimensions, duration: item.duration, itinerary: item.itinerary, visibility: item.visibility,
  proof: item.proof, production: item.production, exclusivity: item.exclusivity, isDemo: true,
  creator: {
    name: item.name, handle: item.handle, niche: item.niche, followers: item.followers, avatar: item.avatar,
    portraitUrl: item.portraitUrl, socialUrl: item.socialUrl, audienceSource: "live profile",
  },
  color: item.color, accent: item.accent, photoUrl: item.photoUrl,
  bodyKind: item.bodyKind, slots: item.slots, raisedLabel: item.raisedLabel, fit: item.fit,
  inventory: item.slots.map((slot) => ({
    id: slot.id, name: slot.name, description: slot.brand, timing: item.duration,
    reach: "Campaign example — no guaranteed impressions", price: slot.price, remaining: 1,
  })),
}));

export function getMoment(slug: string) { return moments.find((item) => item.slug === slug); }
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(price);
}
