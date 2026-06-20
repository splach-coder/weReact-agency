'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

export default function FinalCta() {
  const t = useTranslations('Home.finalCta');

  return (
    <section className="bg-[var(--color-primary)] py-24 md:py-32 text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
          {t('title')}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg font-light text-[var(--color-accent-warm)]">
          {t('subtitle')}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="btn-base btn-clay group justify-center transition-transform hover:-translate-y-0.5"
          >
            {t('ctaPrimary')}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={siteConfig.business.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base justify-center border border-white/40 bg-transparent text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle size={18} aria-hidden="true" />
            {t('ctaSecondary')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
