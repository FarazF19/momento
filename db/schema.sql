create table if not exists listing_submissions (
  id text primary key,
  reference text not null unique,
  creator_name text not null,
  email text not null,
  handle text not null,
  audience text not null,
  followers integer not null,
  creator_country text not null,
  event_name text not null,
  city text not null,
  event_country text not null,
  start_date date not null,
  end_date date not null,
  description text not null,
  deliverable text not null,
  price_minor integer not null check (price_minor > 0),
  reach text not null,
  deliverable_details text not null,
  review_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists creator_payout_profiles (
  creator_handle text primary key,
  provider text not null default 'tazapay',
  provider_entity_id text,
  provider_beneficiary_id text,
  payout_currency text not null default 'USD',
  payout_type text not null default 'local',
  fund_transfer_network text,
  onboarding_status text not null default 'not_started',
  updated_at timestamptz not null default now()
);

-- Additive migration: existing submissions and booking records are preserved.
alter table listing_submissions
  add column if not exists placement_details jsonb not null default '{}'::jsonb;

create table if not exists bookings (
  id text primary key,
  moment_slug text not null,
  creator_handle text not null,
  inventory_ids jsonb not null,
  inventory_snapshot jsonb not null,
  mode text not null check (mode in ('book', 'offer')),
  brand_name text not null,
  brand_email text not null,
  brand_country text not null,
  campaign text not null,
  currency text not null default 'USD',
  amount_minor integer not null check (amount_minor > 0),
  platform_fee_minor integer not null check (platform_fee_minor >= 0),
  creator_net_minor integer not null check (creator_net_minor >= 0),
  booking_status text not null,
  payment_status text not null,
  fulfillment_status text not null default 'not_started',
  payout_status text not null default 'not_ready',
  provider text not null default 'tazapay',
  provider_checkout_id text unique,
  provider_payin_id text,
  provider_payout_id text unique,
  provider_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_release_queue
  on bookings (payment_status, fulfillment_status, payout_status);

create table if not exists webhook_events (
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now(),
  primary key (provider, event_id)
);

insert into creator_payout_profiles (creator_handle)
values ('@lenamakes'), ('@marcoframes'), ('@mayacitynotes'), ('@kaitoplays'), ('@isabellainmotion'), ('@andrebuilds')
on conflict (creator_handle) do nothing;
