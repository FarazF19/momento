import { NextResponse } from "next/server";
import { getPayoutMetadata } from "@/lib/payments/tazapay";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const country = (url.searchParams.get("country") || "").toUpperCase();
  const currency = (url.searchParams.get("currency") || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country) || !/^[A-Z]{3}$/.test(currency)) {
    return NextResponse.json({ error: "Use a two-letter country and three-letter currency." }, { status: 400 });
  }
  try {
    const data = await getPayoutMetadata(country, currency);
    return NextResponse.json({ payoutMethods: data.payout_methods }, { headers: { "Cache-Control": "private, max-age=3600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load payout methods" }, { status: 502 });
  }
}
