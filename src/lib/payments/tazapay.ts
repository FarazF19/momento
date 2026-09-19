import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

type TazapayEnvelope<T> = {
  status: string;
  message?: string;
  data: T;
};

type CheckoutData = {
  id: string;
  url: string;
  payin?: string;
  payment_status?: string;
};

type PayoutData = {
  id: string;
  status: string;
};

export type PayoutMethod = {
  beneficiary_type: Array<"individual" | "business">;
  country: string;
  currency: string;
  payout_type: "local" | "swift";
  fund_transfer_networks: Array<{ name: string; delivery_time?: string; additional_information?: string }>;
  required_bank_codes: string[];
  required_bank_fields: string[];
  required_beneficiary_fields: string[];
  recommended_fields?: {
    recommended_bank_codes?: string[];
    recommended_bank_fields?: string[];
    recommended_beneficiary_fields?: string[];
  };
};

type PayoutMetadataData = { payout_methods: PayoutMethod[] };
type BeneficiaryData = { id: string; destination?: string };

export type CreateCheckoutInput = {
  bookingId: string;
  amountMinor: number;
  currency: string;
  customer: { name: string; email: string; country: string };
  description: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
};

export type CreatePayoutInput = {
  bookingId: string;
  beneficiaryId: string;
  amountMinor: number;
  currency: string;
  payoutType: "local" | "swift" | "wallet" | "local_payment_network" | "tazapay_account";
  fundTransferNetwork?: string | null;
  description: string;
};

function config() {
  const key = process.env.TAZAPAY_API_KEY;
  const secret = process.env.TAZAPAY_API_SECRET;
  if (!key || !secret) throw new Error("Tazapay API credentials are not configured");

  const baseUrl = process.env.TAZAPAY_ENV === "live"
    ? "https://service.tazapay.com"
    : "https://service-sandbox.tazapay.com";

  return { key, secret, baseUrl };
}

async function request<T>(method: "GET" | "POST", path: string, body?: Record<string, unknown>, idempotencyKey?: string) {
  const { key, secret, baseUrl } = config();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });

  const payload = await response.json() as TazapayEnvelope<T>;
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message || `Tazapay request failed (${response.status})`);
  }
  return payload.data;
}

export function createCheckout(input: CreateCheckoutInput) {
  return request<CheckoutData>("POST", "/v3/checkout", {
    invoice_currency: input.currency,
    amount: input.amountMinor,
    customer_details: input.customer,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    webhook_url: input.webhookUrl,
    transaction_description: input.description,
    reference_id: input.bookingId,
    metadata: JSON.stringify({ booking_id: input.bookingId }),
  }, `checkout-${input.bookingId}`);
}

export function createPayout(input: CreatePayoutInput) {
  const purpose = process.env.TAZAPAY_PAYOUT_PURPOSE_CODE;
  if (!purpose) throw new Error("TAZAPAY_PAYOUT_PURPOSE_CODE is not configured");

  const body: Record<string, unknown> = {
    beneficiary: input.beneficiaryId,
    amount: input.amountMinor,
    currency: input.currency,
    holding_currency: process.env.TAZAPAY_PAYOUT_HOLDING_CURRENCY || input.currency,
    type: input.payoutType,
    purpose,
    reference_id: input.bookingId,
    transaction_description: input.description,
    statement_descriptor: "Momento creator payout",
    metadata: JSON.stringify({ booking_id: input.bookingId }),
  };

  if (input.payoutType === "local" && input.fundTransferNetwork) {
    body.local = { fund_transfer_network: input.fundTransferNetwork };
  }

  return request<PayoutData>("POST", "/v3/payout", body, `payout-${input.bookingId}`);
}

export function getPayoutMetadata(country: string, currency: string) {
  const query = new URLSearchParams({ country, currency });
  return request<PayoutMetadataData>("GET", `/v3/metadata/payout/bank?${query.toString()}`);
}

export function createBeneficiary(body: Record<string, unknown>, listingId: string) {
  return request<BeneficiaryData>("POST", "/v3/beneficiary", body, `beneficiary-${listingId}`);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.TAZAPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  let event: { id?: string; created_at?: string };
  try {
    event = JSON.parse(rawBody) as { id?: string; created_at?: string };
  } catch {
    return false;
  }
  if (!event.id || !event.created_at) return false;

  const expected = createHmac("sha256", secret)
    .update(`${event.id}${rawBody}${event.created_at}`)
    .digest();

  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }

  return received.length === expected.length && timingSafeEqual(received, expected);
}
