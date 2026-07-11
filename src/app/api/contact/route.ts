import { NextResponse } from 'next/server';
import { buildContactConfirmationEmail, buildContactEmail, type ContactSubmission, validateContactSubmission } from '@/lib/contact';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com/emails';

async function sendEmail(payload: Record<string, unknown>, apiKey: string) {
  return fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  let submission: ContactSubmission;

  try {
    submission = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (submission.website) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateContactSubmission(submission);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.');
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 500 });
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'WeReact <onboarding@resend.dev>';
  const enquiry = buildContactEmail(submission);
  const ownerResponse = await sendEmail({
    from,
    to: [process.env.CONTACT_RECIPIENT_EMAIL ?? 'anasbenbow123@gmail.com'],
    subject: enquiry.subject,
    html: enquiry.html,
    reply_to: enquiry.replyTo,
  }, apiKey);

  if (!ownerResponse.ok) {
    console.error('Resend contact email failed.', await ownerResponse.text());
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 502 });
  }

  const confirmation = buildContactConfirmationEmail(submission);
  const confirmationResponse = await sendEmail({
    from,
    to: [submission.email.trim()],
    subject: confirmation.subject,
    html: confirmation.html,
  }, apiKey);

  if (!confirmationResponse.ok) {
    console.error('Resend contact confirmation failed.', await confirmationResponse.text());
  }

  return NextResponse.json({ ok: true });
}