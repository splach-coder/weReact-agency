import 'server-only';

const RESEND_EMAIL_URL = 'https://api.resend.com/emails';

export type ResendEmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
  headers?: Record<string, string>;
};

export type ResendSendResult =
  | { sent: true; providerMessageId: string }
  | { sent: false; error: 'rejected' | 'network_error' | 'invalid_response' };

export async function sendResendEmail(
  payload: ResendEmailPayload,
  apiKey: string,
  timeoutMs = 10_000,
): Promise<ResendSendResult> {
  try {
    const response = await fetch(RESEND_EMAIL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      console.error('Resend email failed.', response.status, await response.text());
      return { sent: false, error: 'rejected' };
    }

    const data = await response.json() as { id?: unknown };
    const providerMessageId = typeof data.id === 'string' ? data.id.trim() : '';
    if (!providerMessageId) {
      console.error('Resend accepted an email without returning a message id.');
      return { sent: false, error: 'invalid_response' };
    }

    return { sent: true, providerMessageId };
  } catch (error) {
    console.error('Resend email threw.', error);
    return { sent: false, error: 'network_error' };
  }
}
