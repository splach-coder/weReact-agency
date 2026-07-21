begin;

-- Treat the CRM allowlist as Google-OAuth-only. A matching email alone is not
-- sufficient: the active JWT must also contain an OAuth authentication method.
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
    and exists (
      select 1
      from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) item
      where item ->> 'method' = 'oauth'
    );
$$;

revoke all on function public.is_team_member() from public;
grant execute on function public.is_team_member() to authenticated;

-- All mutable CRM fields are written through this single transaction. It
-- validates the requested owner and writes the audit event atomically.
create or replace function public.crm_update_lead(
  p_lead_id uuid,
  p_status text,
  p_assigned_to text,
  p_estimated_value numeric,
  p_next_follow_up timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous_status text;
  v_author text;
  v_assigned_to text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if p_status not in ('new', 'contacted', 'qualified', 'won', 'lost') then
    raise exception 'Invalid pipeline stage' using errcode = '22023';
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

  select l.status
  into v_previous_status
  from public.leads l
  where l.id = p_lead_id
  for update;

  if v_previous_status is null then
    raise exception 'Lead not found' using errcode = 'P0002';
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

create or replace function public.crm_add_lead_note(
  p_lead_id uuid,
  p_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note text := btrim(coalesce(p_note, ''));
  v_author text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if char_length(v_note) = 0 or char_length(v_note) > 2000 then
    raise exception 'Invalid note' using errcode = '22023';
  end if;

  if not exists (select 1 from public.leads l where l.id = p_lead_id) then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;

  select coalesce(tm.name, tm.email)
  into v_author
  from public.team_members tm
  where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''));

  insert into public.lead_events (lead_id, author, kind, body, meta)
  values (p_lead_id, v_author, 'note', v_note, '{}'::jsonb);
end;
$$;

revoke all on function public.crm_update_lead(uuid, text, text, numeric, timestamptz) from public, anon;
revoke all on function public.crm_add_lead_note(uuid, text) from public, anon;
grant execute on function public.crm_update_lead(uuid, text, text, numeric, timestamptz) to authenticated;
grant execute on function public.crm_add_lead_note(uuid, text) to authenticated;

-- Authenticated users retain read access through RLS. Direct writes are
-- removed; the validated security-definer functions above are the only path.
drop policy if exists "team update leads" on public.leads;
drop policy if exists "team insert events" on public.lead_events;
revoke update on table public.leads from authenticated;
revoke insert on table public.lead_events from authenticated;

-- Make the live-refresh contract part of deployment instead of relying only
-- on the dashboard's polling fallback.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
    ) then
      alter publication supabase_realtime add table public.leads;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lead_events'
    ) then
      alter publication supabase_realtime add table public.lead_events;
    end if;
  end if;
end;
$$;

commit;