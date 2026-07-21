begin;

create table if not exists public.newsletter_subscribers (
  email text primary key check (email = lower(btrim(email))),
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  locale text not null,
  source text not null,
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_newsletter_subscriber_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_newsletter_subscriber_updated_at();

alter table public.newsletter_subscribers enable row level security;
revoke all on table public.newsletter_subscribers from anon, authenticated;

commit;
