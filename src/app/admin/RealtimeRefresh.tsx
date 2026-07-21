'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function RealtimeRefresh({ tables = ['leads'] }: { tables?: string[] }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 250);
    };

    const channel = supabase.channel(`crm-${tables.join('-')}`);
    for (const table of tables) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        refresh,
      );
    }
    channel.subscribe();

    // Polling is a fallback until every deployment has the tables enabled
    // in the Supabase Realtime publication.
    const poll = setInterval(() => router.refresh(), 60_000);

    return () => {
      clearTimeout(refreshTimer);
      clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [router, tables]);

  return null;
}
