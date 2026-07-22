begin;

alter table public.newsletter_subscribers
  add column if not exists unsubscribe_token uuid default gen_random_uuid();
update public.newsletter_subscribers set unsubscribe_token = gen_random_uuid() where unsubscribe_token is null;
alter table public.newsletter_subscribers alter column unsubscribe_token set not null;
create unique index if not exists newsletter_subscribers_unsubscribe_token_idx
  on public.newsletter_subscribers (unsubscribe_token);

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  created_by text not null default lower(coalesce(auth.jwt() ->> 'email', '')),
  subject text not null check (char_length(subject) between 1 and 120),
  preview_text text not null check (char_length(preview_text) between 1 and 180),
  content text not null check (char_length(content) between 20 and 12000),
  audience_count integer not null default 0 check (audience_count >= 0),
  sent_count integer not null default 0 check (sent_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  status text not null default 'draft' check (status in ('draft','sending','sent','partial','failed'))
);

create table if not exists public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_on date not null default current_date,
  type text not null check (type in ('income','expense')),
  status text not null default 'paid' check (status in ('pending','paid')),
  amount numeric(14,2) not null check (amount > 0),
  category text not null check (char_length(category) between 1 and 80),
  description text not null check (char_length(description) between 1 and 180),
  reference text,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.crm_projects(id) on delete set null,
  created_by text not null default lower(coalesce(auth.jwt() ->> 'email', ''))
);

create index if not exists finance_transactions_occurred_on_idx on public.finance_transactions (occurred_on desc);
create index if not exists finance_transactions_project_id_idx on public.finance_transactions (project_id);

alter table public.newsletter_campaigns enable row level security;
alter table public.finance_transactions enable row level security;

drop policy if exists newsletter_subscribers_team_select on public.newsletter_subscribers;
create policy newsletter_subscribers_team_select on public.newsletter_subscribers
  for select to authenticated using (public.is_team_member());
drop policy if exists newsletter_subscribers_team_update on public.newsletter_subscribers;
create policy newsletter_subscribers_team_update on public.newsletter_subscribers
  for update to authenticated using (public.is_team_member()) with check (public.is_team_member());

drop policy if exists newsletter_campaigns_team_all on public.newsletter_campaigns;
create policy newsletter_campaigns_team_all on public.newsletter_campaigns
  for all to authenticated using (public.is_team_member()) with check (public.is_team_member());
drop policy if exists finance_transactions_team_all on public.finance_transactions;
create policy finance_transactions_team_all on public.finance_transactions
  for all to authenticated using (public.is_team_member()) with check (public.is_team_member());

grant select, update on table public.newsletter_subscribers to authenticated;
grant select, insert, update on table public.newsletter_campaigns to authenticated;
grant select, insert, update, delete on table public.finance_transactions to authenticated;
revoke all on table public.newsletter_campaigns from anon;
revoke all on table public.finance_transactions from anon;

commit;
