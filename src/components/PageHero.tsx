'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { smoothEasing } from '@/lib/animations';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional huge ghost label behind the headline, e.g. "WORK". */
  watermark?: string;
}

const wrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEasing } },
};

/**
 * Statement page header shared across inner pages (Work, About, Services…).
 * Sand background, oversized Nohemi headline, mono eyebrow with a sage dot,
 * an optional ghost watermark, and a hairline rule — the structural
 * "section break" language adapted to the calm-premium brand.
 */
export default function PageHero({ eyebrow, title, subtitle, watermark }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background-main)] pt-40 pb-16 md:pt-52 md:pb-24">
      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-24 select-none text-[22vw] font-black leading-none tracking-tighter text-[var(--color-primary)] opacity-[0.04] md:top-28"
        >
          {watermark}
        </span>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={wrap}
        className="relative mx-auto max-w-7xl px-6 md:px-16"
      >
        <motion.p
          variants={item}
          className="text-mono mb-6 flex items-center gap-2.5 text-[var(--color-primary)]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" />
          {eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-[var(--color-text-main)] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          variants={item}
          className="mt-12 h-px w-full bg-[rgba(58,90,64,0.15)]"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}
