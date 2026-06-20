'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CalendarClock, MessageCircle, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

// Configure via NEXT_PUBLIC_CALCOM_LINK, e.g. "wereact/30min".
// Until set, the section shows the fallback contact options.
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

export default function BookCall() {
  const t = useTranslations('Home.booking');

  return (
    <section id="book" className="bg-[var(--color-background-contrast)] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-mono mb-4 text-[var(--color-accent-clay-dark)]">{t('eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-[var(--color-text-secondary)]">
            {t('subtitle')}
          </p>
        </motion.div>

        {CAL_LINK ? (
          <div className="overflow-hidden rounded-2xl border border-[rgba(58,90,64,0.15)] shadow-[var(--shadow-md)]">
            <iframe
              src={`https://cal.com/${CAL_LINK}?embed=true&theme=light`}
              title={t('title')}
              loading="lazy"
              className="h-[640px] w-full border-0"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[rgba(58,90,64,0.3)] bg-[var(--color-background-main)] p-10 text-center">
            <CalendarClock
              className="mx-auto mb-4 h-10 w-10 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <p className="mx-auto max-w-md text-[var(--color-text-secondary)]">
              {t('fallback')}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.business.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-clay justify-center"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {t('cta')}
              </a>
              <a
                href={`mailto:${siteConfig.business.email}`}
                className="btn-base btn-ghost justify-center"
              >
                <Mail size={18} aria-hidden="true" />
                {siteConfig.business.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
