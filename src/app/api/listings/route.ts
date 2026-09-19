import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createOnboardingToken } from "@/lib/onboarding-token";

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const required = ["creatorName", "email", "handle", "audience", "creatorCountry", "event", "city", "country", "startDate", "endDate", "description", "deliverable", "reach", "deliverableDetails"];
  if (required.some((key) => !text(body[key]))) {
    return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
  }

  const followers = Number(body.followers);
  const price = Number(body.price);
  if (!Number.isFinite(followers) || followers < 1000 || !Number.isFinite(price) || price < 100) {
    return NextResponse.json({ error: "Audience and price must be valid numbers." }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Listing intake is not configured yet. Add DATABASE_URL to enable it." }, { status: 503 });

  const id = randomUUID();
  const reference = `MM-${id.slice(0, 8).toUpperCase()}`;
  let onboardingUrl: string;
  try {
    const token = createOnboardingToken(id);
    const appUrl = (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
    onboardingUrl = `${appUrl}/onboard/payout?listing=${id}&token=${encodeURIComponent(token)}`;
  } catch {
    return NextResponse.json({ error: "Payout onboarding is not configured. Add ONBOARDING_TOKEN_SECRET." }, { status: 503 });
  }

  await sql`
    insert into listing_submissions (
      id, reference, creator_name, email, handle, audience, followers, creator_country,
      event_name, city, event_country, start_date, end_date, description, deliverable,
      price_minor, reach, deliverable_details
    ) values (
      ${id}, ${reference}, ${text(body.creatorName, 120)}, ${text(body.email, 200).toLowerCase()},
      ${text(body.handle, 80)}, ${text(body.audience, 160)}, ${followers}, ${text(body.creatorCountry, 100)},
      ${text(body.event, 180)}, ${text(body.city, 120)}, ${text(body.country, 100)},
      ${text(body.startDate, 10)}, ${text(body.endDate, 10)}, ${text(body.description, 1500)},
      ${text(body.deliverable, 200)}, ${Math.round(price * 100)}, ${text(body.reach, 100)},
      ${text(body.deliverableDetails, 1500)}
    )
  `;

  return NextResponse.json({ reference, onboardingUrl }, { status: 201 });
}
