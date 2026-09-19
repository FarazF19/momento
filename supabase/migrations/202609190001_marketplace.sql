-- Supabase PostgreSQL: identity comes from auth.users, never a client-supplied handle.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 100),
  role text not null check (role in ('creator', 'brand')),
  created_at timestamptz not null default now()
);
create function public.create_marketplace_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, name, role) values (
    new.id, left(coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), 'Member'), 100),
    case when new.raw_user_meta_data->>'role' = 'brand' then 'brand' else 'creator' end
  );
  return new;
end;
$$;
create trigger on_marketplace_signup after insert on auth.users
  for each row execute function public.create_marketplace_profile();
-- Backfill users if authentication was enabled before this migration.
insert into public.profiles(id, name, role)
select id, left(coalesce(nullif(trim(raw_user_meta_data->>'name'), ''), 'Member'), 100),
  case when raw_user_meta_data->>'role' = 'brand' then 'brand' else 'creator' end
from auth.users on conflict (id) do nothing;

create function public.verified_marketplace_user() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where id = auth.uid() and email_confirmed_at is not null);
$$;
revoke all on function public.verified_marketplace_user() from public, anon;
grant execute on function public.verified_marketplace_user() to authenticated;

create table public.placements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id),
  title text not null check (length(title) between 3 and 180),
  category text not null check (category in ('Clothing', 'Laptops', 'Bags', 'Travel')),
  creator_name text not null,
  handle text not null,
  audience text not null,
  followers integer not null check (followers >= 0),
  city text not null,
  country text not null,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  asking_price_minor integer not null check (asking_price_minor between 100 and 10000000),
  details jsonb not null check (jsonb_typeof(details) = 'object'
    and details ?& array['item','surface','dimensions','photoUrl','itinerary','visibility','proof','production','exclusivity']
    and coalesce(length(trim(details->>'surface')) between 1 and 200, false)
    and coalesce(length(trim(details->>'dimensions')) between 1 and 100, false)
    and coalesce(length(trim(details->>'visibility')) between 1 and 200, false)
    and coalesce(length(trim(details->>'proof')) between 1 and 1500, false)
    and coalesce(length(trim(details->>'production')) between 1 and 1500, false)
    and coalesce(length(trim(details->>'exclusivity')) between 1 and 1500, false)
    and coalesce(details->>'photoUrl' ~ '^https://[^[:space:]]+$', false)),
  status text not null default 'published' check (status in ('published', 'paused')),
  created_at timestamptz not null default now()
);
create index placements_browse on public.placements(status, category, start_date);
create index placements_owner on public.placements(creator_id);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid not null references public.placements(id),
  creator_id uuid not null references public.profiles(id),
  brand_id uuid not null references public.profiles(id),
  brand_name text not null,
  amount_minor integer not null check (amount_minor between 100 and 10000000),
  proposal text not null check (length(proposal) between 10 and 1500),
  placement_snapshot jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (brand_id <> creator_id)
);
create unique index one_accepted_offer on public.offers(placement_id) where status = 'accepted';
create unique index one_pending_offer_per_brand on public.offers(placement_id, brand_id) where status = 'pending';
create index offers_brand on public.offers(brand_id);
create index offers_creator on public.offers(creator_id);

alter table public.profiles enable row level security;
alter table public.placements enable row level security;
alter table public.offers enable row level security;
revoke all on public.profiles, public.placements, public.offers from anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.placements to anon, authenticated;
grant insert on public.placements to authenticated;
grant select on public.offers to authenticated;
create policy own_profile on public.profiles for select to authenticated using (id = auth.uid());
create policy public_or_owned_placements on public.placements for select to anon, authenticated
  using (status = 'published' or creator_id = auth.uid());
create policy creator_lists on public.placements for insert to authenticated
  with check (creator_id = auth.uid() and start_date >= current_date and public.verified_marketplace_user()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'creator' and name = creator_name));
create policy offer_participants on public.offers for select to authenticated
  using (brand_id = auth.uid() or creator_id = auth.uid());

-- RPCs are the only offer mutation path. They derive identity and immutable terms.
create function public.submit_offer(target uuid, amount integer, proposal_text text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare item public.placements; actor public.profiles; result uuid;
begin
  if not public.verified_marketplace_user() then raise exception 'Verified account required'; end if;
  select * into actor from public.profiles where id = auth.uid();
  if actor.id is null or actor.role <> 'brand' then raise exception 'Brand account required'; end if;
  select * into item from public.placements where id = target for update;
  if item.id is null or item.status <> 'published' or item.end_date < current_date then raise exception 'Placement unavailable'; end if;
  if item.creator_id = actor.id then raise exception 'Cannot bid on your own placement'; end if;
  insert into public.offers(placement_id, creator_id, brand_id, brand_name, amount_minor, proposal, placement_snapshot)
    values (item.id, item.creator_id, actor.id, actor.name, amount, trim(proposal_text), to_jsonb(item))
    returning id into result;
  return result;
end;
$$;

create function public.respond_to_offer(target uuid, decision text) returns void
language plpgsql security definer set search_path = '' as $$
declare item public.offers; placement_status text; placement_end date;
begin
  if not public.verified_marketplace_user() then raise exception 'Verified account required'; end if;
  if decision is null or decision not in ('accepted', 'declined', 'withdrawn') then raise exception 'Invalid decision'; end if;
  select * into item from public.offers where id = target;
  if item.id is null then raise exception 'Offer unavailable'; end if;
  -- Always lock the placement first so competing acceptances serialize safely.
  select status, end_date into placement_status, placement_end from public.placements where id = item.placement_id for update;
  select * into item from public.offers where id = target for update;
  if auth.uid() is null or
    (decision = 'withdrawn' and item.brand_id <> auth.uid()) or
    (decision <> 'withdrawn' and item.creator_id <> auth.uid())
    then raise exception 'Not authorized'; end if;
  if item.status <> 'pending' then raise exception 'Offer already decided'; end if;
  if decision = 'accepted' and (placement_status <> 'published' or placement_end < current_date) then raise exception 'Placement unavailable'; end if;
  update public.offers set status = decision, updated_at = now() where id = target;
  if decision = 'accepted' then
    update public.placements set status = 'paused' where id = item.placement_id;
    update public.offers set status = 'declined', updated_at = now()
      where placement_id = item.placement_id and status = 'pending';
  end if;
end;
$$;
revoke all on function public.create_marketplace_profile(), public.submit_offer(uuid, integer, text), public.respond_to_offer(uuid, text) from public, anon;
revoke execute on function public.create_marketplace_profile() from authenticated;
grant execute on function public.submit_offer(uuid, integer, text), public.respond_to_offer(uuid, text) to authenticated;
