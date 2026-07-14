'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { trackContactIntent, trackWhatsAppLead } from '@/lib/analytics';
import { buildWhatsAppLink } from '@/lib/whatsapp';

type GrowthCtasProps = {
  cta: string;
  contactHref: string;
  locale: string;
  slug: string;
};

/**
 * Client-side CTA row for the growth landing pages. The pages stay server
 * components (SEO); only the clickable CTAs hydrate so WhatsApp taps fire the
 * Ads conversion and contact clicks report intent with the page slug.
 */
export function GrowthCtas({ cta, contactHref, locale, slug }: GrowthCtasProps) {
  return (
    <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Link
        href={contactHref}
        onClick={() => trackContactIntent('growth_contact_cta', { page: slug })}
        className="inline-flex min-h-12 items-center gap-3 bg-[var(--color-primary)] px-6 py-4 text-mono text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        {cta}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      <a
        href={buildWhatsAppLink(locale, slug)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppLead('growth_whatsapp', { page: slug })}
        className="inline-flex min-h-12 items-center gap-3 border border-[rgba(58,90,64,0.28)] px-6 py-4 text-mono text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-white"
      >
        <WhatsAppIcon size={17} aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}

/** Bottom-of-page contact CTA: same button, tagged with its location. */
export function GrowthContactCta({ cta, contactHref, slug }: Omit<GrowthCtasProps, 'locale'>) {
  return (
    <Link
      href={contactHref}
      onClick={() => trackContactIntent('growth_contact_cta', { page: slug, location: 'bottom' })}
      className="inline-flex min-h-12 items-center gap-3 bg-[var(--color-primary)] px-6 py-4 text-mono text-white transition-colors hover:bg-[var(--color-primary-dark)]"
    >
      {cta}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
