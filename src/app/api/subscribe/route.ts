import { NextResponse } from 'next/server';
import { validateSubscriberEmail } from '@/lib/newsletter';
import { buildSubscriberRecord, storeSubscriber } from '@/lib/newsletter-store';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com';

async function resendRequest(path: string, init: RequestInit, apiKey: string) {
  return fetch(`${RESEND_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

export async function POST(request: Request) {
  let body: { email?: string; website?: string; locale?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim() ?? '';
  const validation = validateSubscriberEmail(email);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const locale = body.locale?.trim()
    || request.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
    || 'en';
  const record = buildSubscriberRecord(email, locale, 'footer', new Date().toISOString());
  const storage = await storeSubscriber(record);
  if (!storage.stored) {
    console.error('Newsletter subscription could not be stored.', storage.reason);
    return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!apiKey || !segmentId) {
    console.error('Resend newsletter configuration is incomplete.');
    return NextResponse.json({ error: 'Subscription saved. Please retry shortly.' }, { status: 502 });
  }

  const contactResponse = await resendRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify({ email: record.email, unsubscribed: false }),
  }, apiKey);

  if (!contactResponse.ok && contactResponse.status !== 409) {
    console.error('Resend newsletter contact failed.', await contactResponse.text());
    return NextResponse.json({ error: 'Subscription saved. Please retry shortly.' }, { status: 502 });
  }

  const segmentResponse = await resendRequest(`/contacts/${encodeURIComponent(record.email)}/segments/${segmentId}`, {
    method: 'POST',
  }, apiKey);

  if (!segmentResponse.ok && segmentResponse.status !== 409) {
    console.error('Resend newsletter segment failed.', await segmentResponse.text());
    return NextResponse.json({ error: 'Subscription saved. Please retry shortly.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
