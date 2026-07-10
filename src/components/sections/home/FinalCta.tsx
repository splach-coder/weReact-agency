'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from '@/components/transition/TransitionLink';
import { siteConfig } from '@/config/site';
import { smoothEasing } from '@/lib/animations';
import { trackContactIntent } from '@/lib/analytics';

const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEasing } },
};
const mask = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: smoothEasing } },
};

export default function FinalCta() {
  const t = useTranslations('Home.finalCta');

  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] py-28 md:py-40 text-white">
      {/* Oversized ghost wordmark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none text-[26vw] font-black uppercase leading-none tracking-tighter text-white opacity-[0.05]"
      >
        WeReact
      </span>

      <motion.div
        variants={wrap}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        <motion.span
          variants={fade}
          aria-hidden="true"
          className="mx-auto mb-8 block h-1 w-16 bg-[var(--color-accent-sage)]"
        />
        <span className="mx-auto block overflow-hidden pb-[0.12em]">
          <motion.h2
            variants={mask}
            className="font-display text-5xl leading-[1.0] tracking-tight sm:text-6xl md:text-7xl"
          >
            {t('title')}
          </motion.h2>
        </span>
        <motion.p
          variants={fade}
          className="mx-auto mt-7 max-w-xl text-lg font-light text-[var(--color-accent-warm)]"
        >
          {t('subtitle')}
        </motion.p>
        <motion.div
          variants={fade}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/contact"
            onClick={() => trackContactIntent('final_cta_primary', { destination: 'contact' })}
            className="btn-base btn-clay group justify-center transition-transform hover:-translate-y-0.5"
          >
            {t('ctaPrimary')}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={siteConfig.business.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactIntent('final_cta_whatsapp', { method: 'whatsapp', page: 'home', location: 'final_cta' })}
            className="btn-base justify-center border border-white/40 bg-transparent text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle size={18} aria-hidden="true" />
            {t('ctaSecondary')}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
