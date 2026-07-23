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
  fbclid: string;
  landing_page: string;
  referrer: string;
  captured_at: string;
  transaction_id: string;
  source_page: string;
}>;

const ATTRIBUTION_KEYS: (keyof LeadAttribution)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'landing_page',
  'referrer',
  'captured_at',
  'transaction_id',
  'source_page',
];

const ATTRIBUTION_VALUE_MAX_LENGTH = 512;

// Single choke point for client-supplied attribution: only known keys, only
// strings, bounded length. Protects Supabase and email rendering,
// and normalizes the `attribution: null` a direct visitor sends (a default
// parameter would only cover undefined).
export function sanitizeAttribution(attribution: unknown): LeadAttribution {
  if (!attribution || typeof attribution !== 'object') return {};

  const clean: LeadAttribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = (attribution as Record<string, unknown>)[key];
    if (key === 'source_page') {
      const sourcePage = getAllowedSourcePage(value);
      if (sourcePage) clean.source_page = sourcePage;
      continue;
    }
    if (typeof value === 'string' && value.length > 0) {
      clean[key] = value.slice(0, ATTRIBUTION_VALUE_MAX_LENGTH);
    }
  }
  return clean;
}

const ALLOWED_SOURCE_PAGES = new Set([
  'web-design-marrakech',
  'tourism-websites-morocco',
  'seo-landing-pages',
  'agence-web-marrakech',
  'website-design-moroccan-businesses',
  'international-web-design-agency',
]);

export function getAllowedSourcePage(value: unknown) {
  return typeof value === 'string' && ALLOWED_SOURCE_PAGES.has(value) ? value : undefined;
}

function formatLeadMessage(input: ContactSubmission) {
  const qualification = [
    input.projectType ? `Project type: ${input.projectType}` : '',
    input.budget ? `Budget: ${input.budget}` : '',
    input.timeline ? `Timeline: ${input.timeline}` : '',
  ].filter(Boolean);
  const message = input.message?.trim() ?? '';

  return [qualification.join('\n'), message].filter(Boolean).join('\n\n');
}

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

export function createLeadRecord(input: ContactSubmission, attribution: unknown = input.attribution): LeadRecord {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company?.trim() || null,
    phone: input.phone?.trim() ?? '',
    whatsapp: input.whatsapp?.trim() || null,
    message: formatLeadMessage(input),
    status: 'new',
    source: 'website_contact_form',
    attribution: sanitizeAttribution(attribution),
  };
}

export async function saveLead(record: LeadRecord) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return { stored: false, reason: 'not_configured' as const };

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Supabase lead storage failed.', detail);
      return { stored: false, reason: 'storage_failed' as const };
    }

    const rows = await response.json() as Array<{ id?: unknown }>;
    const id = typeof rows[0]?.id === 'string' ? rows[0].id : null;
    return { stored: true as const, id };
  } catch (error) {
    // A network-level rejection must degrade, not crash the whole lead intake.
    console.error('Supabase lead storage threw.', error);
    return { stored: false, reason: 'storage_failed' as const };
  }
}
