begin;

alter table public.clients alter column email drop not null;

alter table public.leads
  add column if not exists client_id uuid references public.clients(id) on delete set null;

create index if not exists leads_client_id_idx on public.leads (client_id);

update public.leads l
set client_id = c.id
from public.clients c
where l.client_id is null
  and nullif(trim(l.email), '') is not null
  and lower(c.email) = lower(l.email);

create or replace function public.crm_resolve_client(
  p_name text,
  p_email text,
  p_company text,
  p_phone text,
  p_whatsapp text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := trim(coalesce(p_phone, ''));
  v_whatsapp text := trim(coalesce(p_whatsapp, ''));
  v_phone_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_whatsapp_digits text := regexp_replace(coalesce(p_whatsapp, ''), '\D', '', 'g');
begin
  select c.id into v_client_id
  from public.clients c
  where (v_email <> '' and lower(coalesce(c.email, '')) = v_email)
     or (
       v_whatsapp_digits <> ''
       and regexp_replace(coalesce(c.whatsapp, ''), '\D', '', 'g') = v_whatsapp_digits
     )
     or (
       v_phone_digits <> ''
       and regexp_replace(coalesce(c.phone, ''), '\D', '', 'g') = v_phone_digits
     )
  order by case when v_email <> '' and lower(coalesce(c.email, '')) = v_email then 0 else 1 end
  limit 1;

  if v_client_id is not null then
    update public.clients set
      name = coalesce(nullif(trim(p_name), ''), name),
      email = coalesce(nullif(v_email, ''), email),
      company = coalesce(nullif(trim(p_company), ''), company),
      phone = coalesce(nullif(v_phone, ''), phone),
      whatsapp = coalesce(nullif(v_whatsapp, ''), whatsapp),
      updated_at = now()
    where id = v_client_id;
    return v_client_id;
  end if;

  if v_email <> '' then
    insert into public.clients (name, email, company, phone, whatsapp)
    values (
      trim(p_name),
      v_email,
      nullif(trim(p_company), ''),
      nullif(v_phone, ''),
      nullif(v_whatsapp, '')
    )
    on conflict (lower(email)) do update set
      name = excluded.name,
      company = coalesce(excluded.company, public.clients.company),
      phone = coalesce(excluded.phone, public.clients.phone),
      whatsapp = coalesce(excluded.whatsapp, public.clients.whatsapp),
      updated_at = now()
    returning id into v_client_id;
  else
    insert into public.clients (name, email, company, phone, whatsapp)
    values (
      trim(p_name),
      null,
      nullif(trim(p_company), ''),
      nullif(v_phone, ''),
      nullif(v_whatsapp, '')
    )
    returning id into v_client_id;
  end if;

  return v_client_id;
end;
$$;

revoke all on function public.crm_resolve_client(text,text,text,text,text) from public, anon, authenticated;

create or replace function public.leads_attach_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.client_id is null then
    new.client_id := public.crm_resolve_client(
      new.name,
      new.email,
      new.company,
      new.phone,
      new.whatsapp
    );
  end if;
  return new;
end;
$$;

drop trigger if exists leads_attach_client on public.leads;
create trigger leads_attach_client
before insert on public.leads
for each row execute function public.leads_attach_client();

create or replace function public.leads_log_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_author text := coalesce(auth.jwt() ->> 'email', 'system');
begin
  insert into public.lead_events (lead_id, author, kind, body, meta)
  values (
    new.id,
    v_author,
    'created',
    'Lead created from ' || replace(coalesce(new.source, 'unknown'), '_', ' '),
    jsonb_build_object('source', new.source, 'manual', new.source <> 'website_contact_form')
  );
  return new;
end;
$$;

create or replace function public.crm_create_manual_lead(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
  v_name text := trim(coalesce(p_payload ->> 'name', ''));
  v_email text := lower(trim(coalesce(p_payload ->> 'email', '')));
  v_company text := trim(coalesce(p_payload ->> 'company', ''));
  v_phone text := trim(coalesce(p_payload ->> 'phone', ''));
  v_whatsapp text := trim(coalesce(p_payload ->> 'whatsapp', ''));
  v_message text := trim(coalesce(p_payload ->> 'message', ''));
  v_source text := trim(coalesce(p_payload ->> 'source', ''));
  v_phone_digits text := regexp_replace(coalesce(p_payload ->> 'phone', ''), '\D', '', 'g');
  v_whatsapp_digits text := regexp_replace(coalesce(p_payload ->> 'whatsapp', ''), '\D', '', 'g');
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if v_name = '' then
    raise exception 'Client name is required' using errcode = '22023';
  end if;
  if v_email = '' and v_phone_digits = '' and v_whatsapp_digits = '' then
    raise exception 'A contact route is required' using errcode = '22023';
  end if;
  if v_source not in ('whatsapp','phone','referral','instagram','walk_in','other') then
    raise exception 'Invalid manual lead source' using errcode = '22023';
  end if;

  select l.id into v_lead_id
  from public.leads l
  where (v_email <> '' and lower(coalesce(l.email, '')) = v_email)
     or (
       v_whatsapp_digits <> ''
       and regexp_replace(coalesce(l.whatsapp, ''), '\D', '', 'g') = v_whatsapp_digits
     )
     or (
       v_phone_digits <> ''
       and regexp_replace(coalesce(l.phone, ''), '\D', '', 'g') = v_phone_digits
     )
  order by l.created_at desc
  limit 1;

  if v_lead_id is not null then
    return jsonb_build_object('lead_id', v_lead_id, 'created', false);
  end if;

  insert into public.leads (
    name,
    email,
    company,
    phone,
    whatsapp,
    message,
    status,
    source,
    attribution,
    assigned_to
  ) values (
    v_name,
    v_email,
    nullif(v_company, ''),
    v_phone,
    nullif(v_whatsapp, ''),
    coalesce(nullif(v_message, ''), 'Manual enquiry added by the team.'),
    'new',
    v_source,
    jsonb_build_object('entry', 'manual', 'added_by', coalesce(auth.jwt() ->> 'email', 'team')),
    '70karim.hida@gmail.com'
  )
  returning id into v_lead_id;

  return jsonb_build_object('lead_id', v_lead_id, 'created', true);
end;
$$;

revoke all on function public.crm_create_manual_lead(jsonb) from public, anon;
grant execute on function public.crm_create_manual_lead(jsonb) to authenticated;

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

  v_client_id := v_lead.client_id;
  if v_client_id is null then
    v_client_id := public.crm_resolve_client(
      v_lead.name,
      v_lead.email,
      v_lead.company,
      v_lead.phone,
      v_lead.whatsapp
    );
    update public.leads set client_id = v_client_id where id = p_lead_id;
  end if;

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
      when v_status = 'launched'
      then 'Project completed'
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
