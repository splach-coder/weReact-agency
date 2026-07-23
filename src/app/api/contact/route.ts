import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { buildContactConfirmationEmail, buildContactEmail, type ContactSubmission, validateContactSubmission } from '@/lib/contact';
import { createLeadRecord, saveLead } from '@/lib/leads';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com/emails';

const GENERIC_ERROR = {
  en: 'Unable to send your message right now.',
  fr: 'Impossible d’envoyer votre message pour le moment.',
} as const;

const RATE_LIMIT_ERROR = {
  en: 'Too many messages from your connection. Please try again in a few minutes.',
  fr: 'Trop de messages depuis votre connexion. Merci de réessayer dans quelques minutes.',
} as const;

// Best-effort per-warm-instance rate limit (no external store). Morocco
// mobile networks share IPs via CGNAT, so the threshold stays generous and
// the check fails open when no client IP is available.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const submissionTimestamps = new Map<string, number[]>();

function isRateLimited(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!ip) return false;

  const now = Date.now();
  const recent = (submissionTimestamps.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  if (submissionTimestamps.size > 5000) submissionTimestamps.clear();
  submissionTimestamps.set(ip, recent);
  return false;
}

async function sendEmail(payload: Record<string, unknown>, apiKey: string) {
  // Wrapped + bounded: a Resend outage or hung socket must degrade, never
  // crash the route or hold the visitor on "Sending..." indefinitely.
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error('Resend email failed.', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Resend email threw.', error);
    return false;
  }
}

export async function POST(request: Request) {
  let submission: ContactSubmission;

  try {
    submission = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const locale = submission.locale === 'fr' ? 'fr' : 'en';

  if (submission.website) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(request)) {
    return NextResponse.json({ error: RATE_LIMIT_ERROR[locale] }, { status: 429 });
  }

  const validation = validateContactSubmission(submission);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) console.error('RESEND_API_KEY is not configured.');

  const lead = createLeadRecord(submission);
  const from = process.env.RESEND_FROM_EMAIL ?? 'WeReact <hello@wereact.agency>';
  const enquiry = buildContactEmail(submission);

  // Critical path: the durable record and the owner notification, in
  // parallel. Email is one sink of several — a lead that reached storage
  // must read as success to the visitor so the Ads conversion still fires.
  const [leadResult, ownerNotified] = await Promise.all([
    saveLead(lead),
    apiKey
      ? sendEmail(
          {
            from,
            to: [process.env.CONTACT_RECIPIENT_EMAIL ?? 'anasbenbow123@gmail.com'],
            subject: enquiry.subject,
            html: enquiry.html,
            reply_to: enquiry.replyTo,
          },
          apiKey
        )
      : Promise.resolve(false),
  ]);

  if (!leadResult.stored && !ownerNotified) {
    console.error('Contact submission failed on every critical sink.', { leadResult });
    return NextResponse.json({ error: GENERIC_ERROR[locale] }, { status: 500 });
  }

  // Client confirmation runs after the response and never gates the visitor's success state.
  after(async () => {
    if (apiKey) {
      const confirmation = buildContactConfirmationEmail(submission);
      await sendEmail(
        {
          from,
          to: [submission.email.trim()],
          subject: confirmation.subject,
          html: confirmation.html,
          reply_to: confirmation.replyTo,
        },
        apiKey
      );
    }
  });

  return NextResponse.json({ ok: true, leadStored: leadResult.stored, ownerNotified });
}
