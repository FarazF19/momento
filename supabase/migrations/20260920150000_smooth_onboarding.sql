-- Smooth onboarding: relaxed admission criteria and automated (system) reviews.
-- Creators no longer need a follower minimum or manual attestation checkboxes;
-- audience details are read from the live public profile during the automatic check.

do $$ begin
  if not exists (select from pg_roles where rolname = 'service_role') then
    create role service_role;
  end if;
end $$;

-- Replace the strict pending-criteria constraint with the relaxed launch criteria.
alter table public.verification_applications drop constraint verification_applications_check;
alter table public.verification_applications add constraint verification_pending_criteria check (
  status <> 'pending' or coalesce((
    payload->>'adult' = 'yes' and payload->>'accurate' = 'yes'
    and length(trim(payload->>'summary')) between 30 and 1500
    and coalesce(payload->>'profileUrl' ~ '^https://[^[:space:]]+$', false)
    and case when role = 'creator'
      then coalesce(payload->>'platform' in ('instagram','tiktok','x'), false)
      else coalesce(length(trim(payload->>'businessName')) between 2 and 150, false)
        and coalesce(payload->>'authority' = 'yes', false)
    end
  ), false)
);

-- Automated decisions are recorded in the same immutable audit table without a human reviewer.
alter table private.verification_reviews alter column reviewer_id drop not null;
alter table private.verification_reviews add column automated boolean not null default false;

-- Callable only by the server (service_role) after it has independently verified the
-- live ownership code on the applicant's public page. Never granted to end users.
create function public.auto_review_verification(target uuid, decision text, note text, identity jsonb default '{}') returns void
language plpgsql security definer set search_path = '' as $$
begin
  if decision not in ('approved','needs_changes') or length(trim(note)) not between 10 and 1500 then
    raise exception 'Decision and review note required';
  end if;
  if identity is null or jsonb_typeof(identity) <> 'object' or octet_length(identity::text) > 8000 then
    raise exception 'Invalid identity evidence';
  end if;
  update public.verification_applications
    set status = decision, review_note = trim(note), reviewed_at = now(), payload = payload || identity
    where user_id = target and status = 'pending';
  if not found then raise exception 'Application is not awaiting review'; end if;
  insert into private.verification_reviews(applicant_id, reviewer_id, decision, note, automated)
    values (target, null, decision, trim(note), true);
end;
$$;
revoke all on function public.auto_review_verification(uuid,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.auto_review_verification(uuid,text,text,jsonb) to service_role;
