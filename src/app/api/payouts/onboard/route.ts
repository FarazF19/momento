import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyOnboardingToken } from "@/lib/onboarding-token";
import { createBeneficiary, getPayoutMetadata, type PayoutMethod } from "@/lib/payments/tazapay";

type Body = {
  listingId?: unknown;
  token?: unknown;
  beneficiaryType?: unknown;
  country?: unknown;
  currency?: unknown;
  payoutType?: unknown;
  fundTransferNetwork?: unknown;
  values?: unknown;
};

function text(value: unknown, max = 250) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function setPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let current = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    current = current[key] as Record<string, unknown>;
  }
  current[parts.at(-1)!] = value;
}

function selectMethod(methods: PayoutMethod[], payoutType: string, network: string) {
  return methods.find((method) => method.payout_type === payoutType && (
    payoutType === "swift" || method.fund_transfer_networks.some((item) => item.name === network)
  ));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Body | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const listingId = text(body.listingId, 36);
  const token = text(body.token, 500);
  const beneficiaryType = text(body.beneficiaryType, 20);
  const country = text(body.country, 2).toUpperCase();
  const currency = text(body.currency, 3).toUpperCase();
  const payoutType = text(body.payoutType, 30);
  const network = text(body.fundTransferNetwork, 80);
  const values = body.values && typeof body.values === "object" ? body.values as Record<string, unknown> : {};

  try {
    if (!verifyOnboardingToken(listingId, token)) return NextResponse.json({ error: "This onboarding link is invalid or expired." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Payout onboarding is not configured." }, { status: 503 });
  }
  if (!/^[A-Z]{2}$/.test(country) || !/^[A-Z]{3}$/.test(currency) || !["individual", "business"].includes(beneficiaryType)) {
    return NextResponse.json({ error: "Invalid payout profile." }, { status: 400 });
  }

  const sql = getDb();
  if (!sql) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const listings = await sql`select creator_name, email, handle from listing_submissions where id = ${listingId} limit 1`;
  const listing = listings[0];
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  try {
    const metadata = await getPayoutMetadata(country, currency);
    const method = selectMethod(metadata.payout_methods, payoutType, network);
    if (!method || !method.beneficiary_type.includes(beneficiaryType as "individual" | "business")) {
      return NextResponse.json({ error: "That payout corridor is not available." }, { status: 400 });
    }

    const required = [...method.required_bank_fields, ...method.required_bank_codes, ...method.required_beneficiary_fields];
    if (required.some((field) => !text(values[field], 250))) {
      return NextResponse.json({ error: "Complete every required payout field." }, { status: 400 });
    }

    const bank: Record<string, unknown> = { country, currency };
    const bankCodes: Record<string, string> = {};
    for (const field of method.required_bank_fields) bank[field] = text(values[field], 250);
    for (const field of method.required_bank_codes) bankCodes[field] = text(values[field], 250);
    if (Object.keys(bankCodes).length) bank.bank_codes = bankCodes;

    const beneficiary: Record<string, unknown> = {
      name: text(values.name, 140) || listing.creator_name,
      type: beneficiaryType,
      email: listing.email,
      destination_details: { type: "bank", bank },
      metadata: JSON.stringify({ listing_id: listingId, creator_handle: listing.handle }),
    };
    for (const field of method.required_beneficiary_fields) setPath(beneficiary, field, text(values[field], 250));
    if (beneficiary.address && typeof beneficiary.address === "object") {
      (beneficiary.address as Record<string, unknown>).country = country;
    }

    const created = await createBeneficiary(beneficiary, listingId);
    await sql`
      insert into creator_payout_profiles (
        creator_handle, provider, provider_beneficiary_id, payout_currency, payout_type,
        fund_transfer_network, onboarding_status, updated_at
      ) values (
        ${listing.handle}, 'tazapay', ${created.id}, ${currency}, ${payoutType},
        ${network || null}, 'approved', now()
      ) on conflict (creator_handle) do update set
        provider_beneficiary_id = excluded.provider_beneficiary_id,
        payout_currency = excluded.payout_currency,
        payout_type = excluded.payout_type,
        fund_transfer_network = excluded.fund_transfer_network,
        onboarding_status = 'approved',
        updated_at = now()
    `;
    return NextResponse.json({ ready: true, reference: created.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not finish payout setup" }, { status: 502 });
  }
}
