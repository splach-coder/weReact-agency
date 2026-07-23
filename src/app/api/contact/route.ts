import { after, NextResponse } from 'next/server';
import { buildContactConfirmationEmail, buildContactEmail, type ContactSubmission, validateContactSubmission } from '@/lib/contact';
import { recordOutboundCommunication } from '@/lib/communications-store';
import { createLeadRecord, saveLead } from '@/lib/leads';
import { sendResendEmail } from '@/lib/resend';

export const runtime = 'nodejs';

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
  const recent = (submissionTimestamps.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  if (submissionTimestamps.size > 5000) submissionTimestamps.clear();
  submissionTimestamps.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  let submission: ContactSubmission;

  try {
    submission = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const locale = submission.locale === 'fr' ? 'fr' : 'en';
  if (submission.website) return NextResponse.json({ ok: true });
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
  const ownerRecipient = process.env.CONTACT_RECIPIENT_EMAIL ?? 'anasbenbow123@gmail.com';
  const enquiry = buildContactEmail(submission);

  // Storage and owner notification remain independent so one provider outage
  // never loses an otherwise valid enquiry.
  const [leadResult, ownerDelivery] = await Promise.all([
    saveLead(lead),
    apiKey
      ? sendResendEmail({
          from,
          to: [ownerRecipient],
          subject: enquiry.subject,
          html: enquiry.html,
          reply_to: enquiry.replyTo,
        }, apiKey, 8000)
      : Promise.resolve({ sent: false as const, error: 'network_error' as const }),
  ]);

  if (!leadResult.stored && !ownerDelivery.sent) {
    console.error('Contact submission failed on every critical sink.', { leadResult });
    return NextResponse.json({ error: GENERIC_ERROR[locale] }, { status: 500 });
  }

  if (ownerDelivery.sent) {
    await recordOutboundCommunication({
      providerMessageId: ownerDelivery.providerMessageId,
      from,
      to: ownerRecipient,
      subject: enquiry.subject,
      body_summary: 'New website enquiry notification',
      lead_id: leadResult.stored ? leadResult.id : null,
    });
  }

  // Client confirmation runs after the response and never gates the visitor's success state.
  after(async () => {
    if (!apiKey) return;
    const confirmation = buildContactConfirmationEmail(submission);
    const delivery = await sendResendEmail({
      from,
      to: [submission.email.trim()],
      subject: confirmation.subject,
      html: confirmation.html,
      reply_to: confirmation.replyTo,
    }, apiKey);

    if (delivery.sent) {
      await recordOutboundCommunication({
        providerMessageId: delivery.providerMessageId,
        from,
        to: submission.email.trim(),
        subject: confirmation.subject,
        body_summary: 'Website enquiry confirmation',
        lead_id: leadResult.stored ? leadResult.id : null,
      });
    }
  });

  return NextResponse.json({
    ok: true,
    leadStored: leadResult.stored,
    ownerNotified: ownerDelivery.sent,
  });
}
