import "server-only";
import { requireDb } from "@/lib/db";
import { createPayout } from "@/lib/payments/tazapay";

export async function releaseEligiblePayouts() {
  const sql = requireDb();
  const rows = await sql`
    select b.id, b.creator_handle, b.creator_net_minor, b.currency,
      p.provider_beneficiary_id, p.payout_currency, p.payout_type, p.fund_transfer_network
    from bookings b
    join creator_payout_profiles p on p.creator_handle = b.creator_handle
    where b.payment_status = 'paid'
      and b.fulfillment_status = 'approved'
      and b.payout_status in ('not_ready', 'retry')
      and p.onboarding_status = 'approved'
      and p.provider_beneficiary_id is not null
    order by b.created_at asc
    limit 25
  `;

  const results: Array<{ bookingId: string; status: string }> = [];
  for (const row of rows) {
    const claimed = await sql`
      update bookings set payout_status = 'creating', updated_at = now()
      where id = ${row.id} and payout_status in ('not_ready', 'retry')
      returning id
    `;
    if (!claimed.length) continue;

    try {
      const payout = await createPayout({
        bookingId: row.id,
        beneficiaryId: row.provider_beneficiary_id,
        amountMinor: Number(row.creator_net_minor),
        currency: row.payout_currency || row.currency,
        payoutType: row.payout_type,
        fundTransferNetwork: row.fund_transfer_network,
        description: `Creator sponsorship payout for booking ${row.id}`,
      });
      await sql`
        update bookings set provider_payout_id = ${payout.id}, payout_status = ${payout.status},
        provider_error = null, updated_at = now() where id = ${row.id}
      `;
      results.push({ bookingId: row.id, status: payout.status });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payout provider error";
      await sql`
        update bookings set payout_status = 'retry', provider_error = ${message.slice(0, 500)},
        updated_at = now() where id = ${row.id}
      `;
      results.push({ bookingId: row.id, status: "retry" });
    }
  }
  return results;
}
