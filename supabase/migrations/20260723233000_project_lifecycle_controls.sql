begin;

alter table public.crm_projects
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text;

create index if not exists crm_projects_active_updated_idx
  on public.crm_projects (updated_at desc)
  where deleted_at is null;

create or replace function public.invoices_prevent_immutable_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_lifecycle_action text := current_setting('app.crm_project_lifecycle', true);
begin
  if tg_op <> 'DELETE' and new.status = 'paid' then
    if new.finance_transaction_id is null or not exists (
      select 1
      from public.finance_transactions
      where id = new.finance_transaction_id
        and project_id = new.project_id
        and source = 'project_close'
        and type = 'income'
        and status = 'paid'
        and amount = new.total
    ) then
      raise exception 'Paid invoice total must match its project close transaction' using errcode = '22023';
    end if;
  end if;

  if tg_op = 'INSERT' then
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.status in ('issued', 'paid', 'void') then
      raise exception 'Issued invoices are immutable' using errcode = '22023';
    end if;
    return old;
  end if;

  if old.status = 'paid'
     and v_lifecycle_action in ('reopen', 'archive')
     and new.status = (case when v_lifecycle_action = 'reopen' then 'issued' else 'void' end)
     and new.finance_transaction_id is null
     and new.paid_on is null
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

create or replace function public.crm_projects_prevent_archived_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.deleted_at is not null then
    raise exception 'Archived projects cannot be changed' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists crm_projects_prevent_archived_changes on public.crm_projects;
create trigger crm_projects_prevent_archived_changes
  before update on public.crm_projects
  for each row execute function public.crm_projects_prevent_archived_changes();

create or replace function public.crm_reopen_project(
  p_project_id uuid,
  p_expected_updated_at timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project public.crm_projects%rowtype;
  v_actor text;
  v_updated_at timestamptz;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  select * into v_project
  from public.crm_projects
  where id = p_project_id and deleted_at is null
  for update;

  if v_project.id is null then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if date_trunc('milliseconds', v_project.updated_at)
     <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Project changed in another session' using errcode = '40001';
  end if;
  if v_project.status <> 'launched' then
    raise exception 'Only closed projects can be reopened' using errcode = '22023';
  end if;

  v_actor := lower(coalesce(nullif(auth.jwt() ->> 'email', ''), 'system'));
  perform set_config('app.crm_project_lifecycle', 'reopen', true);

  update public.invoices
  set status = 'issued',
      finance_transaction_id = null,
      paid_on = null
  where project_id = p_project_id
    and status = 'paid'
    and finance_transaction_id in (
      select id from public.finance_transactions
      where project_id = p_project_id and source = 'project_close'
    );

  delete from public.finance_transactions
  where project_id = p_project_id
    and source = 'project_close';

  update public.crm_projects
  set status = 'review',
      updated_at = now()
  where id = p_project_id
  returning updated_at into v_updated_at;

  if v_project.originating_lead_id is not null then
    insert into public.lead_events (lead_id, author, kind, body, meta)
    values (
      v_project.originating_lead_id,
      v_actor,
      'note',
      'Project reopened in Review; automatic close revenue reversed',
      jsonb_build_object('project_id', p_project_id, 'project_status', 'review', 'finance_reversed', true)
    );
  end if;

  return v_updated_at;
end;
$$;

create or replace function public.crm_archive_project(
  p_project_id uuid,
  p_expected_updated_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project public.crm_projects%rowtype;
  v_actor text;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  select * into v_project
  from public.crm_projects
  where id = p_project_id
  for update;

  if v_project.id is null then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if v_project.deleted_at is not null then
    return;
  end if;
  if date_trunc('milliseconds', v_project.updated_at)
     <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Project changed in another session' using errcode = '40001';
  end if;

  v_actor := lower(coalesce(nullif(auth.jwt() ->> 'email', ''), 'system'));
  perform set_config('app.crm_project_lifecycle', 'archive', true);

  update public.invoices
  set status = 'void',
      finance_transaction_id = null,
      paid_on = null
  where project_id = p_project_id
    and status = 'paid'
    and finance_transaction_id in (
      select id from public.finance_transactions
      where project_id = p_project_id and source = 'project_close'
    );

  update public.invoices
  set status = 'void'
  where project_id = p_project_id
    and status = 'issued';

  delete from public.finance_transactions
  where project_id = p_project_id
    and source = 'project_close';

  update public.project_work_items
  set status = 'skipped',
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
  where project_id = p_project_id
    and status not in ('done', 'skipped');

  update public.crm_projects
  set deleted_at = now(),
      deleted_by = v_actor,
      updated_at = now()
  where id = p_project_id;

  update public.attention_items
  set status = 'completed',
      completed_at = now()
  where status <> 'completed'
    and source_type = 'project'
    and (
      source_id = p_project_id
      or source_id in (
        select id from public.project_work_items where project_id = p_project_id
      )
    );

  if v_project.originating_lead_id is not null then
    insert into public.lead_events (lead_id, author, kind, body, meta)
    values (
      v_project.originating_lead_id,
      v_actor,
      'note',
      'Project archived; automatic close revenue removed',
      jsonb_build_object('project_id', p_project_id, 'project_archived', true, 'finance_reversed', true)
    );
  end if;
end;
$$;

revoke all on function public.crm_reopen_project(uuid, timestamptz) from public, anon;
revoke all on function public.crm_archive_project(uuid, timestamptz) from public, anon;
grant execute on function public.crm_reopen_project(uuid, timestamptz) to authenticated;
grant execute on function public.crm_archive_project(uuid, timestamptz) to authenticated;

commit;
