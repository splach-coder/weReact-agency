begin;

create table if not exists public.automation_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$'),
  aggregate_type text not null check (char_length(aggregate_type) between 1 and 60),
  aggregate_id uuid,
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 240),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'retry', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts between 1 and 20),
  next_attempt_at timestamptz not null default now(),
  locked_at timestamptz,
  completed_at timestamptz,
  last_error text check (last_error is null or char_length(last_error) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists automation_events_pending_idx
  on public.automation_events (next_attempt_at, created_at)
  where status in ('pending', 'retry');
create index if not exists automation_events_aggregate_idx
  on public.automation_events (aggregate_type, aggregate_id, created_at desc);

create table if not exists public.attention_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('new_lead', 'follow_up_overdue', 'proposal_review', 'proposal_stale', 'invoice_overdue', 'email_bounced', 'blocked_task', 'launch_risk', 'integration_failure')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'snoozed', 'completed')),
  title text not null check (char_length(title) between 1 and 180),
  detail text not null default '' check (char_length(detail) <= 1000),
  owner_email text references public.team_members(email) on delete set null,
  due_at timestamptz,
  snoozed_until timestamptz,
  source_type text not null check (source_type in ('lead', 'project', 'invoice', 'communication', 'integration')),
  source_id uuid,
  source_href text not null check (char_length(source_href) between 1 and 500),
  action_label text not null default 'Open' check (char_length(action_label) between 1 and 80),
  idempotency_key text not null unique check (char_length(idempotency_key) between 1 and 240),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists attention_items_open_due_idx
  on public.attention_items (priority, due_at, created_at)
  where status in ('open', 'snoozed');
create index if not exists attention_items_source_idx
  on public.attention_items (source_type, source_id, created_at desc);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email', 'whatsapp', 'phone', 'system')),
  direction text not null check (direction in ('inbound', 'outbound')),
  provider text not null check (char_length(provider) between 1 and 60),
  provider_message_id text,
  state text not null default 'queued' check (state in ('draft', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'complained', 'failed')),
  from_address text not null default '' check (char_length(from_address) <= 320),
  to_address text not null default '' check (char_length(to_address) <= 320),
  subject text not null default '' check (char_length(subject) <= 240),
  body_summary text not null default '' check (char_length(body_summary) <= 2000),
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.crm_projects(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  approved_by text references public.team_members(email) on delete set null,
  approved_at timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists communications_provider_message_unique
  on public.communications (provider, provider_message_id)
  where provider_message_id is not null;
create index if not exists communications_client_idx
  on public.communications (client_id, created_at desc);
create index if not exists communications_lead_idx
  on public.communications (lead_id, created_at desc);

create table if not exists public.communication_events (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid references public.communications(id) on delete cascade,
  provider text not null check (char_length(provider) between 1 and 60),
  provider_event_id text not null check (char_length(provider_event_id) between 1 and 240),
  event_type text not null check (char_length(event_type) between 1 and 100),
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create index if not exists communication_events_communication_idx
  on public.communication_events (communication_id, occurred_at desc);

create table if not exists public.integration_health (
  provider text primary key check (provider in ('resend', 'whatsapp', 'openai', 'automation', 'storage', 'payments')),
  status text not null default 'unconfigured' check (status in ('unconfigured', 'configured', 'healthy', 'degraded', 'disabled')),
  message text not null default '' check (char_length(message) <= 1000),
  last_success_at timestamptz,
  last_failure_at timestamptz,
  last_checked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.integration_health (provider, status, message)
values
  ('resend', 'configured', 'Awaiting the first verified delivery event.'),
  ('whatsapp', 'unconfigured', 'Add official Meta WhatsApp Business credentials to activate messaging.'),
  ('openai', 'unconfigured', 'Add an OpenAI API key and cost limits to activate copilots.'),
  ('automation', 'configured', 'Automation foundation is installed.'),
  ('storage', 'configured', 'Supabase storage activation is completed with the client portal.'),
  ('payments', 'disabled', 'Payments remain manually confirmed until a provider is selected.')
on conflict (provider) do nothing;

create or replace function public.smart_agency_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger automation_events_set_updated_at before update on public.automation_events
  for each row execute function public.smart_agency_set_updated_at();
create trigger attention_items_set_updated_at before update on public.attention_items
  for each row execute function public.smart_agency_set_updated_at();
create trigger communications_set_updated_at before update on public.communications
  for each row execute function public.smart_agency_set_updated_at();
create trigger integration_health_set_updated_at before update on public.integration_health
  for each row execute function public.smart_agency_set_updated_at();

create or replace function public.crm_refresh_attention_items()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer := 0;
  v_step integer := 0;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  update public.attention_items item
  set status = 'completed', completed_at = now()
  where item.status <> 'completed'
    and (
      (item.kind = 'new_lead' and not exists (
        select 1 from public.leads lead where lead.id = item.source_id and lead.status = 'new'
      ))
      or (item.kind = 'follow_up_overdue' and not exists (
        select 1 from public.leads lead
        where lead.id = item.source_id
          and lead.status not in ('won', 'lost')
          and lead.next_follow_up is not null
          and lead.next_follow_up <= now()
      ))
      or (item.kind = 'invoice_overdue' and not exists (
        select 1 from public.invoices invoice
        where invoice.id = item.source_id
          and invoice.status = 'issued'
          and invoice.due_on < current_date
      ))
      or (item.kind = 'blocked_task' and not exists (
        select 1 from public.project_work_items work
        where work.id = item.source_id and work.status = 'blocked'
      ))
      or (item.kind = 'integration_failure' and not exists (
        select 1 from public.integration_health integration
        where item.idempotency_key = 'integration:' || integration.provider
          and integration.status = 'degraded'
      ))
    );

  insert into public.attention_items (
    kind, priority, title, detail, owner_email, due_at, source_type, source_id,
    source_href, action_label, idempotency_key
  )
  select
    'new_lead', 'high', lead.name || ' needs a first reply',
    coalesce(nullif(lead.company, ''), 'New website enquiry'), lead.assigned_to,
    lead.created_at + interval '1 hour', 'lead', lead.id,
    '/admin/leads/' || lead.id::text, 'Reply now', 'lead:new:' || lead.id::text
  from public.leads lead
  where lead.status = 'new'
  on conflict (idempotency_key) do update set
    title = excluded.title,
    detail = excluded.detail,
    owner_email = excluded.owner_email,
    due_at = excluded.due_at,
    source_href = excluded.source_href,
    status = case
      when public.attention_items.status = 'snoozed' and public.attention_items.snoozed_until > now()
        then 'snoozed'
      else 'open'
    end,
    completed_at = null;
  get diagnostics v_count = row_count;

  insert into public.attention_items (
    kind, priority, title, detail, owner_email, due_at, source_type, source_id,
    source_href, action_label, idempotency_key
  )
  select
    'follow_up_overdue', 'urgent', 'Follow up with ' || lead.name,
    'The scheduled follow-up is overdue.', lead.assigned_to, lead.next_follow_up,
    'lead', lead.id, '/admin/leads/' || lead.id::text,
    'Open client', 'lead:follow-up:' || lead.id::text
  from public.leads lead
  where lead.status not in ('won', 'lost')
    and lead.next_follow_up is not null
    and lead.next_follow_up <= now()
  on conflict (idempotency_key) do update set
    title = excluded.title,
    owner_email = excluded.owner_email,
    due_at = excluded.due_at,
    status = case
      when public.attention_items.status = 'snoozed' and public.attention_items.snoozed_until > now()
        then 'snoozed'
      else 'open'
    end,
    completed_at = null;
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;

  insert into public.attention_items (
    kind, priority, title, detail, due_at, source_type, source_id,
    source_href, action_label, idempotency_key
  )
  select
    'invoice_overdue', 'urgent', 'Invoice ' || invoice.number || ' is overdue',
    'Payment was due on ' || to_char(invoice.due_on, 'DD Mon YYYY') || '.',
    invoice.due_on::timestamptz, 'invoice', invoice.id,
    '/admin/invoices/' || invoice.id::text, 'Open invoice',
    'invoice:overdue:' || invoice.id::text
  from public.invoices invoice
  where invoice.status = 'issued' and invoice.due_on < current_date
  on conflict (idempotency_key) do update set
    title = excluded.title,
    detail = excluded.detail,
    due_at = excluded.due_at,
    status = case
      when public.attention_items.status = 'snoozed' and public.attention_items.snoozed_until > now()
        then 'snoozed'
      else 'open'
    end,
    completed_at = null;
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;

  insert into public.attention_items (
    kind, priority, title, detail, owner_email, due_at, source_type, source_id,
    source_href, action_label, idempotency_key
  )
  select
    'blocked_task', 'high', work.title || ' is blocked',
    coalesce(nullif(work.details, ''), project.project_name), work.assigned_to,
    work.due_on::timestamptz, 'project', work.id,
    case when project.originating_lead_id is not null
      then '/admin/leads/' || project.originating_lead_id::text || '?project=' || project.id::text
      else '/admin/pipeline'
    end,
    'Open project', 'work:blocked:' || work.id::text
  from public.project_work_items work
  join public.crm_projects project on project.id = work.project_id
  where work.status = 'blocked'
  on conflict (idempotency_key) do update set
    title = excluded.title,
    detail = excluded.detail,
    owner_email = excluded.owner_email,
    due_at = excluded.due_at,
    source_href = excluded.source_href,
    status = case
      when public.attention_items.status = 'snoozed' and public.attention_items.snoozed_until > now()
        then 'snoozed'
      else 'open'
    end,
    completed_at = null;
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;

  insert into public.attention_items (
    kind, priority, title, detail, source_type, source_href, action_label, idempotency_key
  )
  select
    'integration_failure', 'urgent', initcap(integration.provider) || ' needs attention',
    coalesce(nullif(integration.message, ''), 'The integration reported a failure.'),
    'integration', '/admin/automation', 'Review integration',
    'integration:' || integration.provider
  from public.integration_health integration
  where integration.status = 'degraded'
  on conflict (idempotency_key) do update set
    title = excluded.title,
    detail = excluded.detail,
    status = 'open',
    completed_at = null;
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;

  return v_count;
end;
$$;

create or replace function public.crm_complete_attention_item(p_item_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  update public.attention_items
  set status = 'completed', completed_at = now(), snoozed_until = null
  where id = p_item_id;
  if not found then raise exception 'Attention item not found' using errcode = 'P0002'; end if;
end;
$$;

create or replace function public.crm_snooze_attention_item(p_item_id uuid, p_until timestamptz)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  if p_until <= now() or p_until > now() + interval '30 days' then
    raise exception 'Choose a future snooze time within 30 days' using errcode = '22023';
  end if;
  update public.attention_items
  set status = 'snoozed', snoozed_until = p_until, completed_at = null
  where id = p_item_id and status <> 'completed';
  if not found then raise exception 'Open attention item not found' using errcode = 'P0002'; end if;
end;
$$;

create or replace function public.crm_retry_automation_event(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  update public.automation_events
  set status = 'pending', next_attempt_at = now(), locked_at = null,
      completed_at = null, last_error = null
  where id = p_event_id and status in ('retry', 'failed');
  if not found then raise exception 'Retryable automation event not found' using errcode = 'P0002'; end if;
end;
$$;

create or replace function public.crm_upsert_integration_health(
  p_provider text,
  p_status text,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  if p_provider not in ('resend', 'whatsapp', 'openai', 'automation', 'storage', 'payments')
     or p_status not in ('unconfigured', 'configured', 'healthy', 'degraded', 'disabled') then
    raise exception 'Invalid integration health update' using errcode = '22023';
  end if;
  insert into public.integration_health (
    provider, status, message, last_success_at, last_failure_at, last_checked_at
  ) values (
    p_provider, p_status, left(coalesce(p_message, ''), 1000),
    case when p_status = 'healthy' then now() else null end,
    case when p_status = 'degraded' then now() else null end,
    now()
  )
  on conflict (provider) do update set
    status = excluded.status,
    message = excluded.message,
    last_success_at = case when excluded.status = 'healthy' then now() else public.integration_health.last_success_at end,
    last_failure_at = case when excluded.status = 'degraded' then now() else public.integration_health.last_failure_at end,
    last_checked_at = now();
end;
$$;

alter table public.automation_events enable row level security;
alter table public.attention_items enable row level security;
alter table public.communications enable row level security;
alter table public.communication_events enable row level security;
alter table public.integration_health enable row level security;

create policy automation_events_team_select on public.automation_events
  for select to authenticated using (public.is_team_member());
create policy attention_items_team_select on public.attention_items
  for select to authenticated using (public.is_team_member());
create policy communications_team_select on public.communications
  for select to authenticated using (public.is_team_member());
create policy communication_events_team_select on public.communication_events
  for select to authenticated using (public.is_team_member());
create policy integration_health_team_select on public.integration_health
  for select to authenticated using (public.is_team_member());

revoke all on table public.automation_events from anon, authenticated;
revoke all on table public.attention_items from anon, authenticated;
revoke all on table public.communications from anon, authenticated;
revoke all on table public.communication_events from anon, authenticated;
revoke all on table public.integration_health from anon, authenticated;

grant select on table public.automation_events to authenticated;
grant select on table public.attention_items to authenticated;
grant select on table public.communications to authenticated;
grant select on table public.communication_events to authenticated;
grant select on table public.integration_health to authenticated;

revoke all on function public.crm_refresh_attention_items() from public, anon;
revoke all on function public.crm_complete_attention_item(uuid) from public, anon;
revoke all on function public.crm_snooze_attention_item(uuid, timestamptz) from public, anon;
revoke all on function public.crm_retry_automation_event(uuid) from public, anon;
revoke all on function public.crm_upsert_integration_health(text, text, text) from public, anon;
grant execute on function public.crm_refresh_attention_items() to authenticated;
grant execute on function public.crm_complete_attention_item(uuid) to authenticated;
grant execute on function public.crm_snooze_attention_item(uuid, timestamptz) to authenticated;
grant execute on function public.crm_retry_automation_event(uuid) to authenticated;
grant execute on function public.crm_upsert_integration_health(text, text, text) to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'automation_events') then
    alter publication supabase_realtime add table public.automation_events;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'attention_items') then
    alter publication supabase_realtime add table public.attention_items;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'communications') then
    alter publication supabase_realtime add table public.communications;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'communication_events') then
    alter publication supabase_realtime add table public.communication_events;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'integration_health') then
    alter publication supabase_realtime add table public.integration_health;
  end if;
end $$;
commit;