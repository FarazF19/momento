-- Private evidence, explicit review, and database-enforced marketplace eligibility.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.marketplace_reviewers (user_id uuid primary key references auth.users(id) on delete cascade);
alter table private.marketplace_reviewers enable row level security;
create function public.is_marketplace_reviewer() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (select 1 from private.marketplace_reviewers where user_id = auth.uid());
$$;
revoke all on function public.is_marketplace_reviewer() from public, anon;
grant execute on function public.is_marketplace_reviewer() to authenticated;

create table public.verification_applications (
 user_id uuid primary key references public.profiles(id) on delete cascade,
 role text not null check (role in ('creator','brand')),
 ownership_code text not null default ('MOMENTO-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),
 payload jsonb not null default '{}' check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) < 16000),
 status text not null default 'draft' check (status in ('draft','pending','approved','needs_changes')),
 review_note text not null default '',
 reviewed_at timestamptz,
 created_at timestamptz not null default now(),
 check (status <> 'pending' or coalesce((
   payload->>'adult' = 'yes' and payload->>'accurate' = 'yes'
   and length(trim(payload->>'summary')) between 30 and 1500
   and coalesce(payload->>'profileUrl' ~ '^https://[^[:space:]]+$',false)
   and case when role = 'creator' then
     coalesce(payload->>'platform' in ('instagram','tiktok','x'),false)
     and case when payload->>'followers' ~ '^[0-9]{1,10}$' then (payload->>'followers')::bigint between 10000 and 2147483647 else false end
     and coalesce(payload->>'accountAge' = 'yes',false)
     and coalesce(payload->>'recentPosts' = 'yes',false)
     and coalesce(payload->>'portraitUrl' ~ '^https://[^[:space:]]+$',false)
   else coalesce(length(trim(payload->>'businessName')) between 2 and 150,false)
     and coalesce(payload->>'authority' = 'yes',false)
   end
 ), false))
);
alter table public.verification_applications enable row level security;
revoke all on public.verification_applications from public, anon, authenticated;
grant select on public.verification_applications to authenticated;
grant insert(user_id,role) on public.verification_applications to authenticated;
grant update(payload,status) on public.verification_applications to authenticated;
create policy verification_read on public.verification_applications for select to authenticated
 using (user_id = (select auth.uid()) or (select public.is_marketplace_reviewer()));
create policy verification_start on public.verification_applications for insert to authenticated
 with check (user_id = (select auth.uid()) and public.verified_marketplace_user()
 and exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = verification_applications.role));
create policy verification_submit on public.verification_applications for update to authenticated
 using (user_id = (select auth.uid()) and status in ('draft','needs_changes'))
 with check (user_id = (select auth.uid()) and status in ('draft','pending') and public.verified_marketplace_user());
create index verification_queue on public.verification_applications(created_at) where status = 'pending';

create table private.verification_reviews (
 id uuid primary key default gen_random_uuid(), applicant_id uuid not null references public.profiles(id),
 reviewer_id uuid not null references auth.users(id), decision text not null, note text not null,
 created_at timestamptz not null default now()
);
alter table private.verification_reviews enable row level security;
create function public.review_verification(target uuid, decision text, note text) returns void
language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_marketplace_reviewer() then raise exception 'Reviewer access required'; end if;
 if decision not in ('approved','needs_changes') or length(trim(note)) not between 10 and 1500 then raise exception 'Decision and review note required'; end if;
 update public.verification_applications set status = decision, review_note = trim(note), reviewed_at = now()
 where user_id = target and status = 'pending';
 if not found then raise exception 'Application is not awaiting review'; end if;
 insert into private.verification_reviews(applicant_id,reviewer_id,decision,note) values(target,auth.uid(),decision,trim(note));
end;
$$;
revoke all on function public.review_verification(uuid,text,text) from public, anon;
grant execute on function public.review_verification(uuid,text,text) to authenticated;

-- Only the approval fact is public; evidence, codes and review notes stay private.
create function public.marketplace_approved(account_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.verification_applications where user_id = account_id and status = 'approved');
$$;
revoke all on function public.marketplace_approved(uuid) from public;
grant execute on function public.marketplace_approved(uuid) to anon, authenticated;
create policy reviewed_creator_publishes on public.placements as restrictive for insert to authenticated
 with check (public.marketplace_approved(creator_id));
create policy reviewed_public_listings on public.placements as restrictive for select to anon, authenticated
 using (creator_id = (select auth.uid()) or public.marketplace_approved(creator_id));

-- submit_offer is security-definer, so an RLS policy alone cannot gate its writes.
create function private.require_reviewed_offer() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if not public.marketplace_approved(new.brand_id) or not public.marketplace_approved(new.creator_id) then
   raise exception 'Both members need marketplace approval before an offer';
 end if;
 return new;
end;
$$;
create trigger reviewed_offer before insert on public.offers for each row execute function private.require_reviewed_offer();
