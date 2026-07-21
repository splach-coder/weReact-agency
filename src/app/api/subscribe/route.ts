import { NextResponse } from 'next/server';
import { validateSubscriberEmail } from '@/lib/newsletter';
import { buildSubscriberRecord, storeSubscriber } from '@/lib/newsletter-store';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com';
const SUBSCRIBE_WINDOW_MS = 60 * 60 * 1000;
const SUBSCRIBE_LIMIT = 5;
const subscribeAttempts = new Map<string, { count: number; resetAt: number }>();

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const hostname = new URL(origin).hostname;
    return hostname === 'localhost' || hostname === 'wereact.agency' || hostname === 'www.wereact.agency'
      || hostname === 'wereact-agency.wereact.workers.dev';
  } catch {
    return false;
  }
}

function isRateLimited(request: Request, now = Date.now()) {
  const key = request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'local';
  const current = subscribeAttempts.get(key);
  if (!current || current.resetAt <= now) {
    subscribeAttempts.set(key, { count: 1, resetAt: now + SUBSCRIBE_WINDOW_MS });
    return false;
  }
  if (current.count >= SUBSCRIBE_LIMIT) return true;
  current.count += 1;
  if (subscribeAttempts.size > 5000) {
    for (const [ip, attempt] of subscribeAttempts) if (attempt.resetAt <= now) subscribeAttempts.delete(ip);
  }
  return false;
}

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
  if (!isAllowedOrigin(request)) return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
  if (isRateLimited(request)) return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });

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
