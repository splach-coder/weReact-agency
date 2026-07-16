'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { createFaqJsonLd } from '@/lib/seo';

type Item = { q: string; a: string };

export default function Faq() {
  const t = useTranslations('Home.faq');
  const items = t.raw('items') as Item[];
  const faqJsonLd = createFaqJsonLd(items.map((item) => ({ question: item.q, answer: item.a })));

  return (
    <section className="bg-[var(--color-background-main)] py-24 md:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionHeading index="06" eyebrow={t('eyebrow')} title={t('title')} />
          </div>
        </div>

        <div className="divide-y divide-[rgba(58,90,64,0.15)] border-y border-[rgba(58,90,64,0.15)] md:col-span-8">
          {items.map((item, i) => (
            <details key={i} className="group py-0" open={i === 0}>
              <summary
                className="flex w-full cursor-pointer list-none items-center justify-between gap-4 py-6 text-left [&::-webkit-details-marker]:hidden"
              >
                <span className="text-lg font-bold text-[var(--color-text-main)]">{item.q}</span>
                <Plus
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--color-primary)] transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
