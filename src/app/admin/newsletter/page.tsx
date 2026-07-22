import { requireAdminMember } from '@/lib/admin-auth';
import type { NewsletterCampaign, NewsletterSubscriber } from '@/lib/operations';
import { AdminShell } from '../AdminShell';
import { NewsletterWorkspace } from './NewsletterWorkspace';
import { RealtimeRefresh } from '../RealtimeRefresh';

export const dynamic = 'force-dynamic';

export default async function NewsletterPage() {
  const { supabase, member } = await requireAdminMember();
  const [subscriberResult, campaignResult] = await Promise.all([
    supabase.from('newsletter_subscribers').select('email,status,locale,source,consented_at,created_at,updated_at,unsubscribe_token').order('created_at', { ascending: false }),
    supabase.from('newsletter_campaigns').select('id,created_at,sent_at,created_by,subject,preview_text,content,audience_count,sent_count,failed_count,status').order('created_at', { ascending: false }).limit(25),
  ]);
  if (subscriberResult.error) console.error('Newsletter audience query failed.', subscriberResult.error);
  if (campaignResult.error && campaignResult.error.code !== '42P01') console.error('Newsletter campaign query failed.', campaignResult.error);
  return <AdminShell member={member}><NewsletterWorkspace subscribers={(subscriberResult.data ?? []) as NewsletterSubscriber[]} campaigns={(campaignResult.data ?? []) as NewsletterCampaign[]} /><RealtimeRefresh tables={['newsletter_subscribers', 'newsletter_campaigns']} /></AdminShell>;
}
