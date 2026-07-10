'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import SectionHeading from '@/components/ui/SectionHeading';

type Step = { title: string; text: string };

export default function Process() {
  const t = useTranslations('Home.process');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="bg-[var(--color-background-main)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <SectionHeading
          className="mb-16"
          index="03"
          eyebrow={t('eyebrow')}
          title={t('title')}
        />

        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pt-2"
            >
              {/* Oversized ghost index */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-0 select-none text-7xl font-black leading-none tracking-tighter text-[var(--color-primary)] opacity-[0.08] md:text-8xl"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative">
                <span
                  className="mb-5 block h-0.5 w-10 bg-[var(--color-accent-sage)]"
                  aria-hidden="true"
                />
                <h3 className="mb-2 text-xl font-bold text-[var(--color-text-main)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {step.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
