import { NextResponse } from "next/server";
import { releaseEligiblePayouts } from "@/lib/payouts";

async function run(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const results = await releaseEligiblePayouts();
    return NextResponse.json({ processed: results.length, results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payout job failed" }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
