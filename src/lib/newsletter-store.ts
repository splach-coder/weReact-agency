import { createClient } from '@supabase/supabase-js';

export type SubscriberRecord = {
  email: string;
  locale: string;
  source: string;
  status: 'subscribed';
  consented_at: string;
};

export function buildSubscriberRecord(
  email: string,
  locale: string,
  source: string,
  now: string,
): SubscriberRecord {
  return {
    email: email.trim().toLowerCase(),
    locale: locale.trim().toLowerCase().startsWith('fr') ? 'fr' : 'en',
    source: source.trim().slice(0, 80) || 'website',
    status: 'subscribed',
    consented_at: now,
  };
}

export async function storeSubscriber(record: SubscriberRecord) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return { stored: false as const, reason: 'not_configured' as const };

  try {
    const supabase = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(record, { onConflict: 'email' });

    if (error) {
      console.error('Supabase newsletter storage failed.', error.message);
      return { stored: false as const, reason: 'storage_failed' as const };
    }
  } catch (error) {
    console.error('Supabase newsletter storage threw.', error);
    return { stored: false as const, reason: 'storage_failed' as const };
  }

  return { stored: true as const };
}
