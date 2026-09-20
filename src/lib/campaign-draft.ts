import type { AdSlot, Moment, PlacementCategory } from "./moments";

export type PlacementTemplate = "body" | "kit" | "dress" | "upper" | "bag" | "laptop" | "custom";
export type Pin = { top: string; left: string };

export type CampaignDraft = {
  eventName: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  description?: string;
  template: PlacementTemplate;
  slotCount: number;
  photos: string[];
  priceMode: "ask" | "offer";
  price: number;
  wornFullEvent: boolean;
  photoProof: boolean;
  exclusive: boolean;
  socialMention: boolean;
  restrictions?: string;
  handle: string;
  niche: string;
  creatorName: string;
};

export type TemplateInfo = {
  id: Exclude<PlacementTemplate, "custom">;
  label: string;
  category: PlacementCategory;
  bodyKind: "body" | "dress";
  slotNames: string[];
  placeholder: string;
};

const bodyNames = ["Left chest", "Right chest", "Right arm", "Left arm", "Left thigh", "Right thigh", "Back", "Shoulder", "Collar", "Waist", "Left calf", "Right calf", "Hip", "Sleeve", "Neck"];
const kitNames = ["Left chest", "Right chest", "Right sleeve", "Left sleeve", "Left thigh", "Right thigh", "Back", "Shoulder", "Collar", "Waistband", "Left calf", "Right calf", "Hip", "Bib", "Neck"];
const dressNames = ["Front left", "Front center", "Front right", "Hem", "Back left", "Back center", "Back right", "Shoulder", "Neckline", "Waist", "Hip", "Sleeve", "Train", "Side", "Collar"];
const upperNames = ["Left chest", "Right chest", "Left sleeve", "Right sleeve", "Collar", "Back", "Shoulder", "Pocket", "Hem", "Hood", "Wrist", "Yoke", "Placket", "Elbow", "Neck"];
const bagNames = ["Front", "Flap", "Side", "Strap", "Back", "Pocket", "Tag", "Base", "Handle", "Zip", "Panel", "Corner", "Lining", "Buckle", "Loop"];
const laptopNames = ["Lid center", "Lid left", "Lid right", "Palm rest", "Trackpad", "Bezel", "Lid top", "Lid bottom", "Side", "Corner", "Keyboard", "Hinge", "Back", "Edge", "Badge"];

const BODY_PLACEHOLDER = "/campaigns/body-placeholder.svg";
const DRESS_PLACEHOLDER = "/campaigns/dress-placeholder.svg";
const colors = ["#ffe04d", "#4f63ff", "#ff5b3a", "#10a37f", "#9cff57", "#ff8bc7", "#111111", "#73d8ff", "#ffb020", "#c084fc", "#34d399", "#fb7185", "#60a5fa", "#facc15", "#a3e635"];

export const CAMPAIGN_DRAFT_STORE = "momento-campaign-draft";

export const TEMPLATES: TemplateInfo[] = [
  { id: "body", label: "Body", category: "Clothing", bodyKind: "body", slotNames: bodyNames, placeholder: BODY_PLACEHOLDER },
  { id: "kit", label: "Race kit", category: "Clothing", bodyKind: "body", slotNames: kitNames, placeholder: BODY_PLACEHOLDER },
  { id: "dress", label: "Dress", category: "Clothing", bodyKind: "dress", slotNames: dressNames, placeholder: DRESS_PLACEHOLDER },
  { id: "upper", label: "Upper body", category: "Clothing", bodyKind: "body", slotNames: upperNames, placeholder: BODY_PLACEHOLDER },
  { id: "bag", label: "Bag", category: "Bags", bodyKind: "body", slotNames: bagNames, placeholder: BODY_PLACEHOLDER },
  { id: "laptop", label: "Laptop", category: "Laptops", bodyKind: "body", slotNames: laptopNames, placeholder: BODY_PLACEHOLDER },
];

const bodyPins: Pin[] = [
  { top: "36%", left: "48.5%" },
  { top: "36%", left: "51.8%" },
  { top: "41%", left: "55.5%" },
  { top: "50%", left: "46%" },
  { top: "58%", left: "48.5%" },
  { top: "58%", left: "51.8%" },
  { top: "32%", left: "46%" },
  { top: "32%", left: "54%" },
  { top: "28%", left: "50%" },
  { top: "46%", left: "50%" },
  { top: "68%", left: "47%" },
  { top: "68%", left: "53%" },
  { top: "52%", left: "54%" },
  { top: "41%", left: "43%" },
  { top: "24%", left: "50%" },
];

const dressPins: Pin[] = [
  { top: "28%", left: "50%" },
  { top: "38%", left: "50%" },
  { top: "48%", left: "42%" },
  { top: "48%", left: "58%" },
  { top: "58%", left: "50%" },
  { top: "70%", left: "50%" },
  { top: "22%", left: "50%" },
  { top: "33%", left: "44%" },
  { top: "33%", left: "56%" },
  { top: "44%", left: "50%" },
  { top: "54%", left: "43%" },
  { top: "54%", left: "57%" },
  { top: "78%", left: "50%" },
  { top: "62%", left: "40%" },
  { top: "18%", left: "50%" },
];

const bagPins: Pin[] = [
  { top: "38%", left: "50%" },
  { top: "28%", left: "50%" },
  { top: "42%", left: "38%" },
  { top: "22%", left: "58%" },
  { top: "48%", left: "50%" },
  { top: "52%", left: "62%" },
  { top: "34%", left: "62%" },
  { top: "68%", left: "50%" },
  { top: "18%", left: "50%" },
  { top: "46%", left: "46%" },
  { top: "56%", left: "40%" },
  { top: "60%", left: "60%" },
  { top: "40%", left: "55%" },
  { top: "32%", left: "42%" },
  { top: "24%", left: "44%" },
];

const laptopPins: Pin[] = [
  { top: "36%", left: "50%" },
  { top: "36%", left: "38%" },
  { top: "36%", left: "62%" },
  { top: "62%", left: "42%" },
  { top: "62%", left: "50%" },
  { top: "28%", left: "50%" },
  { top: "24%", left: "50%" },
  { top: "48%", left: "50%" },
  { top: "42%", left: "28%" },
  { top: "30%", left: "70%" },
  { top: "58%", left: "58%" },
  { top: "52%", left: "50%" },
  { top: "72%", left: "50%" },
  { top: "42%", left: "72%" },
  { top: "32%", left: "50%" },
];

const upperPins: Pin[] = [
  { top: "36%", left: "48.5%" },
  { top: "36%", left: "51.8%" },
  { top: "40%", left: "43%" },
  { top: "40%", left: "57%" },
  { top: "28%", left: "50%" },
  { top: "38%", left: "50%" },
  { top: "32%", left: "46%" },
  { top: "44%", left: "50%" },
  { top: "50%", left: "50%" },
  { top: "24%", left: "50%" },
  { top: "46%", left: "40%" },
  { top: "32%", left: "54%" },
  { top: "42%", left: "50%" },
  { top: "44%", left: "58%" },
  { top: "22%", left: "50%" },
];

function pinSet(template: PlacementTemplate): Pin[] {
  if (template === "dress") return dressPins;
  if (template === "bag") return bagPins;
  if (template === "laptop") return laptopPins;
  if (template === "upper") return upperPins;
  return bodyPins;
}

export function templateInfo(id: PlacementTemplate): TemplateInfo {
  return TEMPLATES.find((item) => item.id === id) || TEMPLATES[0];
}

export function clampSlotCount(value: number) {
  const count = Math.round(Number(value));
  if (!Number.isFinite(count)) return 6;
  return Math.min(15, Math.max(4, count));
}

export function slotPrice(draft: Pick<CampaignDraft, "price">) {
  const value = Number(draft.price);
  return Number.isFinite(value) && value > 0 ? value : 100;
}

export function pinsFor(template: PlacementTemplate, count: number): Pin[] {
  const n = Math.min(15, Math.max(0, Math.round(Number(count) || 0)));
  return pinSet(template).slice(0, n);
}

function hashText(text: string) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash.toString(36);
}

export function draftId(draft: CampaignDraft) {
  const stem = draft.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "campaign";
  const key = [draft.eventName, draft.startDate, draft.endDate, draft.city, draft.country, draft.template, clampSlotCount(draft.slotCount), draft.creatorName].join("|");
  return `${stem}-${hashText(key)}`;
}

function bannedPhoto(url: string) {
  return /marc-lou|vanshu/i.test(url);
}

export function safePhotoUrl(photos: string[] | undefined, fallback: string) {
  const safe = (photos || []).find((photo) => typeof photo === "string" && photo.trim() && !bannedPhoto(photo));
  const chosen = safe?.trim() || fallback;
  return bannedPhoto(chosen) ? fallback : chosen;
}

function prettyDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [, month, day] = iso.split("-");
  return `${Number(day)} ${months[Number(month) - 1]} ${iso.slice(0, 4)}`;
}

function datesLabel(start: string, end: string) {
  if (!start) return "Dates on the page";
  const first = prettyDate(start);
  if (!end || end === start) return first;
  return `${first} – ${prettyDate(end)}`;
}

function monthLabel(start: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return "TBD";
  return new Date(start + "T12:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }).toUpperCase();
}

function handleFrom(name: string, handle?: string) {
  const given = (handle || "").trim();
  if (given) return given.startsWith("@") ? given : `@${given}`;
  const stem = name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "creator";
  return `@${stem}`;
}

function dimensionsFor(template: TemplateInfo) {
  if (template.id === "dress") return "Front and back spots";
  if (template.id === "upper") return "Chest, shoulders, sleeves";
  if (template.id === "bag") return "Front, sides, strap";
  if (template.id === "laptop") return "Lid and palm rest";
  if (template.id === "kit") return "Chest, sleeves, thighs, back";
  return "Chest, arms, thighs, back";
}

function numberedSlots(draft: CampaignDraft, template: TemplateInfo, count: number, price: number): AdSlot[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `s${index + 1}`,
    name: template.slotNames[index] || String(index + 1).padStart(2, "0"),
    brand: "Open",
    price,
    color: colors[index % colors.length],
  }));
}

export function draftToMoment(draft: CampaignDraft): Moment {
  const template = templateInfo(draft.template);
  const count = clampSlotCount(draft.slotCount);
  const price = slotPrice(draft);
  const slots = numberedSlots(draft, template, count, price);
  const name = draft.creatorName.trim() || "Your campaign";
  const city = draft.city.trim() || "Your city";
  const country = draft.country.trim() || "—";
  const event = draft.eventName.trim() || template.label;
  const dates = datesLabel(draft.startDate, draft.endDate || draft.startDate);
  const itinerary = (draft.description || "").trim() || `${event} in ${city}. Worn for the dates you set.`;
  const photoUrl = safePhotoUrl(draft.photos, template.placeholder);
  const worn = draft.wornFullEvent !== false
    ? "Each paid zone is worn for the full event as mapped."
    : "Zones are worn as agreed for the event dates.";
  const proof = draft.photoProof !== false
    ? "Dated placement photos uploaded to this Momento campaign."
    : "Proof as agreed with the brand.";
  const exclusivity = [
    draft.exclusive !== false ? "One brand per numbered slot on this page." : "Slots may be shared as agreed.",
    (draft.restrictions || "").trim(),
  ].filter(Boolean).join(" ");
  return {
    slug: draftId(draft),
    title: `${count} slots · ${event}.`,
    category: template.category,
    industry: draft.niche.trim() || "Lifestyle",
    city,
    country,
    dates,
    startDate: draft.startDate || "2026-10-01",
    month: monthLabel(draft.startDate),
    tagline: itinerary,
    surface: `${count} numbered zones`,
    dimensions: dimensionsFor(template),
    duration: dates === "Dates on the page" ? "Event day" : dates,
    itinerary,
    visibility: worn,
    proof,
    production: "Brand sends a logo. You approve it. It goes on the zone.",
    exclusivity,
    isDemo: true,
    creator: {
      name,
      handle: handleFrom(name, draft.handle),
      niche: draft.niche.trim() || template.label,
      followers: "new",
      avatar: name.slice(0, 2).toUpperCase(),
    },
    color: template.bodyKind === "dress" ? "#f4f0ea" : "#1a2333",
    accent: "#ffe04d",
    photoUrl,
    bodyKind: template.bodyKind,
    slots,
    raisedLabel: draft.priceMode === "offer" ? "open to offers" : `${count} slots · $${price}`,
    fit: [template.category, draft.niche.trim() || "Lifestyle"],
    inventory: slots.map((slot) => ({
      id: slot.id, name: slot.name, description: "Open slot", timing: dates,
      reach: "No guaranteed impressions", price: slot.price, remaining: 1,
    })),
  };
}

export function shareText(draft: CampaignDraft, url: string) {
  const count = clampSlotCount(draft.slotCount);
  const event = draft.eventName.trim() || "my event";
  const place = [draft.city.trim(), draft.country.trim()].filter(Boolean).join(", ");
  const price = draft.priceMode === "offer" ? "open to offers" : `$${slotPrice(draft)} a slot`;
  const who = draft.creatorName.trim() || "A creator";
  return `${who} · ${count} numbered slots at ${event}${place ? ` (${place})` : ""} · ${price}. ${url}`;
}

export function listingFields(draft: CampaignDraft) {
  const moment = draftToMoment(draft);
  const template = templateInfo(draft.template);
  const count = clampSlotCount(draft.slotCount);
  return {
    event: draft.eventName.trim(),
    city: draft.city.trim(),
    country: draft.country.trim(),
    startDate: draft.startDate,
    endDate: draft.endDate || draft.startDate,
    description: (draft.description || moment.itinerary).trim(),
    placementCategory: template.category,
    industry: draft.niche.trim() || "Lifestyle",
    item: template.label,
    surface: `${count} numbered zones`,
    dimensions: moment.dimensions,
    photoUrl: moment.photoUrl || template.placeholder,
    handle: moment.creator.handle,
    audience: draft.niche.trim() || "Lifestyle",
    creatorName: draft.creatorName.trim(),
    price: draft.priceMode === "offer" ? 100 : slotPrice(draft),
    priceMode: draft.priceMode,
    slotCount: count,
    template: draft.template,
    slots: moment.slots,
    deliverable: moment.visibility,
    deliverableDetails: moment.proof,
    production: moment.production,
    exclusivity: moment.exclusivity,
    reach: "No guaranteed impressions",
    followers: "0",
    creatorCountry: draft.country.trim(),
  };
}

export function parseDraft(raw: string | null | undefined): CampaignDraft | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CampaignDraft>;
    if (!data || typeof data !== "object") return null;
    return {
      eventName: String(data.eventName || ""),
      startDate: String(data.startDate || ""),
      endDate: String(data.endDate || data.startDate || ""),
      city: String(data.city || ""),
      country: String(data.country || ""),
      description: data.description ? String(data.description) : "",
      template: TEMPLATES.some((item) => item.id === data.template) || data.template === "custom"
        ? data.template as PlacementTemplate
        : "body",
      slotCount: clampSlotCount(Number(data.slotCount) || 6),
      photos: Array.isArray(data.photos) ? data.photos.filter((item): item is string => typeof item === "string" && !bannedPhoto(item)).slice(0, 3) : [],
      priceMode: data.priceMode === "offer" ? "offer" : "ask",
      price: Number(data.price) || 0,
      wornFullEvent: data.wornFullEvent !== false,
      photoProof: data.photoProof !== false,
      exclusive: data.exclusive !== false,
      socialMention: data.socialMention === true,
      restrictions: data.restrictions ? String(data.restrictions) : "",
      handle: String(data.handle || ""),
      niche: String(data.niche || ""),
      creatorName: String(data.creatorName || ""),
    };
  } catch {
    return null;
  }
}
