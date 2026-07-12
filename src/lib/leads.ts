import type { ContactSubmission } from '@/lib/contact';

export type LeadAttribution = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  landing_page: string;
  referrer: string;
  captured_at: string;
}>;

export type LeadRecord = {
  name: string;
  email: string;
  company: string | null;
  phone: string;
  whatsapp: string | null;
  message: string;
  status: 'new';
  source: 'website_contact_form';
  attribution: LeadAttribution;
};

export function createLeadRecord(input: ContactSubmission, attribution: LeadAttribution = {}): LeadRecord {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company?.trim() || null,
    phone: input.phone.trim(),
    whatsapp: input.whatsapp?.trim() || null,
    message: input.message.trim(),
    status: 'new',
    source: 'website_contact_form',
    attribution,
  };
}

export async function saveLead(record: LeadRecord) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return { stored: false, reason: 'not_configured' as const };

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Supabase lead storage failed.', detail);
    return { stored: false, reason: 'storage_failed' as const };
  }

  return { stored: true as const };
}
