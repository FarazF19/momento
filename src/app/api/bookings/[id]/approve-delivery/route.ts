import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { releaseEligiblePayouts } from "@/lib/payouts";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const secret = process.env.OPERATIONS_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const updated = await sql`
    update bookings set fulfillment_status = 'approved', updated_at = now()
    where id = ${id} and payment_status = 'paid'
    returning id
  `;
  if (!updated.length) return NextResponse.json({ error: "Paid booking not found" }, { status: 404 });

  const payouts = await releaseEligiblePayouts();
  return NextResponse.json({ approved: true, payouts });
}
