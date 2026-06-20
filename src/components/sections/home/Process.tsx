'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Step = { title: string; text: string };

export default function Process() {
  const t = useTranslations('Home.process');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="bg-[var(--color-background-main)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mb-14 max-w-2xl">
          <p className="text-mono mb-4 text-[var(--color-accent-clay-dark)]">{t('eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
            {t('title')}
          </h2>
        </div>

        <ol className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="mb-5 flex items-center gap-4">
                <span className="text-mono text-[var(--color-accent-clay-dark)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-[rgba(58,90,64,0.2)]" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[var(--color-text-main)]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
