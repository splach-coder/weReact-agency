'use client';

import { ArrowUpRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from '@/components/transition/TransitionLink';

const paths = {
  en: [
    ['/tourism-websites-morocco', 'Tourism & hospitality', 'Websites built around discovery, trust, and direct enquiries.'],
    ['/website-design-moroccan-businesses', 'Moroccan businesses', 'Local visibility and clearer paths to calls, WhatsApp, and quotes.'],
    ['/international-web-design-agency', 'International teams', 'Bilingual remote delivery from Marrakech to the world.'],
  ],
  fr: [
    ['/tourism-websites-morocco', 'Tourisme & hôtellerie', 'Des sites pensés pour la découverte, la confiance et les demandes directes.'],
    ['/website-design-moroccan-businesses', 'Entreprises marocaines', 'Visibilité locale et parcours clairs vers appels, WhatsApp et devis.'],
    ['/international-web-design-agency', 'Équipes internationales', 'Une livraison bilingue à distance depuis Marrakech.'],
  ],
} as const;

export default function AudiencePaths() {
  const locale = useLocale() === 'fr' ? 'fr' : 'en';
  const eyebrow = locale === 'fr' ? 'Choisissez votre parcours' : 'Choose your path';
  const title = locale === 'fr'
    ? 'Une expertise, adaptée à votre marché.'
    : 'One studio, shaped around your market.';

  return (
    <section className="border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-20 md:px-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-[rgba(58,90,64,0.16)] pb-10 md:grid-cols-[0.3fr_0.7fr] md:items-end">
          <p className="text-mono text-[var(--color-primary)]">{eyebrow}</p>
          <h2 className="max-w-4xl font-display text-[clamp(2.1rem,4.1vw,4.8rem)] leading-[0.96] text-[var(--color-text-main)]">
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3">
          {paths[locale].map(([href, label, description], index) => (
            <Link
              key={href}
              href={href}
              className="group border-b border-[rgba(58,90,64,0.16)] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-mono text-[var(--color-accent-sage)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="text-[var(--color-primary)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <h3 className="mt-9 font-display text-2xl leading-tight text-[var(--color-text-main)] transition-colors group-hover:text-[var(--color-primary)]">
                {label}
              </h3>
              <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-[var(--color-text-secondary)]">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
