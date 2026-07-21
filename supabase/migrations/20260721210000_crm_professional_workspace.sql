begin;

alter table public.leads drop constraint if exists leads_status_check;
update public.leads set status = 'discovery' where status = 'qualified';
alter table public.leads
  add constraint leads_status_check
  check (status in ('new','contacted','discovery','proposal_sent','negotiation','won','lost'));

alter table public.crm_projects add column if not exists domain_name text not null default '';
alter table public.crm_projects drop constraint if exists crm_projects_status_check;
update public.crm_projects set status = 'briefing' where status = 'discovery';
update public.crm_projects set status = 'launched' where status = 'delivered';
alter table public.crm_projects
  alter column status set default 'briefing',
  add constraint crm_projects_status_check
  check (status in ('briefing','ready_for_dev','building','review','launched','paused'));

revoke all on function public.crm_update_lead(uuid,text,text,numeric,timestamptz,timestamptz) from public, anon, authenticated;
drop function if exists public.crm_update_lead(uuid,text,text,numeric,timestamptz,timestamptz);

create or replace function public.crm_update_sales(
  p_lead_id uuid,
  p_status text,
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
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if p_status not in ('new','contacted','discovery','proposal_sent','negotiation','won','lost') then
    raise exception 'Invalid sales stage' using errcode = '22023';
  end if;

  if p_expected_updated_at is null then
    raise exception 'Lead version required' using errcode = '22023';
  end if;

  if p_estimated_value is not null
     and (p_estimated_value < 0 or p_estimated_value > 10000000) then
    raise exception 'Invalid estimated value' using errcode = '22023';
  end if;

  select status, updated_at into v_previous_status, v_current_updated_at
  from public.leads
  where id = p_lead_id
  for update;

  if v_previous_status is null then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;

  if date_trunc('milliseconds', v_current_updated_at)
     <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Lead changed in another session' using errcode = '40001';
  end if;

  select coalesce(tm.name, tm.email) into v_author
  from public.team_members tm
  where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''));

  update public.leads set
    status = p_status,
    assigned_to = '70karim.hida@gmail.com',
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
      'Sales stage changed from ' || v_previous_status || ' to ' || p_status,
      jsonb_build_object('from', v_previous_status, 'to', p_status)
    );
  end if;
end;
$$;

revoke all on function public.crm_update_sales(uuid,text,numeric,timestamptz,timestamptz) from public, anon;
grant execute on function public.crm_update_sales(uuid,text,numeric,timestamptz,timestamptz) to authenticated;

create or replace function public.crm_move_lead(
  p_lead_id uuid,
  p_status text,
  p_expected_updated_at timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous_status text;
  v_current_updated_at timestamptz;
  v_new_updated_at timestamptz;
  v_author text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if p_status not in ('new','contacted','discovery','proposal_sent','negotiation','won','lost') then
    raise exception 'Invalid sales stage' using errcode = '22023';
  end if;

  select status, updated_at into v_previous_status, v_current_updated_at
  from public.leads
  where id = p_lead_id
  for update;

  if v_previous_status is null then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;

  if p_expected_updated_at is null
     or date_trunc('milliseconds', v_current_updated_at)
        <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Lead changed in another session' using errcode = '40001';
  end if;

  if v_previous_status = p_status then
    return v_current_updated_at;
  end if;

  select coalesce(tm.name, tm.email) into v_author
  from public.team_members tm
  where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''));

  update public.leads set
    status = p_status,
    assigned_to = '70karim.hida@gmail.com',
    last_contacted_at = case
      when p_status = 'contacted' then now()
      else last_contacted_at
    end
  where id = p_lead_id
  returning updated_at into v_new_updated_at;

  insert into public.lead_events (lead_id, author, kind, body, meta)
  values (
    p_lead_id,
    v_author,
    'status_change',
    'Sales stage changed from ' || v_previous_status || ' to ' || p_status,
    jsonb_build_object('from', v_previous_status, 'to', p_status)
  );

  return v_new_updated_at;
end;
$$;

revoke all on function public.crm_move_lead(uuid,text,timestamptz) from public, anon;
grant execute on function public.crm_move_lead(uuid,text,timestamptz) to authenticated;

create or replace function public.crm_upsert_project(
  p_lead_id uuid,
  p_project_id uuid,
  p_brief jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead public.leads%rowtype;
  v_client_id uuid;
  v_project_id uuid;
  v_current_project_updated_at timestamptz;
  v_status text := coalesce(p_brief ->> 'status', 'briefing');
  v_author text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if v_status not in ('briefing','ready_for_dev','building','review','launched','paused') then
    raise exception 'Invalid project stage' using errcode = '22023';
  end if;

  if nullif(trim(p_brief ->> 'project_name'), '') is null
     or nullif(trim(p_brief ->> 'project_type'), '') is null then
    raise exception 'Project name and type are required' using errcode = '22023';
  end if;

  if v_status = 'ready_for_dev'
     and (
       nullif(trim(p_brief ->> 'goals'), '') is null
       or jsonb_array_length(coalesce(p_brief -> 'pages', '[]'::jsonb)) = 0
       or jsonb_array_length(coalesce(p_brief -> 'features', '[]'::jsonb)) = 0
       or jsonb_array_length(coalesce(p_brief -> 'languages', '[]'::jsonb)) = 0
     ) then
    raise exception 'Project brief is incomplete' using errcode = '22023';
  end if;

  select * into v_lead from public.leads where id = p_lead_id;
  if v_lead.id is null then
    raise exception 'Lead not found' using errcode = 'P0002';
  end if;

  insert into public.clients (name, email, company, phone, whatsapp)
  values (v_lead.name, lower(v_lead.email), v_lead.company, v_lead.phone, v_lead.whatsapp)
  on conflict (lower(email)) do update set
    name = excluded.name,
    company = coalesce(excluded.company, public.clients.company),
    phone = coalesce(excluded.phone, public.clients.phone),
    whatsapp = coalesce(excluded.whatsapp, public.clients.whatsapp),
    updated_at = now()
  returning id into v_client_id;

  select coalesce(tm.name, tm.email) into v_author
  from public.team_members tm
  where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''));

  if p_project_id is null then
    insert into public.crm_projects (
      client_id, originating_lead_id, project_name, project_type, domain_name,
      status, goals, pages, features, languages, content_status, brand_status,
      domain_status, hosting_status, reference_sites, budget, target_launch,
      developer_notes, created_by
    ) values (
      v_client_id,
      p_lead_id,
      p_brief ->> 'project_name',
      p_brief ->> 'project_type',
      regexp_replace(regexp_replace(regexp_replace(lower(trim(coalesce(p_brief ->> 'domain_name', ''))), '^https?://', ''), '^www\.', ''), '/.*$', ''),
      v_status,
      coalesce(p_brief ->> 'goals', ''),
      array(select jsonb_array_elements_text(coalesce(p_brief -> 'pages', '[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(p_brief -> 'features', '[]'::jsonb))),
      array(select jsonb_array_elements_text(coalesce(p_brief -> 'languages', '[]'::jsonb))),
      coalesce(p_brief ->> 'content_status', 'unknown'),
      coalesce(p_brief ->> 'brand_status', 'unknown'),
      coalesce(p_brief ->> 'domain_status', 'unknown'),
      coalesce(p_brief ->> 'hosting_status', 'unknown'),
      array(select jsonb_array_elements_text(coalesce(p_brief -> 'reference_sites', '[]'::jsonb))),
      nullif(p_brief ->> 'budget', '')::numeric,
      nullif(p_brief ->> 'target_launch', '')::date,
      coalesce(p_brief ->> 'developer_notes', ''),
      v_author
    ) returning id into v_project_id;
  else
    select updated_at into v_current_project_updated_at
    from public.crm_projects
    where id = p_project_id and client_id = v_client_id
    for update;

    if v_current_project_updated_at is null then
      raise exception 'Project not found' using errcode = 'P0002';
    end if;

    if nullif(p_brief ->> 'expected_updated_at', '') is null
       or date_trunc('milliseconds', v_current_project_updated_at)
          <> date_trunc('milliseconds', (p_brief ->> 'expected_updated_at')::timestamptz) then
      raise exception 'Project changed in another session' using errcode = '40001';
    end if;

    update public.crm_projects set
      project_name = p_brief ->> 'project_name',
      project_type = p_brief ->> 'project_type',
      domain_name = regexp_replace(regexp_replace(regexp_replace(lower(trim(coalesce(p_brief ->> 'domain_name', ''))), '^https?://', ''), '^www\.', ''), '/.*$', ''),
      status = v_status,
      goals = coalesce(p_brief ->> 'goals', ''),
      pages = array(select jsonb_array_elements_text(coalesce(p_brief -> 'pages', '[]'::jsonb))),
      features = array(select jsonb_array_elements_text(coalesce(p_brief -> 'features', '[]'::jsonb))),
      languages = array(select jsonb_array_elements_text(coalesce(p_brief -> 'languages', '[]'::jsonb))),
      content_status = coalesce(p_brief ->> 'content_status', 'unknown'),
      brand_status = coalesce(p_brief ->> 'brand_status', 'unknown'),
      domain_status = coalesce(p_brief ->> 'domain_status', 'unknown'),
      hosting_status = coalesce(p_brief ->> 'hosting_status', 'unknown'),
      reference_sites = array(select jsonb_array_elements_text(coalesce(p_brief -> 'reference_sites', '[]'::jsonb))),
      budget = nullif(p_brief ->> 'budget', '')::numeric,
      target_launch = nullif(p_brief ->> 'target_launch', '')::date,
      developer_notes = coalesce(p_brief ->> 'developer_notes', ''),
      updated_at = now()
    where id = p_project_id and client_id = v_client_id
    returning id into v_project_id;

    if v_project_id is null then
      raise exception 'Project not found' using errcode = 'P0002';
    end if;
  end if;

  update public.leads
  set assigned_to = '70karim.hida@gmail.com'
  where id = p_lead_id;

  insert into public.lead_events (lead_id, author, kind, body, meta)
  values (
    p_lead_id,
    v_author,
    'note',
    case when v_status = 'ready_for_dev'
      then 'Project brief handed to development'
      else 'Project brief updated'
    end,
    jsonb_build_object('project_id', v_project_id, 'project_status', v_status)
  );

  return v_project_id;
end;
$$;

revoke all on function public.crm_upsert_project(uuid,uuid,jsonb) from public, anon;
grant execute on function public.crm_upsert_project(uuid,uuid,jsonb) to authenticated;

commit;
