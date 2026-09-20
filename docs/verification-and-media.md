# Marketplace admission

Creators: 18+, >=10,000 followers on **one** Instagram/TikTok/X account (never a cross-platform sum), public profile with 90 days of history and >=3 original posts in 60 days, control of the account shown by the unique application code in the live bio, original portrait and realistic placement/photo-proof plan. A reviewer checks activity/engagement consistency and the current count. The application count is self-reported until reviewed. No guaranteed offline impressions.

Brands: 18+, authority to act, business website or established business social page controlled via the application code, coherent public business identity, rights to artwork and acceptable campaign. No social audience requirement for brands.

Flow: confirmed email -> /verify -> server-generated public ownership marker -> pending -> reviewer confirms live ownership and criteria -> approved or needs_changes -> resubmit if needed. Approved creators can publish; approved brands can bid. Database policies and offer trigger enforce admission even outside Next.js routes. Personal evidence is private; public approval helper returns only a boolean. Approval does not constitute payout-provider KYC.

## Operator setup

The in-app queue is /review. Access is deny-by-default. In the Supabase SQL editor, an owner can grant reviewer access to an **existing confirmed** Momento account after confirming the person's identity:

```sql
insert into private.marketplace_reviewers(user_id)
select id from auth.users
where id = '<confirmed-owner-user-uuid>'::uuid and email_confirmed_at is not null
on conflict do nothing;
```

No reviewer has been auto-assigned. Review through /review to record decisions in the private immutable audit table. For approvals, inspect the current public follower count (not screenshots alone), ownership marker, recent original activity, and campaign/placement fit. Self-declared follower counts are not proof. Request changes for ambiguity; do not auto-approve large accounts.

## Social API automation (not enabled)

Current release uses a live public-page ownership challenge and human review. It does not imply OAuth or automatic social checks. Future integrations need provider app setup/approval and authorized scopes. Instagram professional account support: https://developers.facebook.com/documentation/instagram-platform . TikTok user-info scopes: https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/ . Keep API tokens server-side; never request social passwords.

## Media

`public/creators/editorial-grid.webp`: built-in image generation. Prompt: one 3x2 photographic contact sheet, six fictional adult creators in Dubai/Lahore/London/Tokyo/Karachi/Lisbon; natural premium editorial lifestyle portraits, cream/coral bright palette, no lettering or logos. Original generation saved outside the git project; web-optimized version is committed. CSS selects panels. Example profiles and AI portraits are visibly labelled.

`public/creators/momento-film.mp4` and `film-poster.jpg`: 16-second silent photo-led motion film with slow camera moves and baked captions, rendered with `node scripts/render-creator-film.mjs`. This is an editorial motion montage, not a Google Flow video. Flow is currently signed out in the connected browser; no Flow credits were spent. Video respects reduced-motion preference and has playback controls.

Suggested Flow shot for a future replacement, within the user's 50-credit cap: a cinematic 8-second match-cut from a cream-hoodie creator in a sunny cafe, to a creator opening a laptop, to a traveller putting on a backpack. Small coral rectangular patches on physical surfaces; no generated text or logos, no morphing, no dialogue. Warm natural light, handheld documentary realism, 4:5 crop-safe. Add exact brand typography in post-production.
