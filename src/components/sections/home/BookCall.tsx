'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { CalendarClock, Mail } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { siteConfig } from '@/config/site';
import { smoothEasing } from '@/lib/animations';
import { trackContactIntent, trackWhatsAppLead } from '@/lib/analytics';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEasing } },
};
const mask = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: smoothEasing } },
};

// Configure via NEXT_PUBLIC_CALCOM_LINK, e.g. "wereact/30min".
// Until set, the section shows the fallback contact options.
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

export default function BookCall() {
  const t = useTranslations('Home.booking');
  const locale = useLocale();

  return (
    <section id="book" className="bg-[var(--color-background-contrast)] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 text-center"
        >
          <motion.p
            variants={fade}
            className="text-mono mb-4 flex items-center justify-center gap-2.5 text-[var(--color-primary)]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" />
            {t('eyebrow')}
          </motion.p>
          <span className="mx-auto block overflow-hidden pb-[0.12em]">
            <motion.h2
              variants={mask}
              className="font-display text-4xl tracking-tight text-[var(--color-text-main)] md:text-5xl"
            >
              {t('title')}
            </motion.h2>
          </span>
          <motion.p
            variants={fade}
            className="mx-auto mt-4 max-w-2xl text-lg font-light text-[var(--color-text-secondary)]"
          >
            {t('subtitle')}
          </motion.p>
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
                href={buildWhatsAppLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppLead('book_call_whatsapp', { page: 'home', location: 'book_call' })}
                className="btn-base btn-clay justify-center"
              >
                <WhatsAppIcon size={18} aria-hidden="true" />
                {t('cta')}
              </a>
              <a
                href={`mailto:${siteConfig.business.email}`}
                onClick={() => trackContactIntent('book_call_email', { method: 'email', page: 'home', location: 'book_call' })}
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
