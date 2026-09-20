import type { AdSlot, Moment } from "./moments";

const bodyNames = ["Left chest", "Right chest", "Right arm", "Left arm", "Left thigh", "Right thigh", "Back", "Shoulder"];
const dressNames = ["Front left", "Front center", "Front right", "Hem", "Back left", "Back center", "Back right", "Shoulder"];
const colors = ["#ffe04d", "#4f63ff", "#ff5b3a", "#10a37f", "#9cff57", "#ff8bc7", "#111111", "#73d8ff"];

export function hashPrompt(prompt: string) {
  let hash = 0;
  for (const char of prompt) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}

export function campaignIdFromPrompt(prompt: string) {
  const stem = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "campaign";
  return `${stem}-${hashPrompt(prompt)}`;
}

function money(text: string) {
  const matches = [...text.matchAll(/\$\s?([0-9][\d,]*(?:\.\d+)?)/g)].map((item) => Number(item[1].replace(/,/g, "")));
  return matches.filter((value) => Number.isFinite(value) && value > 0);
}

function countFrom(text: string) {
  const match = text.match(/(\d{1,2})\s*(?:slots?|spots?|zones?)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return value >= 3 && value <= 16 ? value : null;
}

function cityFrom(text: string) {
  const match = text.match(/\b(?:in|at|@)\s+([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)/);
  return match?.[1] ?? "Your city";
}

function nameFrom(text: string) {
  const match = text.match(/\b(?:i(?:'m| am)|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return match?.[1] ?? "Your campaign";
}

function eventFrom(text: string) {
  if (/dress|gown/i.test(text)) return "Event dress";
  if (/hoodie|tee|kit|race|marathon/i.test(text)) return "Kit slots";
  return "Body slots";
}

export function generateCampaign(prompt: string, extras?: { name?: string }): Moment {
  const text = prompt.trim().replace(/\s+/g, " ");
  if (text.length < 12) throw new Error("Write one sentence about the person, the event, and the slots.");
  const dress = /dress|gown|token/i.test(text);
  const names = dress ? dressNames : bodyNames;
  const count = countFrom(text) ?? (dress ? 8 : 6);
  const prices = money(text);
  const low = prices[0] ?? (dress ? 350 : 400);
  const high = prices[1] && prices[1] > low ? prices[1] : low * 2;
  const name = extras?.name?.trim() || nameFrom(text);
  const city = cityFrom(text);
  const event = eventFrom(text);
  const handle = "@" + name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const slots: AdSlot[] = Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    const price = Math.round(high - (high - low) * t);
    return {
      id: `s${index + 1}`,
      name: names[index] || `Slot ${index + 1}`,
      brand: "Open",
      price,
      color: colors[index % colors.length],
    };
  });
  const id = campaignIdFromPrompt(text);
  return {
    slug: id,
    title: `${slots.length} slots · ${event}.`,
    category: "Clothing",
    industry: dress ? "Fashion" : "Fitness",
    city,
    country: "—",
    dates: "Dates on the page",
    startDate: "2026-10-01",
    month: "OCT",
    tagline: text,
    surface: `${slots.length} numbered ${dress ? "dress" : "body"} zones`,
    dimensions: dress ? "Front and back spots" : "Chest, arms, thighs, back",
    duration: "Event day",
    itinerary: `${event} in ${city}. Worn for the dates you set.`,
    visibility: "Each paid zone is worn as mapped. Photo proof comes back on this page.",
    proof: "Dated placement photos uploaded to this Momento campaign.",
    production: "Brand sends a logo. You approve it. It goes on the zone.",
    exclusivity: "One brand per numbered slot on this page.",
    isDemo: true,
    creator: { name, handle, niche: event, followers: "new", avatar: name.slice(0, 2).toUpperCase() },
    color: dress ? "#f4f0ea" : "#1a2333",
    accent: "#ffe04d",
    photoUrl: dress ? "/campaigns/dress-placeholder.svg" : "/campaigns/body-placeholder.svg",
    bodyKind: dress ? "dress" : "body",
    slots,
    raisedLabel: `${slots.length} slots · $${low}–$${high}`,
    fit: dress ? ["Fashion", "Events"] : ["Fitness", "Consumer"],
    inventory: slots.map((slot) => ({
      id: slot.id, name: slot.name, description: "Open slot", timing: "Event day",
      reach: "No guaranteed impressions", price: slot.price, remaining: 1,
    })),
  };
}
