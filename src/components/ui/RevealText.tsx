'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { smoothEasing } from '@/lib/animations';

/**
 * One line of text that wipes up from a clipped mask — the exo-ape
 * `Paragraph.js` line-reveal idiom (overflow-hidden parent + translateY 110%→0).
 * Lifted out of MinimalHero so the hero, the ScrollReel, and any headline can
 * share one implementation. Respects reduced motion (renders in place).
 */
export function RevealLine({
  children,
  delay = 0,
  duration = 1,
  className = '',
  as = 'span',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'span' | 'div';
}) {
  const reduce = useReducedMotion();
  const Outer = as;

  return (
    <Outer className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={reduce ? { y: '0%' } : { y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: reduce ? 0 : duration, ease: smoothEasing, delay: reduce ? 0 : delay }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </Outer>
  );
}

/**
 * Convenience wrapper: render an array of lines with a per-line stagger,
 * mirroring SOTD's `lineIndex * 0.1s` cascade.
 */
export function RevealLines({
  lines,
  baseDelay = 0,
  stagger = 0.12,
  duration = 1,
  className = '',
}: {
  lines: React.ReactNode[];
  baseDelay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <RevealLine key={i} delay={baseDelay + i * stagger} duration={duration} className={className}>
          {line}
        </RevealLine>
      ))}
    </>
  );
}

export default RevealLine;
