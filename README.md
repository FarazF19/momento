# Momento MVP

Momento is a marketplace where creators list upcoming trips and events as concrete sponsorship inventory, and brands book or offer on those moments before they happen.

## Included

- Cream, bright editorial landing page with responsive navigation
- Searchable moment discovery and six seeded listings
- Moment pages with selectable sponsorship inventory
- Brand offers and Tazapay-hosted checkout
- Creator listing intake and self-serve, country-aware payout onboarding
- Signed and deduplicated payment and payout webhooks
- Separate booking, payment, fulfillment, and payout states
- Automatic payout creation after paid work is approved
- Daily retry job for eligible payouts

## Payment architecture

The payment flow is fail-closed:

1. The server recalculates inventory prices from trusted product data.
2. Tazapay creates a hosted checkout using an idempotency key.
3. The redirect page polls booking status but never declares success by itself.
4. A signed `checkout.paid` webhook confirms the exact amount and currency.
5. The creator completes a self-serve payout wizard. Required fields come from Tazapay's payout metadata API.
6. Bank data passes directly to Tazapay and is not stored by Momento. Only the beneficiary ID and payout route are retained.
7. Delivery approval automatically calls the payout API. A daily job retries safe, idempotent payout creation.
8. Payout webhooks update the final status.

Do not market this as escrow unless Tazapay has explicitly approved an escrow product and the related terms for this business.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Create a PostgreSQL database, then apply the schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Add sandbox credentials and at least 32 random characters for each application secret in `.env.local`, then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Tazapay setup

Use sandbox until all of these pass:

- Hosted checkout success, failure, cancellation, and delayed-webhook cases
- Duplicate and out-of-order webhook delivery
- Amount/currency mismatch handling
- Beneficiary creation for every launch country
- Local and SWIFT payout corridors used by launch creators
- Payout success, failure, reversal, and retry cases

Configure the webhook destination as:

```text
https://YOUR_DOMAIN/api/webhooks/tazapay
```

Subscribe to checkout, payment-attempt, and payout events. Put the webhook secret in `TAZAPAY_WEBHOOK_SECRET`.

`TAZAPAY_PAYOUT_PURPOSE_CODE` must be confirmed with Tazapay for creator sponsorship services. It is deliberately not guessed in code.

## Automatic payouts

A payout becomes eligible only when:

- `payment_status = paid`
- `fulfillment_status = approved`
- the creator has an approved Tazapay beneficiary
- `payout_status` is `not_ready` or `retry`

The protected delivery approval endpoint marks fulfillment approved and immediately attempts the payout:

```text
POST /api/bookings/:id/approve-delivery
Authorization: Bearer $OPERATIONS_SECRET
```

`vercel.json` also invokes `/api/jobs/release-payouts` daily so it can deploy on Vercel Hobby. Vercel sends `CRON_SECRET` as the bearer token. The same endpoint can be called by another scheduler if more frequent retries are needed.

## Before live launch

- Obtain written marketplace/creator-services approval from Tazapay.
- Complete Momento merchant KYB and enable required collection/payout corridors.
- Replace sample listings with authenticated creator-owned records.
- Add brand and creator authentication before exposing dashboards.
- Add email notifications for offers, paid bookings, approval, and payout state changes.
- Add refund/cancellation operations and terms.
- Run the database behind encrypted connections and backups.

## Verification

```bash
npm run lint
npm run build
```
