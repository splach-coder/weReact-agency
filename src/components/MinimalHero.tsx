'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { smoothEasing } from '@/lib/animations';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEasing } },
};

export default function MinimalHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const t = useTranslations('Home.hero');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  // Gentle parallax on the image; disabled when the user prefers reduced motion.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '12%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] md:min-h-screen w-full overflow-hidden bg-[var(--color-background-main)]"
    >
      {/* Full-bleed warm imagery, bleeding in from the right */}
      <motion.div aria-hidden="true" style={{ y: imageY }} className="absolute inset-0 z-0">
        <Image
          src="/images/nature_hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-right"
        />
        <Image
          src="/images/nature_hero_phone.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="md:hidden object-cover object-center"
        />
      </motion.div>

      {/* Sand scrim — keeps the left readable, lets the photo breathe on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--color-background-main)] via-[var(--color-background-main)]/85 md:via-[var(--color-background-main)]/70 to-transparent"
      />
      {/* Mobile bottom-up scrim for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 md:hidden bg-gradient-to-t from-[var(--color-background-main)] via-[var(--color-background-main)]/60 to-transparent"
      />

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-[92vh] md:min-h-screen max-w-7xl flex-col justify-center px-6 md:px-16">
        <motion.div initial="hidden" animate="visible" variants={container} className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="text-mono mb-6 text-[var(--color-accent-clay-dark)]"
          >
            {t('eyebrow')}
          </motion.p>

          {/* Headline (single h1 on the page) */}
          <motion.h1
            variants={item}
            className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.98] tracking-tight text-[var(--color-text-main)]"
          >
            {t('titleLine1')}
            <br />
            {t('titleLine2')}{' '}
            <span className="relative whitespace-nowrap">
              {t('highlight')}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 md:bottom-2 h-[0.12em] bg-[var(--color-accent-clay)]"
              />
            </span>
            .
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="mb-10 max-w-xl text-base md:text-xl font-light leading-relaxed text-[var(--color-text-secondary)]"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="btn-base btn-clay group justify-center transition-transform hover:-translate-y-0.5"
            >
              {t('ctaPrimary')}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/work"
              className="btn-base btn-ghost justify-center"
            >
              {t('ctaSecondary')}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 md:block"
      >
        <ChevronDown className="h-6 w-6 text-[var(--color-text-muted)]" />
      </motion.div>
    </section>
  );
}
