const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

type CalAttribution = Partial<Record<(typeof UTM_KEYS)[number] | 'gclid', string>> | null | undefined;

/**
 * Cal.com embed config: month layout in the visitor's language, plus the
 * stored campaign attribution so a booking can be traced back to its source.
 */
export function buildCalConfig(attribution: CalAttribution, locale: string) {
  const config: Record<string, string> = {
    layout: 'month_view',
    'ui.language': locale === 'fr' ? 'fr' : 'en',
  };

  for (const key of UTM_KEYS) {
    const value = attribution?.[key];
    if (value) config[key] = value;
  }

  const gclid = attribution?.gclid;
  if (gclid && !config.utm_content) config.utm_content = `gclid_${gclid}`;
  if (!config.utm_source) config.utm_source = 'website';

  return config;
}

/** Hosted booking page URL carrying the same attribution, for when the embed cannot load. */
export function buildCalBookingUrl(bookingUrl: string, attribution: CalAttribution) {
  const url = new URL(bookingUrl);
  const config = buildCalConfig(attribution, 'en');

  for (const key of [...UTM_KEYS, 'utm_source']) {
    const value = config[key];
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  }

  return url.toString();
}

export function getCalCopy(locale: string) {
  return locale === 'fr'
    ? {
        cta: 'Réserver un appel',
        heading: 'Parlons de votre projet',
        lead: 'Un appel de 30 minutes pour comprendre votre besoin, partager des exemples pertinents et définir la prochaine étape.',
        fallback: 'Ouvrir la page de réservation',
      }
    : {
        cta: 'Book a call',
        heading: 'Let’s talk about your project',
        lead: 'A 30-minute call to understand what you need, share relevant work, and agree the next step.',
        fallback: 'Open the booking page',
      };
}
