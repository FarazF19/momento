-- MVP confirmed creators can publish without bio verification.
drop policy if exists reviewed_creator_publishes on public.placements;
drop policy if exists reviewed_public_listings on public.placements;
drop trigger if exists reviewed_offer on public.offers;

alter table public.placements drop constraint if exists placements_details_check;
alter table public.placements add constraint placements_details_check check (
  jsonb_typeof(details) = 'object'
  and details ?& array['item','surface','dimensions','photoUrl','itinerary','visibility','proof','production','exclusivity']
  and coalesce(length(trim(details->>'surface')) between 1 and 200, false)
  and coalesce(length(trim(details->>'dimensions')) between 1 and 100, false)
  and coalesce(length(trim(details->>'visibility')) between 1 and 200, false)
  and coalesce(length(trim(details->>'proof')) between 1 and 1500, false)
  and coalesce(length(trim(details->>'production')) between 1 and 1500, false)
  and coalesce(length(trim(details->>'exclusivity')) between 1 and 1500, false)
  and coalesce(details->>'photoUrl' ~ '^(https://[^[:space:]]+|/campaigns/[^[:space:]]+|data:image/[^[:space:]]+)$', false)
);
