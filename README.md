# Momento

Brands rent advertising space on creators’ clothes, laptops, bags, and travel items. Creators retain ownership, define the placement, and approve offers.

## Implemented in this revision

- Cream landing page with direct brand/creator calls to action, FAQs, and an original 16-second silent hero video.
- Searchable physical placements with explicit surface, dimensions, duration, visibility, production, exclusivity, and proof requirements.
- Supabase email/password signup, email confirmation, login, recovery, and logout. Server-side identity verification and cookie refresh.
- Separate creator and brand accounts with protected dashboards.
- Automatic marketplace verification: members put a one-time code in their public bio/website, the server confirms it on the live page, reads the public name, photo, and follower count, and records the decision in about a minute. No follower minimum. Human review remains as a fallback when `SUPABASE_SECRET_KEY` is unset.
- Verified creators publish into PostgreSQL; live listings appear in discovery and at `/placements/:id`.
- Verified brands propose offers. Creators accept/reserve or decline; brands withdraw pending offers.
- Database row-level permissions protect profiles and offers. Offer mutations use narrowly scoped database functions, derive identities from authenticated sessions, and store an immutable copy of the placement terms.
- Acceptance locks the placement, reserves it, and declines competing offers in one transaction. A partial unique index prevents multiple accepted offers.
- Six clearly marked fictional examples are shown when no live listings are available. They cannot collect offers or payments.

Code completion does not mean production setup is complete. The migration must be applied to the connected Supabase project and the environment configured in Vercel before real signup/publication works.

## Setup

1. Install packages: `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. In the dedicated Supabase project, apply the migrations in `supabase/migrations/` in filename order using the migration runner or SQL editor. They create the `profiles`, `placements`, `offers`, and verification tables. They do not migrate historical Tazapay booking records.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `APP_URL`. For automatic verification decisions, also set `SUPABASE_SECRET_KEY` (service role) — server-side only; it must never reach browser code.
5. Enable email confirmation. Configure Site URL and allowlisted callback URLs: `https://YOUR_DOMAIN/auth/callback` and `https://YOUR_DOMAIN/auth/callback?next=/auth/reset`. Add localhost equivalents for development. Configure production SMTP before inviting external users.
6. Run `npm run dev`. Configure the same values in Vercel, then rebuild and deploy.

The marketplace uses Supabase’s authenticated Data API. `DATABASE_URL` and the old `db/schema.sql` are **not required** for the new listing/offer flow.

## Verification

```bash
npm test
npm run lint
npm run build
```

The database suite executes the actual migration in PGlite (PostgreSQL in WASM), with a minimal Supabase auth schema fixture. It tests ownership, role restrictions, verification, private reads, spoofed writes, immutable snapshots, duplicate offers, reservation, decline, and withdrawal. It does not replace testing against the hosted Supabase auth service.

The video and poster are checked in. Regeneration requires FFmpeg and `npm run render:ad`; deployment does not require FFmpeg.

## Payments: not ready for production

The user’s preferred providers are Dodo or Polar, with automated creator payouts. No compatible production provider has been established for this physical advertising marketplace. The current marketplace stops at accepted/reserved terms and clearly states that no money has been collected. No manual payout workflow is substituted.

Provider checks on September 19, 2026:

- [Polar acceptable-use policy](https://polar.sh/legal/acceptable-use-policy) explicitly prohibits advertising/sponsorship and marketplaces.
- [Dodo merchant acceptance](https://docs.dodopayments.com/miscellaneous/merchant-acceptance) focuses on digital products and excludes services whose principal value is human labour. This placement model is not confirmed eligible.

Legacy Tazapay checkout, payout, webhook, and cron modules remain from the prior prototype. They are not connected to new Supabase offers and are not evidence of a working launch payment flow. The anonymous legacy listing endpoint returns 410, and all example bookings are rejected. Do not configure legacy payment credentials as a shortcut to launch.

## Monday, September 21 release gates

- Apply the migration and verify security checks on the hosted project.
- Configure production auth email delivery; exercise signup, confirmation, login, recovery, expiry, and logout with two real test accounts.
- Publish one actual creator listing, send a brand offer, accept it, and confirm private dashboard access and reservation on the deployed site.
- Verify responsive screens and video playback on mobile and desktop.
- Establish a payment provider that approves physical advertising, the merchant’s jurisdiction, and automated creator payouts. Complete sandbox payment, webhook, refund, payout, failure, and duplicate-event checks before enabling charges.
- Add agreed cancellation/refund terms, production fulfillment/proof workflow, abuse controls, and transactional notifications before accepting paid placements.

Monday’s paid launch remains conditional on payment eligibility and these hosted checks. Public discovery and account onboarding can launch independently once their gates pass.
