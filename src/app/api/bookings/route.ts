import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createCheckout } from "@/lib/payments/tazapay";
import { getMoment } from "@/lib/moments";

type BookingBody = {
  momentSlug?: unknown;
  inventoryIds?: unknown;
  mode?: unknown;
  brandName?: unknown;
  email?: unknown;
  brandCountry?: unknown;
  campaign?: unknown;
  offerAmount?: unknown;
};

function value(input: unknown, max = 1000) {
  return typeof input === "string" ? input.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as BookingBody | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const moment = getMoment(value(body.momentSlug, 100));
  const mode = body.mode === "offer" ? "offer" : body.mode === "book" ? "book" : null;
  const inventoryIds = Array.isArray(body.inventoryIds)
    ? [...new Set(body.inventoryIds.filter((id): id is string => typeof id === "string"))]
    : [];
  const brandName = value(body.brandName, 120);
  const email = value(body.email, 200).toLowerCase();
  const brandCountry = value(body.brandCountry, 2).toUpperCase();
  const campaign = value(body.campaign, 1500);

  if (!moment || !mode || !inventoryIds.length || !brandName || !email.includes("@") || !/^[A-Z]{2}$/.test(brandCountry) || !campaign) {
    return NextResponse.json({ error: "Please complete the booking details." }, { status: 400 });
  }

  if (moment.isDemo) return NextResponse.json({ error: "This is an illustrative listing. Real offers and payments are disabled." }, { status: 409 });

  const selected = moment.inventory.filter((item) => inventoryIds.includes(item.id));
  if (selected.length !== inventoryIds.length || selected.some((item) => item.remaining < 1)) {
    return NextResponse.json({ error: "One or more selected items are unavailable." }, { status: 409 });
  }

  const listedTotalMinor = selected.reduce((sum, item) => sum + item.price * 100, 0);
  const offered = Number(body.offerAmount);
  const amountMinor = mode === "offer" ? Math.round(offered * 100) : listedTotalMinor;
  if (!Number.isInteger(amountMinor) || !Number.isSafeInteger(amountMinor) || amountMinor < 100 || amountMinor > 10000000) {
    return NextResponse.json({ error: "The offer amount is outside the allowed range." }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Checkout is not configured yet. Add DATABASE_URL before accepting bookings." }, { status: 503 });

  const feeBps = Number(process.env.TAZAPAY_PLATFORM_FEE_BPS || 1000);
  const platformFeeMinor = Math.round(amountMinor * Math.min(Math.max(feeBps, 0), 5000) / 10000);
  const bookingId = randomUUID();
  const initialStatus = mode === "offer" ? "offer_pending" : "checkout_pending";
  const paymentStatus = mode === "offer" ? "not_requested" : "unpaid";

  await sql`
    insert into bookings (
      id, moment_slug, creator_handle, inventory_ids, inventory_snapshot, mode,
      brand_name, brand_email, brand_country, campaign, currency, amount_minor,
      platform_fee_minor, creator_net_minor, booking_status, payment_status
    ) values (
      ${bookingId}, ${moment.slug}, ${moment.creator.handle}, ${sql.json(inventoryIds)},
      ${sql.json(selected)}, ${mode}, ${brandName}, ${email}, ${brandCountry}, ${campaign},
      'USD', ${amountMinor}, ${platformFeeMinor}, ${amountMinor - platformFeeMinor},
      ${initialStatus}, ${paymentStatus}
    )
  `;

  if (mode === "offer") {
    return NextResponse.json({ bookingId, status: "offer_pending" }, { status: 201 });
  }

  const appUrl = (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
  try {
    const checkout = await createCheckout({
      bookingId,
      amountMinor,
      currency: "USD",
      customer: { name: brandName, email, country: brandCountry },
      description: `${moment.title}: ${selected.map((item) => item.name).join(", ")}`.slice(0, 180),
      successUrl: `${appUrl}/checkout/success?booking=${bookingId}`,
      cancelUrl: `${appUrl}/placements/${moment.slug}?checkout=cancelled`,
      webhookUrl: `${appUrl}/api/webhooks/tazapay`,
    });

    await sql`
      update bookings set provider_checkout_id = ${checkout.id}, provider_payin_id = ${checkout.payin || null},
      booking_status = 'checkout_created', updated_at = now() where id = ${bookingId}
    `;
    return NextResponse.json({ bookingId, checkoutUrl: checkout.url }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment provider error";
    await sql`
      update bookings set booking_status = 'checkout_failed', provider_error = ${message.slice(0, 500)},
      updated_at = now() where id = ${bookingId}
    `;
    return NextResponse.json({ error: "Secure checkout is temporarily unavailable. No payment was taken." }, { status: 502 });
  }
}
