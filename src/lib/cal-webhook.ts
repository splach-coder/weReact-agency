import type { LeadAttribution, LeadRecord } from '@/lib/leads';

type CalResponseValue = unknown;

export type CalWebhookPayload = {
  triggerEvent?: string;
  payload?: {
    title?: unknown;
    startTime?: unknown;
    location?: unknown;
    rescheduleUrl?: unknown;
    attendees?: Array<{ name?: unknown; email?: unknown; timeZone?: unknown }>;
    responses?: Record<string, CalResponseValue>;
    videoCallData?: { url?: unknown };
    tracking?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  };
};

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** Cal.com booking answers arrive either as plain values or as `{ label, value }` objects. */
function responseText(response: CalResponseValue) {
  if (response && typeof response === 'object' && 'value' in response) {
    const value = (response as { value: unknown }).value;
    return Array.isArray(value) ? value.map(text).filter(Boolean).join(', ') : text(value);
  }
  return text(response);
}

// Answers already represented elsewhere in the lead (or handled explicitly below).
const STANDARD_RESPONSE_KEYS = new Set(['name', 'email', 'guests', 'location', 'title', 'notes']);

function formatScheduledTime(startTime: string) {
  const date = new Date(startTime);
  return Number.isNaN(date.getTime()) ? startTime : `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

function formatBookingMessage(event: CalWebhookPayload) {
  const payload = event.payload ?? {};
  const lines = ['Booked a call via Cal.com.'];

  const title = text(payload.title);
  if (title) lines.push(`Event: ${title}`);

  const startTime = text(payload.startTime);
  if (startTime) lines.push(`Scheduled: ${formatScheduledTime(startTime)}`);

  const attendee = payload.attendees?.[0];
  const timeZone = text(attendee?.timeZone);
  if (timeZone) lines.push(`Invitee timezone: ${timeZone}`);

  const location = text(payload.videoCallData?.url) || text(payload.location);
  if (location) lines.push(`Location: ${location}`);

  const notes = responseText(payload.responses?.notes);
  if (notes) lines.push(`Notes: ${notes}`);

  for (const [key, response] of Object.entries(payload.responses ?? {})) {
    if (STANDARD_RESPONSE_KEYS.has(key)) continue;
    const value = responseText(response);
    if (!value) continue;
    const label =
      (response && typeof response === 'object' && 'label' in response && text((response as { label: unknown }).label)) || key;
    lines.push(`${label}: ${value}`);
  }

  const rescheduleUrl = text(payload.rescheduleUrl);
  if (rescheduleUrl) lines.push(`Reschedule: ${rescheduleUrl}`);

  return lines.join('\n');
}

/** UTM values forwarded through the embed config come back under `tracking` or `metadata`. */
function bookingAttribution(event: CalWebhookPayload): LeadAttribution {
  const payload = event.payload ?? {};
  const sources = [payload.tracking ?? {}, payload.metadata ?? {}];
  const attribution: LeadAttribution = { source_page: 'cal_booking' };

  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
    for (const source of sources) {
      const value = text(source[key]);
      if (value && !attribution[key]) attribution[key] = value;
    }
  }

  // The embed stores a Google click id as utm_content=gclid_<id> when no utm_content exists.
  const content = attribution.utm_content;
  if (content?.startsWith('gclid_')) attribution.gclid = content.slice(6);

  return attribution;
}

/** Maps a Cal.com BOOKING_CREATED event to a CRM lead, or null when the attendee is incomplete. */
export function createCalBookingLead(event: CalWebhookPayload): LeadRecord | null {
  const attendee = event.payload?.attendees?.[0];
  const name = text(attendee?.name) || responseText(event.payload?.responses?.name);
  const email = text(attendee?.email) || responseText(event.payload?.responses?.email);

  if (!name || !email) return null;

  return {
    name,
    email,
    company: null,
    phone: '',
    whatsapp: null,
    message: formatBookingMessage(event),
    status: 'new',
    source: 'cal_booking',
    attribution: bookingAttribution(event),
  };
}
