import { NextResponse } from 'next/server';
import { buildContactEmail, type ContactSubmission, validateContactSubmission } from '@/lib/contact';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com/emails';

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

  const email = buildContactEmail(submission);
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'WeReact <onboarding@resend.dev>',
      to: [process.env.CONTACT_RECIPIENT_EMAIL ?? 'anasbenbow123@gmail.com'],
      subject: email.subject,
      html: email.html,
      reply_to: email.replyTo,
    }),
  });

  if (!response.ok) {
    console.error('Resend contact email failed.', await response.text());
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
