begin;

create or replace function public.automation_claim_events(p_limit integer default 10)
returns setof public.automation_events
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception 'Automation service access denied' using errcode = '42501';
  end if;

  return query
  with candidates as (
    select event.id
    from public.automation_events event
    where event.status in ('pending', 'retry')
      and event.next_attempt_at <= now()
    order by event.next_attempt_at, event.created_at
    for update skip locked
    limit least(greatest(p_limit, 1), 25)
  )
  update public.automation_events event
  set status = 'processing',
      attempts = event.attempts + 1,
      locked_at = now(),
      completed_at = null
  from candidates
  where event.id = candidates.id
  returning event.*;
end;
$$;

revoke all on function public.automation_claim_events(integer) from public, anon, authenticated;
grant execute on function public.automation_claim_events(integer) to service_role;

commit;
