begin;

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
  if coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
     and not public.is_team_member() then
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

create or replace function public.automation_claim_events(p_limit integer default 10)
returns setof public.automation_events
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'Automation service access denied' using errcode = '42501';
  end if;

  return query
  with candidates as (
    select event.id
    from public.automation_events event
    where event.status in ('pending', 'retry')
      and event.next_attempt_at <= now()
    order by event.next_attempt_at, event.created_at
    for update skip locked
    limit least(greatest(p_limit, 1), 25)
  )
  update public.automation_events event
  set status = 'processing',
      attempts = event.attempts + 1,
      locked_at = now(),
      completed_at = null
  from candidates
  where event.id = candidates.id
  returning event.*;
end;
$$;

revoke all on function public.automation_claim_events(integer) from public, anon, authenticated;
grant execute on function public.automation_claim_events(integer) to service_role;
commit;
