'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { smoothEasing } from '@/lib/animations';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Optional section index, e.g. "01" — rendered as a large ghost number. */
  index?: string;
  /** Optional element rendered on the right (e.g. a "view all" link). */
  action?: React.ReactNode;
  align?: 'left' | 'center';
  /** Heading tag — defaults to h2. */
  as?: 'h1' | 'h2';
  className?: string;
}

const wrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEasing } },
};
// Masked line-rise — the signature reveal shared with the hero/menu.
const maskItem = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: smoothEasing } },
};

/**
 * Bold "statement" section header — oversized black headline with a mono
 * eyebrow (leading sage dot) and an optional ghost index number, in the
 * structural spirit of OHHH! Contest's section breaks.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
  action,
  align = 'left',
  as = 'h2',
  className = '',
}: SectionHeadingProps) {
  const Heading = as;
  const centered = align === 'center';

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={wrap}
      className={`flex flex-col gap-6 ${
        action ? 'md:flex-row md:items-end md:justify-between' : ''
      } ${className}`}
    >
      <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
        {(eyebrow || index) && (
          <motion.div
            variants={item}
            className={`mb-5 flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
          >
            {index && (
              <span className="text-2xl font-black leading-none text-[var(--color-accent-sage)]">
                {index}
              </span>
            )}
            {eyebrow && (
              <span className="text-mono flex items-center gap-2.5 text-[var(--color-primary)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" />
                {eyebrow}
              </span>
            )}
          </motion.div>
        )}

        <div className="overflow-hidden pb-[0.12em]">
          <motion.div variants={maskItem}>
            <Heading className="font-display text-4xl leading-[1.02] tracking-tight text-[var(--color-text-main)] sm:text-5xl md:text-6xl">
              {title}
            </Heading>
          </motion.div>
        </div>

        {subtitle && (
          <motion.p
            variants={item}
            className="mt-5 text-lg font-light leading-relaxed text-[var(--color-text-secondary)]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div variants={item} className={centered ? 'mx-auto' : ''}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
