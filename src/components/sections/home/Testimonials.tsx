'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { smoothEasing } from '@/lib/animations';
import SectionHeading from '@/components/ui/SectionHeading';

type EvidenceItem = {
  summary: string;
  name: string;
  category: string;
  focus: string;
  location: string;
};

export default function ProjectEvidence() {
  const t = useTranslations('Home.projectEvidence');
  const items = t.raw('items') as EvidenceItem[];

  return (
    <section className="bg-[var(--color-background-contrast)] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-16">
        <SectionHeading
          className="mb-16"
          index="04"
          eyebrow={t('eyebrow')}
          title={t('title')}
        />

        <div className="flex flex-col gap-8">
          {items.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: smoothEasing }}
              style={{ top: `${6 + index * 2}rem` }}
              className="sticky overflow-hidden rounded-lg border border-[rgba(58,90,64,0.15)] bg-[var(--color-background-main)] p-8 shadow-[var(--shadow-lg)] md:p-14"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-8 select-none text-[10rem] font-black leading-none text-[var(--color-primary)] opacity-[0.05]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-mono mb-6 text-[var(--color-primary)]">{t('proofLabel')}</p>
              <p className="relative text-2xl font-light leading-snug tracking-tight text-[var(--color-text-main)] md:text-3xl lg:text-4xl">
                {item.summary}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-[var(--color-primary)]" aria-hidden="true" />
                <span>
                  <span className="block font-bold text-[var(--color-text-main)]">{item.name}</span>
                  <span className="block text-sm text-[var(--color-text-secondary)]">
                    {item.category}, {item.focus} - {item.location}
                  </span>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
