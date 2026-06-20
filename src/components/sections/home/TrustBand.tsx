'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STAT_KEYS = ['projects', 'languages', 'based', 'since'] as const;

export default function TrustBand() {
  const t = useTranslations('Home.trust');

  return (
    <section className="border-y border-[rgba(58,90,64,0.12)] bg-[var(--color-background-contrast)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center text-lg md:text-xl font-light text-[var(--color-text-secondary)]"
        >
          {t('title')}
        </motion.p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STAT_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-primary)]">
                {t(`values.${key}`)}
              </div>
              <div className="mt-2 text-mono text-[var(--color-text-muted)]">
                {t(`stats.${key}`)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
