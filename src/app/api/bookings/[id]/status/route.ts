import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const rows = await sql`
    select booking_status, payment_status, fulfillment_status, payout_status
    from bookings where id = ${id} limit 1
  `;
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0], { headers: { "Cache-Control": "no-store" } });
}
