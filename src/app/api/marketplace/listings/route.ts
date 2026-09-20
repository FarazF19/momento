import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/supabase/server";
import { industries, type AdSlot } from "@/lib/moments";
import { sanitizeHandle, validateSimpleListing } from "@/lib/placement-validation";

const niches = industries.filter((item) => item !== "All");

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asSlots(value: unknown): AdSlot[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 32).flatMap((slot, index) => {
    if (!slot || typeof slot !== "object") return [];
    const item = slot as Record<string, unknown>;
    const price = Number(item.price);
    return [{
      id: asText(item.id, `s${index + 1}`).slice(0, 40),
      name: asText(item.name, `Slot ${index + 1}`).slice(0, 80),
      brand: asText(item.brand, "Open").slice(0, 80),
      price: Number.isFinite(price) && price >= 0 ? price : 0,
      color: asText(item.color, "#ffe04d").slice(0, 32),
    }];
  });
}

export async function POST(request: Request) {
  const origin = new URL(process.env.APP_URL || request.url).origin;
  if (request.headers.get("origin") !== origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in with a creator account to publish." }, { status: 401 });
  if (account.profile.role !== "creator") return NextResponse.json({ error: "Only creator accounts can publish ad space." }, { status: 403 });
  const { data: approved, error: approvalError } = await account.client.rpc("marketplace_approved", { account_id: account.user.id });
  if (approvalError || !approved) return NextResponse.json({ error: "Verify a social profile with at least 10,000 followers before publishing.", verifyUrl: "/verify" }, { status: 403 });
  const { data: verification } = await account.client.from("verification_applications").select("payload").eq("user_id", account.user.id).eq("status", "approved").single();
  const evidence = verification?.payload || {};
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid listing." }, { status: 400 });

  const input = body as Record<string, unknown>;
  const meta = (account.user.user_metadata || {}) as Record<string, unknown>;
  const event = asText(input.event);
  const city = asText(input.city);
  const country = asText(input.country);
  const name = account.profile.name;
  const handle = sanitizeHandle(asText(input.handle, asText(meta.handle)), name) || "@creator";
  const priceMode = asText(input.priceMode) === "offer" ? "offer" : asText(input.priceMode, "fixed");
  const price = priceMode === "offer" ? Number(input.price ?? 100) : Number(input.price);
  const industry = niches.includes(asText(input.industry, asText(meta.niche)) as (typeof niches)[number])
    ? asText(input.industry, asText(meta.niche))
    : "Lifestyle";
  const slots = asSlots(input.slots);
  const bodyKind = input.bodyKind === "dress" || input.bodyKind === "body"
    ? input.bodyKind
    : slots.length ? "body" : "";
  const followers = Number(evidence.fetchedFollowers ?? evidence.followers);
  if (!Number.isSafeInteger(followers) || followers < 10000) return NextResponse.json({ error: "Your verified audience must be at least 10,000 followers. Verify your profile again.", verifyUrl: "/verify" }, { status: 403 });
  const fields = {
    event,
    city,
    country,
    startDate: asText(input.startDate),
    endDate: asText(input.endDate),
    handle,
    placementCategory: asText(input.placementCategory),
    industry,
    item: asText(input.item, asText(input.placementCategory, "Clothing")),
    surface: asText(input.surface, slots.length ? `${slots.length} numbered slots` : "Numbered slots"),
    dimensions: asText(input.dimensions, "Mapped zones"),
    photoUrl: asText(input.photoUrl, "/campaigns/body-placeholder.svg"),
    description: asText(input.description, [event, city].filter(Boolean).join(" ")),
    audience: asText(input.audience, "Lifestyle"),
    creatorName: asText(input.creatorName, name),
    creatorCountry: asText(input.creatorCountry, country),
    deliverable: asText(input.deliverable, "Worn during the full event"),
    deliverableDetails: asText(input.deliverableDetails, "Dated photos on this page"),
    production: asText(input.production, "Brand sends artwork"),
    exclusivity: asText(input.exclusivity, "One brand per slot"),
    reach: asText(input.reach, "No guaranteed impressions"),
    template: asText(input.template, bodyKind),
    priceMode,
    price,
    followers,
    slotCount: Number(input.slotCount) || slots.length,
    slots,
  };
  const error = validateSimpleListing(fields);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const asking = Math.round(Number(fields.price) * 100);
  if (!Number.isSafeInteger(asking) || asking < 100 || asking > 10000000) {
    return NextResponse.json({ error: "Enter an asking price between $1 and $100,000." }, { status: 400 });
  }
  const str = (key: keyof typeof fields, max = 1500) => String(fields[key] ?? "").trim().slice(0, max);
  const title = str("event", 180);
  if (title.length < 3) return NextResponse.json({ error: "Give the listing a slightly longer event name." }, { status: 400 });
  const { data, error: dbError } = await account.client.from("placements").insert({
    creator_id: account.user.id, creator_name: name, title,
    category: str("placementCategory", 30), handle: str("handle", 80), audience: str("audience", 160),
    followers, city: str("city", 120), country: str("country", 100),
    start_date: str("startDate", 10), end_date: str("endDate", 10), asking_price_minor: asking,
    details: {
      item: str("item", 160), surface: str("surface", 200), dimensions: str("dimensions", 100),
      photoUrl: str("photoUrl", 200000), itinerary: str("description"), visibility: str("deliverable", 200),
      proof: str("deliverableDetails"), production: str("production"), exclusivity: str("exclusivity"),
      exposure: str("reach", 100), industry: str("industry", 30),
      slots, template: str("template", 40), bodyKind, priceMode,
      socialUrl: evidence.verifiedProfileUrl || evidence.profileUrl,
      portraitUrl: evidence.fetchedPhoto || evidence.portraitUrl || "",
      audienceSource: "Verified social profile",
    },
  }).select("id").single();
  if (dbError) return NextResponse.json({ error: "Could not publish the placement. Check your dates and try again." }, { status: 400 });
  return NextResponse.json({ reference: data.id, listingUrl: "/placements/" + data.id }, { status: 201 });
}

