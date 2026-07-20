'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-black tracking-tight text-[#3a5a40]">&middot;wereact&middot;</p>
        <h1 className="mt-4 text-xl font-semibold">CRM sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">We&apos;ll email you a secure sign-in link.</p>

        {status === 'sent' ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            Check <strong>{email}</strong> for your sign-in link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@wereact.agency"
              className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-[#3a5a40]"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-lg bg-[#3a5a40] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2e4833] disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
            {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}
        <p className="mt-6 text-xs text-neutral-400">Access is limited to WeReact team members.</p>
      </div>
    </main>
  );
}
