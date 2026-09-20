# Marketplace admission

Creators: 18+, control of **one** public Instagram/TikTok/X account shown by the unique application code in the live bio, and a realistic placement/photo-proof plan. There is no follower minimum: audience size, public name, and photo are read from the live profile by the automatic check and stored in the application payload (`fetchedName`, `fetchedPhoto`, `fetchedFollowers`). No guaranteed offline impressions.

Brands: 18+, authority to act, business website or established business social page controlled via the application code, rights to artwork and acceptable campaign. No social audience requirement for brands.

Flow: confirmed email -> /verify -> server-generated public ownership marker in bio/page -> submit -> **automatic review** (server fetches the live public page, confirms the code, extracts public identity) -> approved or needs_changes within about a minute -> fix and resubmit instantly if needed. Approved creators can publish; approved brands can bid. Database policies and offer trigger enforce admission even outside Next.js routes. Personal evidence is private; public approval helper returns only a boolean. Approval does not constitute payout-provider KYC.

Automatic decisions are recorded by `public.auto_review_verification`, a security-definer function granted only to `service_role` and called server-side with `SUPABASE_SECRET_KEY` after the Next.js server has independently verified the live page (`src/lib/auto-review.ts`). Audit rows land in `private.verification_reviews` with `automated = true` and a null reviewer. If `SUPABASE_SECRET_KEY` is not configured, submissions stay `pending` and fall back to the human queue below. Platform notes: TikTok and ordinary websites verify most reliably from server IPs; Instagram and X sometimes block datacenter fetches, in which case the applicant gets an immediate needs_changes with guidance to retry or switch platforms.

## Operator setup

The in-app queue is /review. It is a fallback: with automatic review configured, applications rarely wait here. Access is deny-by-default. In the Supabase SQL editor, an owner can grant reviewer access to an **existing confirmed** Momento account after confirming the person's identity:

```sql
insert into private.marketplace_reviewers(user_id)
select id from auth.users
where id = '<confirmed-owner-user-uuid>'::uuid and email_confirmed_at is not null
on conflict do nothing;
```

No reviewer has been auto-assigned. Review through /review to record decisions in the private immutable audit table. For approvals, inspect the ownership marker on the live page and campaign/placement fit. Request changes for ambiguity.

## Social OAuth (not enabled)

The automatic check verifies ownership against the live public page and reads only public metadata (og tags, embedded public counts). It does not use OAuth or private APIs. Future OAuth integrations need provider app setup/approval and authorized scopes. Instagram professional account support: https://developers.facebook.com/documentation/instagram-platform . TikTok user-info scopes: https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/ . Keep API tokens server-side; never request social passwords.

## Media

`public/creators/editorial-grid.webp`: built-in image generation. Prompt: one 3x2 photographic contact sheet, six fictional adult creators in Dubai/Lahore/London/Tokyo/Karachi/Lisbon; natural premium editorial lifestyle portraits, cream/coral bright palette, no lettering or logos. Original generation saved outside the git project; web-optimized version is committed. CSS selects panels. Example profiles and AI portraits are visibly labelled.

`public/creators/momento-film.mp4` and `film-poster.jpg`: 16-second silent photo-led motion film with slow camera moves and baked captions, rendered with `node scripts/render-creator-film.mjs`. This is an editorial motion montage, not a Google Flow video. Flow is currently signed out in the connected browser; no Flow credits were spent. Video respects reduced-motion preference and has playback controls.

Suggested Flow shot for a future replacement, within the user's 50-credit cap: a cinematic 8-second match-cut from a cream-hoodie creator in a sunny cafe, to a creator opening a laptop, to a traveller putting on a backpack. Small coral rectangular patches on physical surfaces; no generated text or logos, no morphing, no dialogue. Warm natural light, handheld documentary realism, 4:5 crop-safe. Add exact brand typography in post-production.
