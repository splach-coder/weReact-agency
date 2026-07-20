import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SignOutButton } from './SignOutButton';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // Authorization: only allowlisted team members (RLS returns their row only).
  const { data: member } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();

  if (!member) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-neutral-500">
            <strong>{user.email}</strong> isn&apos;t on the WeReact team allowlist. Ask the owner to add you.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </main>
    );
  }

  const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-lg font-black tracking-tight text-[#3a5a40]">&middot;wereact&middot; CRM</p>
          <p className="mt-1 text-sm text-neutral-500">
            Signed in as {member.name ?? member.email} ({member.role})
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">Total leads</p>
        <p className="mt-1 text-4xl font-bold">{count ?? 0}</p>
        <p className="mt-4 text-sm text-neutral-400">
          Foundation is live — auth, team allowlist, and data access all work. The pipeline board,
          lead detail, notes, and realtime land in Phase 2.
        </p>
      </section>
    </main>
  );
}
