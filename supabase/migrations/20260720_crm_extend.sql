-- CRM extension: workflow fields on leads, activity timeline, team allowlist,
-- and RLS so the authenticated dashboard (Supabase Auth) can read/write while
-- the public site keeps writing via the service-role key (which bypasses RLS).
-- Idempotent — safe to run more than once.

-- 1. Extend leads with CRM workflow fields
alter table public.leads
  add column if not exists assigned_to text,
  add column if not exists estimated_value numeric,
  add column if not exists next_follow_up timestamptz,
  add column if not exists last_contacted_at timestamptz;

-- 2. Activity timeline (notes + status changes + system events)
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  author text,
  kind text not null default 'note' check (kind in ('created','note','status_change','email_sent','contacted')),
  body text,
  meta jsonb not null default '{}'::jsonb
);
create index if not exists lead_events_lead_id_idx on public.lead_events (lead_id, created_at desc);
alter table public.lead_events enable row level security;

-- 3. Team allowlist — only these emails can sign in to the dashboard
create table if not exists public.team_members (
  email text primary key,
  name text,
  role text not null default 'seller' check (role in ('owner','seller')),
  created_at timestamptz not null default now()
);
alter table public.team_members enable row level security;

-- Helper: is the current signed-in user on the team?
create or replace function public.is_team_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.team_members tm
    where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 4. RLS policies (service_role bypasses RLS automatically; these gate the dashboard's anon/auth clients)
drop policy if exists "team read leads" on public.leads;
create policy "team read leads" on public.leads for select to authenticated using (public.is_team_member());
drop policy if exists "team update leads" on public.leads;
create policy "team update leads" on public.leads for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

drop policy if exists "team read events" on public.lead_events;
create policy "team read events" on public.lead_events for select to authenticated using (public.is_team_member());
drop policy if exists "team insert events" on public.lead_events;
create policy "team insert events" on public.lead_events for insert to authenticated with check (public.is_team_member());

drop policy if exists "team read members" on public.team_members;
create policy "team read members" on public.team_members for select to authenticated using (public.is_team_member());

-- 5. Keep updated_at fresh + auto-log a 'created' event on new leads
create or replace function public.leads_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.leads_set_updated_at();

create or replace function public.leads_log_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.lead_events (lead_id, author, kind, body)
  values (new.id, 'system', 'created', 'Lead created from ' || coalesce(new.source, 'unknown'));
  return new;
end; $$;
drop trigger if exists leads_log_created on public.leads;
create trigger leads_log_created after insert on public.leads
  for each row execute function public.leads_log_created();

-- 6. Team allowlist — only these Google accounts can sign in. Both are admins.
insert into public.team_members (email, name, role) values
  ('anasbenbow123@gmail.com', 'Anas', 'owner'),
  ('70karim.hida@gmail.com', 'Karim', 'owner')
on conflict (email) do nothing;
