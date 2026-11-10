import { NextResponse } from 'next/server';
import { createCalBookingLead, type CalWebhookPayload } from '@/lib/cal-webhook';
import { saveLead } from '@/lib/leads';

export const runtime = 'nodejs';

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

/** Cal.com signs the raw body with HMAC-SHA256 and sends the hex digest in x-cal-signature-256. */
async function verifySignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return timingSafeEqual(expected, signature.trim().toLowerCase());
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Cal.com webhook received but CAL_WEBHOOK_SECRET is unset.');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const body = await request.text();
  if (!(await verifySignature(body, request.headers.get('x-cal-signature-256'), secret))) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let event: CalWebhookPayload;
  try {
    event = JSON.parse(body) as CalWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (event.triggerEvent !== 'BOOKING_CREATED') return NextResponse.json({ ignored: true });

  const lead = createCalBookingLead(event);
  if (!lead) {
    console.error('Cal.com booking missing attendee name or email; skipped lead creation.');
    return NextResponse.json({ ignored: true, reason: 'incomplete_attendee' });
  }

  const result = await saveLead(lead);
  if (!result.stored) {
    console.error('Cal.com booking could not be stored.', result.reason);
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  return NextResponse.json({ stored: true, id: result.id });
}
