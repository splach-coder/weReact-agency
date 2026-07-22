begin;

alter table public.finance_transactions
  add column if not exists source text not null default 'manual';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'finance_transactions_source_check'
      and conrelid = 'public.finance_transactions'::regclass
  ) then
    alter table public.finance_transactions
      add constraint finance_transactions_source_check
      check (source in ('manual', 'project_close', 'adjustment'));
  end if;
end;
$$;

create unique index if not exists finance_transactions_project_close_unique
  on public.finance_transactions (project_id)
  where source = 'project_close';

create or replace function public.crm_record_project_close_revenue()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
begin
  if tg_op = 'UPDATE'
     and old.status = 'launched'
     and new.budget is distinct from old.budget then
    raise exception 'Closed project amount is locked' using errcode = '22023';
  end if;

  if new.status = 'launched' and coalesce(new.budget, 0) <= 0 then
    raise exception 'Confirmed project amount is required' using errcode = '22023';
  end if;

  if new.status = 'launched'
     and (tg_op = 'INSERT' or old.status is distinct from 'launched') then
    v_actor := lower(coalesce(
      nullif(auth.jwt() ->> 'email', ''),
      nullif(new.created_by, ''),
      'system'
    ));

    insert into public.finance_transactions (
      occurred_on,
      type,
      status,
      amount,
      category,
      description,
      client_id,
      project_id,
      source,
      created_by
    ) values (
      current_date,
      'income',
      'paid',
      new.budget,
      'Website project',
      new.project_name || ' - final payment',
      new.client_id,
      new.id,
      'project_close',
      v_actor
    )
    on conflict (project_id) where source = 'project_close' do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists crm_project_close_revenue on public.crm_projects;
create trigger crm_project_close_revenue
  after insert or update of status, budget on public.crm_projects
  for each row execute function public.crm_record_project_close_revenue();

insert into public.finance_transactions (
  occurred_on,
  type,
  status,
  amount,
  category,
  description,
  client_id,
  project_id,
  source,
  created_by
)
select
  project.updated_at::date,
  'income',
  'paid',
  project.budget,
  'Website project',
  project.project_name || ' - final payment',
  project.client_id,
  project.id,
  'project_close',
  lower(coalesce(nullif(project.created_by, ''), 'system'))
from public.crm_projects project
where project.status = 'launched'
  and project.budget > 0
on conflict (project_id) where source = 'project_close' do nothing;

commit;
