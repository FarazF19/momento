export const categories = ["All", "Clothing", "Laptops", "Bags", "Travel"] as const;
export type PlacementCategory = Exclude<(typeof categories)[number], "All">;
export type InventoryItem = { id: string; name: string; description: string; timing: string; reach: string; price: number; remaining: number };
export type Moment = {
  slug: string; title: string; city: string; country: string; dates: string; startDate: string; month: string;
  category: PlacementCategory; tagline: string; surface: string; dimensions: string; duration: string;
  itinerary: string; visibility: string; proof: string; production: string; exclusivity: string; isDemo: boolean;
  creator: { name: string; handle: string; niche: string; followers: string; avatar: string };
  color: string; accent: string; inventory: InventoryItem[]; fit: string[]; photoUrl?: string;
};

const examples = [
  { slug: "hoodie-dubai-week", title: "Your logo. My hoodie.", category: "Clothing", city: "Dubai", country: "UAE",
    startDate: "2026-11-05", dates: "5–11 Nov 2026", tagline: "A chest patch on my everyday hoodie, out and about for seven days.",
    surface: "Front chest of a cream hoodie", dimensions: "12 × 8 cm removable patch", duration: "7 days",
    itinerary: "Dubai Marina walks and cafés; private venues only with permission.",
    visibility: "At least 3 hours of agreed outings each day, with the patch visible.",
    proof: "One dated placement photo per day and a final seven-photo report.",
    production: "Brand supplies the removable patch and pays delivery before the start date.",
    name: "Maya Chen", handle: "@mayacitynotes", niche: "Style & city life", followers: "28K", avatar: "MC", price: 175, color: "#ff8e67", fit: ["Lifestyle", "Travel"] },
  { slug: "laptop-lahore-coworking", title: "A laptop lid with room for you.", category: "Laptops", city: "Lahore", country: "Pakistan",
    startDate: "2026-11-01", dates: "1–30 Nov 2026", tagline: "Your sticker on my laptop during a month of coworking sessions.",
    surface: "Outward-facing laptop lid", dimensions: "10 × 7 cm removable sticker", duration: "30 days",
    itinerary: "Shared workspaces and cafés in Lahore, subject to venue permission.",
    visibility: "12 work sessions of at least 2 hours, with the lid facing the shared workspace.",
    proof: "One dated setup photo per session, plus a session log.",
    production: "Brand ships a removable, residue-free sticker before the first session.",
    name: "Lena Park", handle: "@lenamakes", niche: "Builders & remote work", followers: "18K", avatar: "LP", price: 120, color: "#73d8ff", fit: ["Software", "Creator tools"] },
  { slug: "backpack-london-commute", title: "Put your brand on my backpack.", category: "Bags", city: "London", country: "United Kingdom",
    startDate: "2026-11-09", dates: "9–22 Nov 2026", tagline: "A front-panel patch on the bag I carry around the city.",
    surface: "Backpack front panel", dimensions: "15 × 10 cm fabric patch", duration: "14 days",
    itinerary: "Walking routes between public transit and work. Private addresses are not shared.",
    visibility: "10 weekday commutes of at least 45 minutes, with the panel unobstructed.",
    proof: "One dated placement photo per commute day; no bystander faces required.",
    production: "Brand supplies a removable fabric patch and pays shipping.",
    name: "Marco Alvarez", handle: "@marcoframes", niche: "Urban life & photography", followers: "32K", avatar: "MA", price: 140, color: "#9cff57", fit: ["Local brands", "Accessories"] },
  { slug: "travel-tokyo-week", title: "Your brand, along for the trip.", category: "Travel", city: "Tokyo", country: "Japan",
    startDate: "2026-11-15", dates: "15–21 Nov 2026", tagline: "Reserve backpack ad space across my seven-day Tokyo itinerary.",
    surface: "Daypack front panel during travel", dimensions: "15 × 10 cm removable patch", duration: "7 days",
    itinerary: "Public walks in Shibuya, Asakusa, and Ueno. Dates and permitted locations agreed before payment.",
    visibility: "At least 3 hours of planned outings per day. No flights or social posts included.",
    proof: "Daily dated placement photos and an itinerary completion report.",
    production: "Brand ships the patch before departure. Trip expenses are not included.",
    name: "Kaito Sato", handle: "@kaitoplays", niche: "Travel & tech", followers: "45K", avatar: "KS", price: 250, color: "#ffe04d", fit: ["Travel apps", "Connectivity"] },
  { slug: "tshirt-karachi-weekend", title: "A weekend in your colours.", category: "Clothing", city: "Karachi", country: "Pakistan",
    startDate: "2026-11-07", dates: "7–8 Nov 2026", tagline: "Your supplied T-shirt worn on two days of city outings.",
    surface: "Chest print on a brand-supplied T-shirt", dimensions: "Up to 20 × 15 cm print", duration: "2 days",
    itinerary: "Public weekend walks and cafés; no restricted events included.",
    visibility: "At least 3 hours each day with the print visible. Social content is not included.",
    proof: "Two dated photos per day showing the print and outing context.",
    production: "Brand supplies a correctly sized shirt and pays delivery; creator approves the design.",
    name: "Isabella Cruz", handle: "@isabellainmotion", niche: "Everyday style", followers: "41K", avatar: "IC", price: 60, color: "#ff8bc7", fit: ["Fashion", "Local businesses"] },
  { slug: "tote-lisbon-week", title: "A tote that takes you places.", category: "Bags", city: "Lisbon", country: "Portugal",
    startDate: "2026-11-02", dates: "2–6 Nov 2026", tagline: "Your printed tote, carried to five days of work and coffee stops.",
    surface: "One outer side of a canvas tote", dimensions: "25 × 25 cm print", duration: "5 days",
    itinerary: "Central Lisbon walking routes and cafés where branding is permitted.",
    visibility: "At least 1 hour of walking each day with the printed side facing outward.",
    proof: "One dated placement photo per day and a completion note.",
    production: "Brand supplies the printed tote and pays delivery.",
    name: "Andre Silva", handle: "@andrebuilds", niche: "Work & city life", followers: "26K", avatar: "AS", price: 90, color: "#c8b5ff", fit: ["Independent shops", "Design"] },
] satisfies Array<{
  slug: string; title: string; category: PlacementCategory; city: string; country: string; startDate: string; dates: string;
  tagline: string; surface: string; dimensions: string; duration: string; itinerary: string; visibility: string; proof: string;
  production: string; name: string; handle: string; niche: string; followers: string; avatar: string; price: number; color: string; fit: string[];
}>;

// Fictional examples only. Never take money or bids against these records.
export const moments: Moment[] = examples.map((item) => ({
  ...item, month: "NOV", accent: "#ffe04d", isDemo: true,
  creator: { name: item.name, handle: item.handle, niche: item.niche, followers: item.followers, avatar: item.avatar },
  exclusivity: "One brand on this placement during the agreed dates; no broader exclusivity implied.",
  inventory: [{ id: "placement", name: item.surface, description: item.dimensions, timing: item.duration,
    reach: "No guaranteed impressions", price: item.price, remaining: 1 }],
}));

export function getMoment(slug: string) { return moments.find((item) => item.slug === slug); }
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(price);
}
