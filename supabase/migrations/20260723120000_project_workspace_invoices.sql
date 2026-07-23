begin;

alter table public.crm_projects
  add column if not exists assigned_developer_email text references public.team_members(email) on delete set null;

create table if not exists public.project_work_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.crm_projects(id) on delete cascade,
  kind text not null check (kind in ('milestone', 'task', 'delivery_check')),
  title text not null check (char_length(title) between 1 and 180),
  details text not null default '' check (char_length(details) <= 2000),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done', 'skipped')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  due_on date,
  assigned_to text references public.team_members(email) on delete set null,
  required boolean not null default false,
  position integer not null default 0 check (position >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_work_items_project_idx
  on public.project_work_items (project_id, position, created_at);
create index if not exists project_work_items_project_kind_status_idx
  on public.project_work_items (project_id, kind, status);
create index if not exists project_work_items_due_on_idx
  on public.project_work_items (due_on) where due_on is not null;

create table if not exists public.invoice_sequences (
  year integer primary key check (year between 2000 and 9999),
  last_number integer not null default 0 check (last_number >= 0)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.crm_projects(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,
  finance_transaction_id uuid references public.finance_transactions(id) on delete set null,
  number text unique,
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void')),
  issued_on date,
  due_on date,
  paid_on date,
  currency text not null default 'MAD' check (currency = 'MAD'),
  subtotal numeric(14,2) not null default 0 check (subtotal >= 0),
  total numeric(14,2) not null default 0 check (total >= 0),
  notes text not null default '' check (char_length(notes) <= 2000),
  seller_snapshot jsonb,
  customer_snapshot jsonb,
  created_by text not null default lower(coalesce(auth.jwt() ->> 'email', '')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    status = 'draft'
    or (number is not null and issued_on is not null and seller_snapshot is not null and customer_snapshot is not null)
  )
);

create unique index if not exists invoices_project_draft_unique
  on public.invoices (project_id) where status = 'draft';
create index if not exists invoices_project_idx on public.invoices (project_id, created_at desc);
create index if not exists invoices_client_idx on public.invoices (client_id, created_at desc);
create index if not exists invoices_finance_transaction_idx
  on public.invoices (finance_transaction_id) where finance_transaction_id is not null;

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null check (char_length(description) between 1 and 180),
  quantity numeric(12,2) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  line_total numeric(14,2) not null check (line_total >= 0),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (invoice_id, position)
);

create index if not exists invoice_lines_invoice_idx on public.invoice_lines (invoice_id, position);

create or replace function public.project_work_items_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists project_work_items_set_updated_at on public.project_work_items;
create trigger project_work_items_set_updated_at
  before update on public.project_work_items
  for each row execute function public.project_work_items_set_updated_at();

create or replace function public.invoices_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- A project never has duplicate required launch checks, including during migration backfill.
create unique index if not exists project_work_items_default_check_unique
  on public.project_work_items (project_id, title)
  where kind = 'delivery_check' and required = true;

create or replace function public.crm_seed_project_launch_checks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'launched' then
    insert into public.project_work_items (project_id, kind, title, required, position)
    values
      (new.id, 'delivery_check', 'Client approved the final website', true, 10),
      (new.id, 'delivery_check', 'Responsive layouts checked', true, 20),
      (new.id, 'delivery_check', 'Forms and conversion actions tested', true, 30),
      (new.id, 'delivery_check', 'Domain connected', true, 40),
      (new.id, 'delivery_check', 'Production hosting verified', true, 50),
      (new.id, 'delivery_check', 'Analytics and conversion tracking verified', true, 60),
      (new.id, 'delivery_check', 'SEO titles, descriptions, sitemap, and robots checked', true, 70),
      (new.id, 'delivery_check', 'Final backup and handover completed', true, 80)
    on conflict (project_id, title) where kind = 'delivery_check' and required = true do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_seed_project_launch_checks on public.crm_projects;
create trigger crm_seed_project_launch_checks
  after insert on public.crm_projects
  for each row execute function public.crm_seed_project_launch_checks();

insert into public.project_work_items (project_id, kind, title, required, position)
select project.id, 'delivery_check', checklist.title, true, checklist.position
from public.crm_projects project
cross join (
  values
    ('Client approved the final website', 10),
    ('Responsive layouts checked', 20),
    ('Forms and conversion actions tested', 30),
    ('Domain connected', 40),
    ('Production hosting verified', 50),
    ('Analytics and conversion tracking verified', 60),
    ('SEO titles, descriptions, sitemap, and robots checked', 70),
    ('Final backup and handover completed', 80)
) as checklist(title, position)
where project.status <> 'launched'
on conflict (project_id, title) where kind = 'delivery_check' and required = true do nothing;

create or replace function public.crm_block_incomplete_launch()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_remaining text;
begin
  if old.status = 'review' and new.status = 'launched' then
    select string_agg(title, ', ' order by position, title)
    into v_remaining
    from public.project_work_items
    where project_id = new.id
      and required = true
      and status not in ('done', 'skipped');

    if v_remaining is not null then
      raise exception 'Required launch checks are incomplete: %', v_remaining using errcode = '22023';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists crm_block_incomplete_launch on public.crm_projects;
create trigger crm_block_incomplete_launch
  before update of status on public.crm_projects
  for each row execute function public.crm_block_incomplete_launch();

alter table public.project_work_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.invoice_sequences enable row level security;

drop policy if exists project_work_items_team_select on public.project_work_items;
create policy project_work_items_team_select on public.project_work_items
  for select to authenticated using (public.is_team_member());
drop policy if exists invoices_team_select on public.invoices;
create policy invoices_team_select on public.invoices
  for select to authenticated using (public.is_team_member());
drop policy if exists invoice_lines_team_select on public.invoice_lines;
create policy invoice_lines_team_select on public.invoice_lines
  for select to authenticated using (public.is_team_member());

revoke all on table public.project_work_items from anon, authenticated;
revoke all on table public.invoices from anon, authenticated;
revoke all on table public.invoice_lines from anon, authenticated;
revoke all on table public.invoice_sequences from anon, authenticated;
grant select on table public.project_work_items to authenticated;
grant select on table public.invoices to authenticated;
grant select on table public.invoice_lines to authenticated;

create or replace function public.crm_save_project_work_item(
  p_project_id uuid,
  p_work_item_id uuid,
  p_item jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item_id uuid;
  v_kind text := lower(trim(coalesce(p_item ->> 'kind', 'task')));
  v_title text := trim(coalesce(p_item ->> 'title', ''));
  v_details text := trim(coalesce(p_item ->> 'details', ''));
  v_status text := lower(trim(coalesce(p_item ->> 'status', 'todo')));
  v_priority text := lower(trim(coalesce(p_item ->> 'priority', 'normal')));
  v_due_on date;
  v_assigned_to text := lower(nullif(trim(coalesce(p_item ->> 'assigned_to', '')), ''));
  v_required boolean := coalesce((p_item ->> 'required')::boolean, false);
  v_position integer := coalesce((p_item ->> 'position')::integer, 0);
  v_completed_at timestamptz;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  if not exists (select 1 from public.crm_projects where id = p_project_id) then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if v_kind not in ('milestone', 'task', 'delivery_check')
     or v_status not in ('todo', 'in_progress', 'blocked', 'done', 'skipped')
     or v_priority not in ('low', 'normal', 'high', 'urgent')
     or char_length(v_title) not between 1 and 180
     or char_length(v_details) > 2000
     or v_position < 0 then
    raise exception 'Invalid project work item' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_item ->> 'due_on', '')), '') is not null then
    v_due_on := (p_item ->> 'due_on')::date;
  end if;
  if v_assigned_to is not null and not exists (
    select 1 from public.team_members where lower(email) = v_assigned_to
  ) then
    raise exception 'Assigned team member not found' using errcode = '22023';
  end if;
  if v_status in ('done', 'skipped') then
    v_completed_at := coalesce(nullif(p_item ->> 'completed_at', '')::timestamptz, now());
  end if;

  if p_work_item_id is null then
    insert into public.project_work_items (
      project_id, kind, title, details, status, priority, due_on, assigned_to, required, position, completed_at
    ) values (
      p_project_id, v_kind, v_title, v_details, v_status, v_priority, v_due_on, v_assigned_to, v_required, v_position, v_completed_at
    ) returning id into v_item_id;
  else
    update public.project_work_items set
      kind = v_kind,
      title = v_title,
      details = v_details,
      status = v_status,
      priority = v_priority,
      due_on = v_due_on,
      assigned_to = v_assigned_to,
      required = v_required,
      position = v_position,
      completed_at = v_completed_at
    where id = p_work_item_id and project_id = p_project_id
    returning id into v_item_id;
    if v_item_id is null then
      raise exception 'Project work item not found' using errcode = 'P0002';
    end if;
  end if;
  return v_item_id;
end;
$$;

create or replace function public.crm_delete_project_work_item(
  p_project_id uuid,
  p_work_item_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  delete from public.project_work_items
  where id = p_work_item_id and project_id = p_project_id;
  if not found then
    raise exception 'Project work item not found' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.invoices_prevent_immutable_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    if old.status in ('issued', 'paid', 'void') then
      raise exception 'Issued invoices are immutable' using errcode = '22023';
    end if;
    return old;
  end if;

  if old.status in ('issued', 'paid', 'void') then
    if old.status = 'issued'
       and new.status in ('paid', 'void')
       and new.project_id is not distinct from old.project_id
       and new.client_id is not distinct from old.client_id
       and new.number is not distinct from old.number
       and new.issued_on is not distinct from old.issued_on
       and new.due_on is not distinct from old.due_on
       and new.currency is not distinct from old.currency
       and new.subtotal is not distinct from old.subtotal
       and new.total is not distinct from old.total
       and new.notes is not distinct from old.notes
       and new.seller_snapshot is not distinct from old.seller_snapshot
       and new.customer_snapshot is not distinct from old.customer_snapshot
       and new.created_by is not distinct from old.created_by then
      return new;
    end if;
    raise exception 'Issued invoices are immutable' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists invoices_prevent_immutable_changes on public.invoices;
create trigger invoices_prevent_immutable_changes
  before update or delete on public.invoices
  for each row execute function public.invoices_prevent_immutable_changes();

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.invoices_set_updated_at();

create or replace function public.invoice_lines_require_draft()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice_id uuid := coalesce(new.invoice_id, old.invoice_id);
begin
  if not exists (select 1 from public.invoices where id = v_invoice_id and status = 'draft') then
    raise exception 'Invoice lines can only change while the invoice is a draft' using errcode = '22023';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists invoice_lines_require_draft on public.invoice_lines;
create trigger invoice_lines_require_draft
  before insert or update or delete on public.invoice_lines
  for each row execute function public.invoice_lines_require_draft();

create or replace function public.crm_create_invoice_draft(
  p_project_id uuid,
  p_draft jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_project public.crm_projects%rowtype;
  v_invoice_id uuid;
  v_due_on date;
  v_notes text := trim(coalesce(p_draft ->> 'notes', ''));
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  select * into v_project from public.crm_projects where id = p_project_id for update;
  if v_project.id is null then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if char_length(v_notes) > 2000 then
    raise exception 'Invoice notes are too long' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_draft ->> 'due_on', '')), '') is not null then
    v_due_on := (p_draft ->> 'due_on')::date;
  end if;
  insert into public.invoices (project_id, client_id, due_on, notes, created_by)
  values (v_project.id, v_project.client_id, v_due_on, v_notes, lower(coalesce(auth.jwt() ->> 'email', '')))
  returning id into v_invoice_id;
  insert into public.invoice_lines (invoice_id, description, quantity, unit_price, line_total, position)
  values (
    v_invoice_id,
    trim(v_project.project_name) || ' website project',
    1,
    coalesce(v_project.budget, 0),
    coalesce(v_project.budget, 0),
    0
  );
  update public.invoices
  set subtotal = coalesce(v_project.budget, 0), total = coalesce(v_project.budget, 0)
  where id = v_invoice_id;
  return v_invoice_id;
end;
$$;

create or replace function public.crm_update_invoice_draft(
  p_invoice_id uuid,
  p_draft jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice public.invoices%rowtype;
  v_line jsonb;
  v_description text;
  v_quantity numeric(12,2);
  v_unit_price numeric(14,2);
  v_total numeric(14,2) := 0;
  v_position integer := 0;
  v_due_on date;
  v_notes text := trim(coalesce(p_draft ->> 'notes', ''));
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  select * into v_invoice from public.invoices where id = p_invoice_id for update;
  if v_invoice.id is null then
    raise exception 'Invoice not found' using errcode = 'P0002';
  end if;
  if v_invoice.status <> 'draft' then
    raise exception 'Issued invoices are immutable' using errcode = '22023';
  end if;
  if jsonb_typeof(p_draft -> 'lines') <> 'array' or jsonb_array_length(p_draft -> 'lines') = 0 then
    raise exception 'Add at least one invoice line' using errcode = '22023';
  end if;
  if char_length(v_notes) > 2000 then
    raise exception 'Invoice notes are too long' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_draft ->> 'due_on', '')), '') is not null then
    v_due_on := (p_draft ->> 'due_on')::date;
  end if;
  delete from public.invoice_lines where invoice_id = p_invoice_id;
  for v_line in select value from jsonb_array_elements(p_draft -> 'lines') loop
    v_description := trim(coalesce(v_line ->> 'description', ''));
    if v_description = '' or char_length(v_description) > 180
       or coalesce(v_line ->> 'quantity', '') !~ '^\d+(\.\d{1,2})?$'
       or coalesce(v_line ->> 'unit_price', '') !~ '^\d+(\.\d{1,2})?$' then
      raise exception 'Invalid invoice line' using errcode = '22023';
    end if;
    v_quantity := (v_line ->> 'quantity')::numeric(12,2);
    v_unit_price := (v_line ->> 'unit_price')::numeric(14,2);
    if v_quantity <= 0 or v_unit_price < 0 then
      raise exception 'Invalid invoice line' using errcode = '22023';
    end if;
    insert into public.invoice_lines (invoice_id, description, quantity, unit_price, line_total, position)
    values (p_invoice_id, v_description, v_quantity, v_unit_price, round(v_quantity * v_unit_price, 2), v_position);
    v_total := v_total + round(v_quantity * v_unit_price, 2);
    v_position := v_position + 1;
  end loop;
  update public.invoices
  set due_on = v_due_on, notes = v_notes, subtotal = v_total, total = v_total
  where id = p_invoice_id;
  return p_invoice_id;
end;
$$;

create or replace function public.crm_issue_invoice(p_invoice_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice public.invoices%rowtype;
  v_project public.crm_projects%rowtype;
  v_client public.clients%rowtype;
  v_sequence integer;
  v_year integer;
  v_finance_transaction_id uuid;
  v_paid_on date;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  select * into v_invoice from public.invoices where id = p_invoice_id for update;
  if v_invoice.id is null then
    raise exception 'Invoice not found' using errcode = 'P0002';
  end if;
  if v_invoice.status <> 'draft' then
    return v_invoice.number;
  end if;
  if v_invoice.total <= 0 or not exists (select 1 from public.invoice_lines where invoice_id = v_invoice.id) then
    raise exception 'Invoice total must be greater than zero' using errcode = '22023';
  end if;
  select * into v_project from public.crm_projects where id = v_invoice.project_id;
  select * into v_client from public.clients where id = v_invoice.client_id;
  if v_project.id is null or v_client.id is null then
    raise exception 'Invoice project or customer not found' using errcode = 'P0002';
  end if;
  v_year := extract(year from current_date)::integer;
  insert into public.invoice_sequences (year, last_number)
  values (v_year, 1)
  on conflict (year) do update
  set last_number = public.invoice_sequences.last_number + 1
  returning last_number into v_sequence;

  select id, occurred_on into v_finance_transaction_id, v_paid_on
  from public.finance_transactions
  where project_id = v_invoice.project_id and source = 'project_close'
  order by created_at desc
  limit 1;

  update public.invoices
  set number = 'WR-' || v_year::text || '-' || lpad(v_sequence::text, 4, '0'),
      status = case when v_finance_transaction_id is not null then 'paid' else 'issued' end,
      issued_on = current_date,
      paid_on = case when v_finance_transaction_id is not null then v_paid_on else null end,
      finance_transaction_id = v_finance_transaction_id,
      seller_snapshot = jsonb_build_object('name', 'WeReact agency', 'email', 'hello@wereact.agency', 'phone', '+212 602-258009', 'address', 'Marrakech 40000', 'website', 'https://www.wereact.agency'),
      customer_snapshot = jsonb_build_object('name', v_client.name, 'company', v_client.company, 'email', v_client.email, 'phone', v_client.phone, 'whatsapp', v_client.whatsapp)
  where id = v_invoice.id;

  return 'WR-' || v_year::text || '-' || lpad(v_sequence::text, 4, '0');
end;
$$;

create or replace function public.crm_void_invoice(p_invoice_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;
  update public.invoices set status = 'void'
  where id = p_invoice_id and status = 'issued';
  if not found then
    raise exception 'Only issued invoices can be voided' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.crm_save_project_work_item(uuid, uuid, jsonb) from public, anon;
revoke all on function public.crm_delete_project_work_item(uuid, uuid) from public, anon;
revoke all on function public.crm_create_invoice_draft(uuid, jsonb) from public, anon;
revoke all on function public.crm_update_invoice_draft(uuid, jsonb) from public, anon;
revoke all on function public.crm_issue_invoice(uuid) from public, anon;
revoke all on function public.crm_void_invoice(uuid) from public, anon;
grant execute on function public.crm_save_project_work_item(uuid, uuid, jsonb) to authenticated;
grant execute on function public.crm_delete_project_work_item(uuid, uuid) to authenticated;
grant execute on function public.crm_create_invoice_draft(uuid, jsonb) to authenticated;
grant execute on function public.crm_update_invoice_draft(uuid, jsonb) to authenticated;
grant execute on function public.crm_issue_invoice(uuid) to authenticated;
grant execute on function public.crm_void_invoice(uuid) to authenticated;

create or replace function public.crm_record_project_close_revenue()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
  v_finance_transaction_id uuid;
begin
  if tg_op = 'UPDATE' and old.status = 'launched' and new.budget is distinct from old.budget then
    raise exception 'Closed project amount is locked' using errcode = '22023';
  end if;
  if new.status = 'launched' and coalesce(new.budget, 0) <= 0 then
    raise exception 'Confirmed project amount is required' using errcode = '22023';
  end if;
  if new.status = 'launched' and (tg_op = 'INSERT' or old.status is distinct from 'launched') then
    v_actor := lower(coalesce(nullif(auth.jwt() ->> 'email', ''), nullif(new.created_by, ''), 'system'));
    insert into public.finance_transactions (
      occurred_on, type, status, amount, category, description, client_id, project_id, source, created_by
    ) values (
      current_date, 'income', 'paid', new.budget, 'Website project', new.project_name || ' - final payment', new.client_id, new.id, 'project_close', v_actor
    ) on conflict (project_id) where source = 'project_close' do nothing
    returning id into v_finance_transaction_id;
    if v_finance_transaction_id is null then
      select id into v_finance_transaction_id
      from public.finance_transactions
      where project_id = new.id and source = 'project_close';
    end if;
    update public.invoices
    set finance_transaction_id = v_finance_transaction_id,
        status = 'paid',
        paid_on = current_date
    where project_id = new.id and status = 'issued';
  end if;
  return new;
end;
$$;

drop trigger if exists crm_project_close_revenue on public.crm_projects;
create trigger crm_project_close_revenue
  after insert or update of status, budget on public.crm_projects
  for each row execute function public.crm_record_project_close_revenue();

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'project_work_items') then
      alter publication supabase_realtime add table public.project_work_items;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'invoices') then
      alter publication supabase_realtime add table public.invoices;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'invoice_lines') then
      alter publication supabase_realtime add table public.invoice_lines;
    end if;
  end if;
end;
$$;

commit;
