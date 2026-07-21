begin;

alter table public.leads
  alter column assigned_to set default '70karim.hida@gmail.com';

update public.leads
set assigned_to = '70karim.hida@gmail.com'
where assigned_to is null or assigned_to <> '70karim.hida@gmail.com';

update public.team_members
set role = 'seller'
where lower(email) = '70karim.hida@gmail.com';

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  phone text,
  whatsapp text
);

create unique index if not exists clients_email_lower_idx on public.clients (lower(email));
alter table public.clients enable row level security;

create table if not exists public.crm_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  originating_lead_id uuid references public.leads(id) on delete set null,
  project_name text not null,
  project_type text not null,
  status text not null default 'discovery'
    check (status in ('discovery','ready_for_dev','building','review','delivered','paused')),
  goals text not null default '',
  pages text[] not null default '{}',
  features text[] not null default '{}',
  languages text[] not null default '{}',
  content_status text not null default 'unknown',
  brand_status text not null default 'unknown',
  domain_status text not null default 'unknown',
  hosting_status text not null default 'unknown',
  reference_sites text[] not null default '{}',
  budget numeric check (budget is null or (budget >= 0 and budget <= 10000000)),
  target_launch date,
  developer_notes text not null default '',
  created_by text
);

create index if not exists crm_projects_client_idx on public.crm_projects (client_id, updated_at desc);
create index if not exists crm_projects_lead_idx on public.crm_projects (originating_lead_id);
alter table public.crm_projects enable row level security;

drop policy if exists "team read clients" on public.clients;
create policy "team read clients" on public.clients
  for select to authenticated using (public.is_team_member());

drop policy if exists "team read projects" on public.crm_projects;
create policy "team read projects" on public.crm_projects
  for select to authenticated using (public.is_team_member());

revoke insert, update, delete on table public.clients from authenticated;
revoke insert, update, delete on table public.crm_projects from authenticated;
grant select on table public.clients to authenticated;
grant select on table public.crm_projects to authenticated;

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
  v_status text := coalesce(p_brief ->> 'status', 'discovery');
  v_author text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if v_status not in ('discovery','ready_for_dev','building','review','delivered','paused') then
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
      client_id, originating_lead_id, project_name, project_type, status, goals,
      pages, features, languages, content_status, brand_status, domain_status,
      hosting_status, reference_sites, budget, target_launch, developer_notes, created_by
    ) values (
      v_client_id,
      p_lead_id,
      p_brief ->> 'project_name',
      p_brief ->> 'project_type',
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
    update public.crm_projects set
      project_name = p_brief ->> 'project_name',
      project_type = p_brief ->> 'project_type',
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
      then 'Project brief handed to Anas'
      else 'Project brief updated'
    end,
    jsonb_build_object('project_id', v_project_id, 'project_status', v_status)
  );

  return v_project_id;
end;
$$;

revoke all on function public.crm_upsert_project(uuid, uuid, jsonb) from public, anon;
grant execute on function public.crm_upsert_project(uuid, uuid, jsonb) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.crm_projects;
exception when duplicate_object then null;
end $$;

commit;