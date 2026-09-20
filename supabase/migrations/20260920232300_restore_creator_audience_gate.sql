-- Restore the explicitly requested 10K single-platform creator admission rule.
-- Existing private evidence stays private; the public helper returns only eligibility.
create or replace function public.marketplace_approved(account_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (
   select 1 from public.verification_applications
   where user_id = account_id and status = 'approved'
   and (role = 'brand' or case
     when coalesce(payload->>'fetchedFollowers', payload->>'followers') ~ '^[0-9]{1,10}$'
     then coalesce(payload->>'fetchedFollowers', payload->>'followers')::bigint between 10000 and 2147483647
     else false end)
 );
$$;
revoke all on function public.marketplace_approved(uuid) from public;
grant execute on function public.marketplace_approved(uuid) to anon, authenticated, service_role;

-- Older approvals without a qualifying count can resubmit instead of getting stuck.
update public.verification_applications
set status = 'needs_changes', review_note = 'Confirm a public Instagram, TikTok, or X profile with at least 10,000 followers before publishing. Counts across accounts are not combined.'
where role = 'creator' and status = 'approved' and not public.marketplace_approved(user_id);

drop policy if exists reviewed_creator_publishes on public.placements;
create policy reviewed_creator_publishes on public.placements as restrictive for insert to authenticated
with check (public.marketplace_approved(creator_id));
drop policy if exists reviewed_public_listings on public.placements;
create policy reviewed_public_listings on public.placements as restrictive for select to anon, authenticated
using (creator_id = (select auth.uid()) or public.marketplace_approved(creator_id));
drop trigger if exists reviewed_offer on public.offers;
create trigger reviewed_offer before insert on public.offers for each row execute function private.require_reviewed_offer();

create or replace function public.auto_review_verification(target uuid, decision text, note text, identity jsonb default '{}') returns void
language plpgsql security definer set search_path = '' as $$
declare applicant_role text;
begin
  if decision not in ('approved','needs_changes') or length(trim(note)) not between 10 and 1500 then raise exception 'Decision and review note required'; end if;
  if identity is null or jsonb_typeof(identity) <> 'object' or octet_length(identity::text) > 8000 then raise exception 'Invalid identity evidence'; end if;
  select role into applicant_role from public.verification_applications where user_id = target and status = 'pending' for update;
  if not found then raise exception 'Application is not awaiting review'; end if;
  if decision = 'approved' and applicant_role = 'creator' and not (case when identity->>'fetchedFollowers' ~ '^[0-9]{1,10}$' then (identity->>'fetchedFollowers')::bigint between 10000 and 2147483647 else false end) then
    raise exception 'A verified audience of at least 10000 on one platform is required';
  end if;
  update public.verification_applications set status = decision, review_note = trim(note), reviewed_at = now(), payload = (payload - 'fetchedFollowers' - 'verifiedProfileUrl' - 'verifiedAt') || identity where user_id = target;
  insert into private.verification_reviews(applicant_id,reviewer_id,decision,note,automated) values(target,null,decision,trim(note),true);
end;
$$;
revoke all on function public.auto_review_verification(uuid,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.auto_review_verification(uuid,text,text,jsonb) to service_role;
