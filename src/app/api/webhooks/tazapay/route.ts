import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/payments/tazapay";

type TazapayEvent = {
  id: string;
  type: string;
  created_at: string;
  data?: {
    id?: string;
    payin?: string;
    reference_id?: string;
    payment_status?: string;
    amount?: number;
    amount_paid?: number;
    invoice_currency?: string;
    status?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get("signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as TazapayEvent;
  if (!event.id || !event.type) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const inserted = await sql`
    insert into webhook_events (provider, event_id, event_type, payload)
    values ('tazapay', ${event.id}, ${event.type}, ${sql.json(event)})
    on conflict (provider, event_id) do nothing
    returning event_id
  `;
  if (!inserted.length) return NextResponse.json({ received: true, duplicate: true });

  const data = event.data || {};
  try {
    if (event.type === "checkout.paid" && data.id) {
    const matches = await sql`
      select id, amount_minor, currency from bookings where provider_checkout_id = ${data.id} limit 1
    `;
    const booking = matches[0];
    if (booking && Number(booking.amount_minor) === Number(data.amount_paid) && booking.currency === data.invoice_currency) {
      await sql`
        update bookings set payment_status = 'paid', booking_status = 'creator_confirmation',
        provider_payin_id = coalesce(${data.payin || null}, provider_payin_id), updated_at = now()
        where id = ${booking.id}
      `;
    } else if (booking) {
      await sql`
        update bookings set payment_status = 'amount_mismatch', booking_status = 'needs_review',
        provider_error = 'Webhook amount or currency mismatch', updated_at = now() where id = ${booking.id}
      `;
    }
    } else if (event.type === "checkout.expired" && data.id) {
    await sql`
      update bookings set payment_status = 'expired', booking_status = 'checkout_expired', updated_at = now()
      where provider_checkout_id = ${data.id} and payment_status <> 'paid'
    `;
    } else if (event.type === "payment_attempt.failed" && data.payin) {
    await sql`
      update bookings set payment_status = 'failed', updated_at = now()
      where provider_payin_id = ${data.payin} and payment_status <> 'paid'
    `;
    } else if (event.type === "payment_attempt.reversed" && data.payin) {
    await sql`
      update bookings set payment_status = 'reversed', booking_status = 'needs_review', updated_at = now()
      where provider_payin_id = ${data.payin}
    `;
    } else if (event.type.startsWith("payout.") && data.id) {
    const payoutStatus = data.status || event.type.replace("payout.", "");
    await sql`
      update bookings set payout_status = ${payoutStatus}, updated_at = now()
      where provider_payout_id = ${data.id} or id = ${data.reference_id || ""}
    `;
    }
  } catch {
    await sql`delete from webhook_events where provider = 'tazapay' and event_id = ${event.id}`;
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
