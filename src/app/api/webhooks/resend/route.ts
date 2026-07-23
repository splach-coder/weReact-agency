import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import type { CommunicationState } from '@/lib/automation';
import {
  getResendWebhookHeaders,
  parseResendWebhook,
  shouldAdvanceCommunicationState,
  type NormalizedResendEvent,
} from '@/lib/resend-webhook';

export const runtime = 'nodejs';

type StoredCommunication = {
  id: string;
  state: CommunicationState;
  lead_id: string | null;
};

function createServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function updateIntegrationHealth(
  supabase: SupabaseClient,
  status: 'healthy' | 'degraded',
  message: string,
) {
  const now = new Date().toISOString();
  const base = {
    provider: 'resend',
    status,
    message: message.slice(0, 1000),
    last_checked_at: now,
  };

  const { error } = await supabase
    .from('integration_health')
    .upsert(
      status === 'healthy'
        ? { ...base, last_success_at: now }
        : { ...base, last_failure_at: now },
      { onConflict: 'provider' },
    );
  if (error) console.error('Could not update Resend integration health.', error.message);
}

function stateTimestamps(event: NormalizedResendEvent) {
  switch (event.state) {
    case 'sent':
      return { sent_at: event.occurredAt };
    case 'delivered':
      return { delivered_at: event.occurredAt };
    case 'opened':
      return { opened_at: event.occurredAt };
    case 'clicked':
      return { clicked_at: event.occurredAt };
    case 'bounced':
    case 'complained':
    case 'failed':
      return { failed_at: event.occurredAt };
    default:
      return {};
  }
}

async function recordFailureAttention(
  supabase: SupabaseClient,
  communication: StoredCommunication,
  event: NormalizedResendEvent,
) {
  const sourceHref = communication.lead_id
    ? `/admin/leads/${communication.lead_id}`
    : '/admin/automation';
  const recipient = event.to || 'the recipient';

  const { error } = await supabase.from('attention_items').upsert({
    kind: 'email_bounced',
    priority: event.state === 'complained' ? 'urgent' : 'high',
    status: 'open',
    title: `Email to ${recipient} ${event.state}`,
    detail: event.subject
      ? `Resend reported "${event.state}" for ${event.subject}.`
      : `Resend reported an email as ${event.state}.`,
    source_type: 'communication',
    source_id: communication.id,
    source_href: sourceHref,
    action_label: communication.lead_id ? 'Open client' : 'Review automation',
    idempotency_key: `communication:failure:${communication.id}`,
    completed_at: null,
  }, { onConflict: 'idempotency_key' });

  if (error) throw new Error(`Could not create email failure alert: ${error.message}`);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RESEND_WEBHOOK_SECRET is not configured.');
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 503 });
  }

  const signatureHeaders = getResendWebhookHeaders(request.headers);
  if (!signatureHeaders.valid) {
    return NextResponse.json({ error: signatureHeaders.error }, { status: 400 });
  }

  const rawBody = await request.text();
  let verifiedPayload: unknown;

  try {
    verifiedPayload = new Webhook(webhookSecret).verify(rawBody, {
      'svix-id': signatureHeaders.value.id,
      'svix-timestamp': signatureHeaders.value.timestamp,
      'svix-signature': signatureHeaders.value.signature,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  const parsed = parseResendWebhook(verifiedPayload, signatureHeaders.value.id);
  if (!parsed.valid) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  if (!parsed.value) return NextResponse.json({ ok: true, ignored: true });

  const event = parsed.value;
  const supabase = createServiceClient();
  if (!supabase) {
    console.error('Supabase service credentials are not configured.');
    return NextResponse.json({ error: 'Webhook storage is not configured.' }, { status: 503 });
  }

  try {
    const { data, error: communicationError } = await supabase
      .from('communications')
      .select('id,state,lead_id')
      .eq('provider', event.provider)
      .eq('provider_message_id', event.messageId)
      .maybeSingle();

    if (communicationError) throw new Error(`Could not find communication: ${communicationError.message}`);
    const communication = data as StoredCommunication | null;

    const { error: eventError } = await supabase.from('communication_events').upsert({
      communication_id: communication?.id ?? null,
      provider: event.provider,
      provider_event_id: event.providerEventId,
      event_type: event.eventType,
      occurred_at: event.occurredAt,
      payload: event.payload,
    }, {
      onConflict: 'provider,provider_event_id',
      ignoreDuplicates: true,
    });
    if (eventError) throw new Error(`Could not store communication event: ${eventError.message}`);

    if (communication && shouldAdvanceCommunicationState(communication.state, event.state)) {
      const { error: updateError } = await supabase
        .from('communications')
        .update({ state: event.state, ...stateTimestamps(event) })
        .eq('id', communication.id);
      if (updateError) throw new Error(`Could not update communication: ${updateError.message}`);
    }

    if (
      communication
      && ['bounced', 'complained', 'failed'].includes(event.state)
    ) {
      await recordFailureAttention(supabase, communication, event);
    }

    await updateIntegrationHealth(supabase, 'healthy', `Verified ${event.eventType} event received.`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook processing error.';
    console.error('Resend webhook processing failed.', message);
    await updateIntegrationHealth(supabase, 'degraded', 'A verified Resend event could not be processed.');
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
