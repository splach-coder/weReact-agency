begin;

-- Supabase's app_metadata.provider records the account's first provider, not
-- necessarily the provider used by a later linked OAuth login. Requiring an
-- exclusively Google identity set makes the OAuth AMR check provider-specific.
create or replace function public.is_team_member()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1
      from public.team_members tm
      where lower(tm.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    and exists (
      select 1
      from auth.identities identity
      where identity.user_id = auth.uid()
        and identity.provider = 'google'
    )
    and not exists (
      select 1
      from auth.identities identity
      where identity.user_id = auth.uid()
        and identity.provider <> 'google'
    )
    and exists (
      select 1
      from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) item
      where item ->> 'method' = 'oauth'
    );
$$;

revoke all on function public.is_team_member() from public;
grant execute on function public.is_team_member() to authenticated;

commit;