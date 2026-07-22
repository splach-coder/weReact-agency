create or replace function public.crm_move_project(
  p_project_id uuid,
  p_status text,
  p_expected_updated_at timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated_at timestamptz;
begin
  if not public.is_team_member() then
    raise exception 'CRM access denied' using errcode = '42501';
  end if;

  if p_status not in ('ready_for_dev', 'building', 'review') then
    raise exception 'Invalid delivery stage' using errcode = '22023';
  end if;

  select updated_at into v_updated_at
  from public.crm_projects
  where id = p_project_id
  for update;

  if v_updated_at is null then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;

  if date_trunc('milliseconds', v_updated_at)
     <> date_trunc('milliseconds', p_expected_updated_at) then
    raise exception 'Project changed in another session' using errcode = '40001';
  end if;

  update public.crm_projects
  set status = p_status,
      updated_at = now()
  where id = p_project_id
  returning updated_at into v_updated_at;

  return v_updated_at;
end;
$$;

revoke all on function public.crm_move_project(uuid, text, timestamptz) from public, anon;
grant execute on function public.crm_move_project(uuid, text, timestamptz) to authenticated;
