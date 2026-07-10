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

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? 'AW-3408876297';
const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_VALUE ?? '1');
const LEAD_CURRENCY = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CURRENCY ?? 'MAD';

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

export function formatAttributionForEmail() {
  const attribution = getStoredAttribution();
  if (!attribution) return '';

  const lines = [
    ['Source', attribution.utm_source],
    ['Medium', attribution.utm_medium],
    ['Campaign', attribution.utm_campaign],
    ['Term', attribution.utm_term],
    ['Content', attribution.utm_content],
    ['Google click ID', attribution.gclid],
    ['GBRAID', attribution.gbraid],
    ['WBRAID', attribution.wbraid],
    ['Landing page', attribution.landing_page],
    ['Referrer', attribution.referrer],
    ['Captured at', attribution.captured_at],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  return lines.length ? `\n\nCampaign attribution:\n${lines.join('\n')}` : '';
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

export function trackLead(method: string, params: EventParams = {}) {
  const attribution = getStoredAttribution();
  const leadParams = {
    event_category: 'lead',
    method,
    currency: LEAD_CURRENCY,
    value: Number.isFinite(LEAD_VALUE) ? LEAD_VALUE : 1,
    ...attributionEventParams(attribution),
    ...params,
  };

  trackEvent('generate_lead', leadParams);
  trackEvent('contact_lead', leadParams);

  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    trackEvent('conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      currency: LEAD_CURRENCY,
      value: Number.isFinite(LEAD_VALUE) ? LEAD_VALUE : 1,
      method,
    });
  }
}