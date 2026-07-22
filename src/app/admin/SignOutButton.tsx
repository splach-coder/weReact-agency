'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className={compact ? 'crm-sign-out ops-mobile-sign-out' : 'crm-sign-out'}
      title="Sign out of the CRM"
      aria-label="Sign out of the CRM"
    >
      <LogOut size={16} aria-hidden="true" />
      <span>Sign out</span>
    </button>
  );
}