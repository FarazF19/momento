import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/supabase/server";
import { validatePlacementSubmission } from "@/lib/placement-validation";
export async function POST(request: Request) {
  const origin = new URL(process.env.APP_URL || request.url).origin;
  if (request.headers.get("origin") !== origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in with a verified creator account to publish." }, { status: 401 });
  if (account.profile.role !== "creator") return NextResponse.json({ error: "Only creator accounts can publish ad space." }, { status: 403 });
  const { data: approval } = await account.client.from("verification_applications").select("status,payload").eq("user_id",account.user.id).maybeSingle();
  if (approval?.status !== "approved") return NextResponse.json({ error: "Complete your creator review at /verify before publishing." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  const fields = { ...body, followers: approval.payload.followers, handle: new URL(approval.payload.profileUrl).pathname.replaceAll("/", ""), creatorName: account.profile.name, email: account.user.email };
  const error = validatePlacementSubmission(fields);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const str = (key: string, max = 1500) => String(fields[key]).trim().slice(0, max);
  const { data, error: dbError } = await account.client.from("placements").insert({
    creator_id: account.user.id, creator_name: account.profile.name, title: str("event", 180),
    category: str("placementCategory", 30), handle: str("handle", 80), audience: str("audience", 160),
    followers: Number(fields.followers), city: str("city", 120), country: str("country", 100),
    start_date: str("startDate", 10), end_date: str("endDate", 10), asking_price_minor: Math.round(Number(fields.price) * 100),
    details: { socialUrl: approval.payload.profileUrl, portraitUrl: approval.payload.portraitUrl, item: str("item", 160), surface: str("surface", 200), dimensions: str("dimensions", 100),
      photoUrl: str("photoUrl", 2000), itinerary: str("description"), visibility: str("deliverable", 200),
      proof: str("deliverableDetails"), production: str("production"), exclusivity: str("exclusivity"), exposure: str("reach", 100) },
  }).select("id").single();
  if (dbError) return NextResponse.json({ error: "Could not publish the placement. Check your dates and try again." }, { status: 400 });
  return NextResponse.json({ reference: data.id, listingUrl: "/placements/" + data.id }, { status: 201 });
}
