import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/supabase/server";
export async function POST(request: Request) {
  const origin = new URL(process.env.APP_URL || request.url).origin;
  if (request.headers.get("origin") !== origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in with a verified brand account to send an offer." }, { status: 401 });
  if (account.profile.role !== "brand") return NextResponse.json({ error: "Only brand accounts can make offers." }, { status: 403 });
  const { data: approval } = await account.client.from("verification_applications").select("status").eq("user_id",account.user.id).maybeSingle();
  if (approval?.status !== "approved") return NextResponse.json({ error: "Complete your brand review at /verify before sending an offer." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const dollars = Number(body?.offerAmount);
  const amount = Math.round(dollars * 100);
  const proposal = typeof body?.campaign === "string" ? body.campaign.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body?.momentSlug || "") || !Number.isSafeInteger(amount) || Math.abs(dollars * 100 - amount) > 0.00001 || amount < 100 || amount > 10000000 || proposal.length < 10 || proposal.length > 1500) return NextResponse.json({ error: "Enter a valid amount with up to two decimal places and at least 10 characters describing your requirements." }, { status: 400 });
  const { data, error } = await account.client.rpc("submit_offer", { target: body.momentSlug, amount, proposal_text: proposal });
  if (error) return NextResponse.json({ error: "Offer could not be sent. The placement may be unavailable, or you may already have a pending offer." }, { status: 409 });
  return NextResponse.json({ id: data }, { status: 201 });
}
