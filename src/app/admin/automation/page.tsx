import { requireAdminMember } from '@/lib/admin-auth';
import type { IntegrationHealth } from '@/lib/automation';
import { AdminShell } from '../AdminShell';
import { RealtimeRefresh } from '../RealtimeRefresh';
import { AutomationWorkspace, type AutomationEventSummary, type AutomationMetrics } from './AutomationWorkspace';

export const dynamic = 'force-dynamic';

export default async function AutomationPage() {
  const { supabase, member } = await requireAdminMember();
  const [
    integrationResult,
    eventResult,
    queueResult,
    runningResult,
    failedResult,
    emailSentResult,
    emailDeliveredResult,
    emailEngagedResult,
    emailFailedResult,
  ] = await Promise.all([
    supabase.from('integration_health').select('provider,status,message,last_success_at,last_failure_at,last_checked_at,updated_at').order('provider'),
    supabase.from('automation_events').select('id,event_type,aggregate_type,aggregate_id,idempotency_key,status,attempts,max_attempts,next_attempt_at,locked_at,completed_at,created_at,updated_at').order('created_at', { ascending: false }).limit(40),
    supabase.from('automation_events').select('id', { count: 'exact', head: true }).in('status', ['pending', 'retry']),
    supabase.from('automation_events').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('automation_events').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('communications').select('id', { count: 'exact', head: true }).eq('channel', 'email').eq('direction', 'outbound').not('state', 'in', '(draft,queued)'),
    supabase.from('communications').select('id', { count: 'exact', head: true }).eq('channel', 'email').eq('direction', 'outbound').in('state', ['delivered', 'opened', 'clicked', 'replied']),
    supabase.from('communications').select('id', { count: 'exact', head: true }).eq('channel', 'email').eq('direction', 'outbound').in('state', ['opened', 'clicked', 'replied']),
    supabase.from('communications').select('id', { count: 'exact', head: true }).eq('channel', 'email').eq('direction', 'outbound').in('state', ['bounced', 'complained', 'failed']),
  ]);

  if (integrationResult.error || eventResult.error) {
    console.error('Automation workspace query failed.', {
      integrations: integrationResult.error,
      events: eventResult.error,
    });
  }

  const sent = emailSentResult.count ?? 0;
  const delivered = emailDeliveredResult.count ?? 0;
  const metrics: AutomationMetrics = {
    queued: queueResult.count ?? 0,
    running: runningResult.count ?? 0,
    failed: failedResult.count ?? 0,
    emailSent: sent,
    emailDeliveryRate: sent ? Math.round((delivered / sent) * 100) : 0,
    emailEngaged: emailEngagedResult.count ?? 0,
    emailFailed: emailFailedResult.count ?? 0,
  };

  return (
    <AdminShell member={member}>
      <AutomationWorkspace
        integrations={(integrationResult.data ?? []) as IntegrationHealth[]}
        events={(eventResult.data ?? []) as AutomationEventSummary[]}
        metrics={metrics}
      />
      <RealtimeRefresh tables={['automation_events', 'integration_health', 'communications']} />
    </AdminShell>
  );
}
