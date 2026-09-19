-- Apply to an existing deployment before enabling the updated creator intake.
-- Legacy event_name stores the listing title; existing data is not renamed or removed.
alter table listing_submissions
  add column if not exists placement_details jsonb not null default '{}'::jsonb;
