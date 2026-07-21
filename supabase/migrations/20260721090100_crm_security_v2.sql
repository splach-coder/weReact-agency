begin;

-- Require the allowlisted email, a Google identity, and an OAuth-authenticated
-- session at the database boundary. UI checks alone are not authorization.
create or replace function public.is_team_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.team_members tm
      where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
    and exists (
      select 1
      from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) item
      where item ->> 'method' = 'oauth'
    );
$$;

revoke all on function public.is_team_member() from public;
grant execute on function public.is_team_member() to authenticated;

-- Replace the first RPC signature so every workflow write carries the version
-- the seller saw. A stale editor is rejected instead of overwriting newer work.
revoke all on function public.crm_update_lead(uuid, text, text, numeric, timestamptz) from public, anon, authenticated;
drop function if exists public.crm_update_lead(uuid, text, text, numeric, timestamptz);

create function public.crm_update_lead(
  p_lead_id uuid,
  p_status text,
  p_assigned_to text,
  p_estimated_value numeric,
  p_next_follow_up timestamptz,
  p_expected_updated_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous_status text;
  v_current_updated_at timestamptz;
  v_author text;
  v_assigned_to text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if p_status not in ('new', 'contacted', 'qualified', 'won', 'lost') then
    raise exception 'Invalid pipeline stage' using errcode = '22023';
  end if;

  if p_expected_updated_at is null then
    raise exception 'Lead version required' using errcode = '22023';
  end if;

  if p_estimated_value is not null
     and (p_estimated_value < 0 or p_estimated_value > 10000000) then
    raise exception 'Invalid estimated value' using errcode = '22023';
  end if;

  if p_assigned_to is not null then
    select tm.email
    into v_assigned_to
    from public.team_members tm
    where lower(tm.email) = lower(p_assigned_to);

    if v_assigned_to is null then
      raise exception 'Invalid team member' using errcode = '22023';
    end if;
  end if;

  select l.status, l.updated_at
  into v_previous_status, v_current_updated_at
  from public.leads l
  where l.id = p_lead_id
  for update;

  if v_previous_status is null then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;

  if date_trunc('milliseconds', v_current_updated_at)
     <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Lead changed in another session' using errcode = '40001';
  end if;

  select coalesce(tm.name, tm.email)
  into v_author
  from public.team_members tm
  where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''));

  update public.leads
  set
    status = p_status,
    assigned_to = v_assigned_to,
    estimated_value = p_estimated_value,
    next_follow_up = p_next_follow_up,
    last_contacted_at = case
      when p_status = 'contacted' and v_previous_status <> 'contacted' then now()
      else last_contacted_at
    end
  where id = p_lead_id;

  if v_previous_status <> p_status then
    insert into public.lead_events (lead_id, author, kind, body, meta)
    values (
      p_lead_id,
      v_author,
      'status_change',
      'Status changed from ' || v_previous_status || ' to ' || p_status,
      jsonb_build_object('from', v_previous_status, 'to', p_status)
    );
  end if;
end;
$$;

revoke all on function public.crm_update_lead(uuid, text, text, numeric, timestamptz, timestamptz) from public, anon;
grant execute on function public.crm_update_lead(uuid, text, text, numeric, timestamptz, timestamptz) to authenticated;

commit;