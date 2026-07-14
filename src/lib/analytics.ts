type EventValue = string | number | boolean | null | undefined;
type EventParams = Record<string, EventValue>;

type CampaignKey =
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'gclid'
  | 'gbraid'
  | 'wbraid'
  | 'fbclid';

type StoredAttribution = Partial<Record<CampaignKey, string>> & {
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
};

export type LeadUserData = {
  email?: string;
  phone?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ATTRIBUTION_KEY = 'wereact_attribution';
const CAMPAIGN_KEYS: CampaignKey[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
];

// `||` (not `??`) so an empty-string env var still falls back to the live
// production values instead of silently disabling conversion tracking.
const GOOGLE_ADS_ID = (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '').trim() || 'AW-18245192967';
const GOOGLE_ADS_LEAD_LABEL =
  (process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || '').trim() || 'C9w5CPvkkc4cEIea_vtD';
// WhatsApp clicks get their own (lower-value) conversion action. No default:
// the conversion only fires once the action exists in Google Ads and its
// label is deployed. Until then WhatsApp clicks still emit GA4 events.
const GOOGLE_ADS_WHATSAPP_LABEL = (process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || '').trim();
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_VALUE ?? '1');
const LEAD_CURRENCY = (process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CURRENCY || '').trim() || 'MAD';
const LEAD_TRACKING_TIMEOUT = 1200;

function hasWindow() {
  return typeof window !== 'undefined';
}

function cleanEventParams(params: EventParams): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>;
}

function attributionEventParams(attribution: StoredAttribution | null): EventParams {
  if (!attribution) return {};

  return {
    campaign_source: attribution.utm_source,
    campaign_medium: attribution.utm_medium,
    campaign_name: attribution.utm_campaign,
    campaign_term: attribution.utm_term,
    campaign_content: attribution.utm_content,
    gclid_present: Boolean(attribution.gclid),
    gbraid_present: Boolean(attribution.gbraid),
    wbraid_present: Boolean(attribution.wbraid),
    fbclid_present: Boolean(attribution.fbclid),
    landing_page: attribution.landing_page,
    referrer: attribution.referrer,
  };
}

export function captureAttribution() {
  if (!hasWindow()) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const campaignData = CAMPAIGN_KEYS.reduce<Partial<Record<CampaignKey, string>>>((acc, key) => {
      const value = params.get(key);
      if (value) acc[key] = value;
      return acc;
    }, {});

    const hasCampaignData = Object.keys(campaignData).length > 0;
    const existing = window.localStorage.getItem(ATTRIBUTION_KEY);

    if (!hasCampaignData && existing) return;

    const attribution: StoredAttribution = {
      ...campaignData,
      landing_page: window.location.href,
      referrer: document.referrer || undefined,
      captured_at: new Date().toISOString(),
    };

    if (hasCampaignData || attribution.referrer) {
      window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    }
  } catch {
    // Attribution is useful, but it should never block the site.
  }
}

export function getStoredAttribution(): StoredAttribution | null {
  if (!hasWindow()) return null;

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as StoredAttribution) : null;
  } catch {
    return null;
  }
}

/**
 * One id per lead: sent as the Ads conversion transaction_id (dedupes repeat
 * fires) and stored with the lead so offline conversion uploads can match.
 */
export function createLeadTransactionId(): string {
  try {
    const uuid = globalThis.crypto?.randomUUID?.();
    if (uuid) return uuid;
  } catch {
    // fall through to the manual id
  }
  return `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Best-effort E.164 for Enhanced Conversions (+212… for local 0-prefixed numbers). */
function normalizePhoneForAds(phone: string): string | undefined {
  const digits = phone.replace(/[^\d+]/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith('0') && digits.length === 10) return `+212${digits.slice(1)}`;
  return `+${digits}`;
}

/** Google hashes these client-side for Enhanced Conversions for Leads. */
function setEnhancedConversionUserData(userData: LeadUserData | undefined) {
  if (!userData || !hasWindow() || typeof window.gtag !== 'function') return;

  const email = userData.email?.trim().toLowerCase();
  const phoneNumber = userData.phone ? normalizePhoneForAds(userData.phone) : undefined;
  if (!email && !phoneNumber) return;

  window.gtag('set', 'user_data', {
    ...(email ? { email } : {}),
    ...(phoneNumber ? { phone_number: phoneNumber } : {}),
  });
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (!hasWindow() || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, cleanEventParams(params));
}

export function trackPageView(url: string) {
  trackEvent('page_view', {
    page_location: url,
    page_path: window.location.pathname,
    page_title: document.title,
  });
}

export function trackContactIntent(context: string, params: EventParams = {}) {
  trackEvent('contact_intent', {
    event_category: 'engagement',
    context,
    ...attributionEventParams(getStoredAttribution()),
    ...params,
  });
}

/**
 * WhatsApp is the dominant contact channel in Morocco: give it its own Google
 * Ads conversion (once the action's label is configured) on top of the GA4
 * intent event. Fire-and-forget — WhatsApp links open in a new tab, so there
 * is no unload race to wait on.
 */
export function trackWhatsAppLead(context: string, params: EventParams = {}) {
  trackContactIntent(context, { method: 'whatsapp', ...params });

  if (!hasWindow() || typeof window.gtag !== 'function' || !GOOGLE_ADS_ID || !GOOGLE_ADS_WHATSAPP_LABEL) {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
    currency: LEAD_CURRENCY,
    value: Number.isFinite(LEAD_VALUE) ? LEAD_VALUE : 1,
    transaction_id: createLeadTransactionId(),
    method: 'whatsapp',
  });
}

export function trackLead(
  method: string,
  params: EventParams = {},
  userData?: LeadUserData,
  transactionId?: string
) {
  const attribution = getStoredAttribution();
  const leadParams = {
    event_category: 'lead',
    method,
    currency: LEAD_CURRENCY,
    value: Number.isFinite(LEAD_VALUE) ? LEAD_VALUE : 1,
    ...attributionEventParams(attribution),
    ...params,
  };

  // Single canonical GA4 lead event; import/mark ONLY generate_lead as a key
  // event so Ads never double-counts against the native AW conversion.
  trackEvent('generate_lead', leadParams);

  if (!hasWindow() || typeof window.gtag !== 'function' || !GOOGLE_ADS_ID || !GOOGLE_ADS_LEAD_LABEL) {
    return Promise.resolve();
  }

  setEnhancedConversionUserData(userData);

  const gtag = window.gtag;
  const txId = transactionId || createLeadTransactionId();

  return new Promise<void>((resolve) => {
    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const timeout = window.setTimeout(complete, LEAD_TRACKING_TIMEOUT);

    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      currency: LEAD_CURRENCY,
      value: Number.isFinite(LEAD_VALUE) ? LEAD_VALUE : 1,
      transaction_id: txId,
      method,
      event_callback: complete,
      event_timeout: LEAD_TRACKING_TIMEOUT,
    });
  });
}
