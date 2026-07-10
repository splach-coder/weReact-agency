'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import Link from '@/components/transition/TransitionLink';
import { smoothEasing } from '@/lib/animations';
import { RevealLine } from '@/components/ui/RevealText';
import { trackContactIntent } from '@/lib/analytics';

export default function MinimalHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const t = useTranslations('Home.hero');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.2]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '12%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0]);

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Full-bleed cinematic background with parallax */}
      <motion.div
        aria-hidden="true"
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/nature_hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <Image
          src="/images/nature_hero_phone.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
      </motion.div>

      {/* Brand-tinted cinematic scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#101a12]/70 via-[#101a12]/35 to-[#0c120b]/90"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]"
      />

      {/* Top kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="absolute inset-x-0 top-28 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 md:top-32 md:px-16"
      >
        <span className="text-mono flex items-center gap-2.5 text-white/70">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" />
          {t('kicker')}
        </span>
        <span className="text-mono hidden text-white/45 md:block">© 2025</span>
      </motion.div>

      {/* Centered, image-led headline — minimal text */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.98] tracking-[-0.01em] text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.55)]">
          <RevealLine delay={0.15}>{t('titleLine1')}</RevealLine>
          <RevealLine delay={0.3}>
            {t('titleLine2')} <span className="italic text-[var(--color-accent-sage)]">{t('highlight')}</span>.
          </RevealLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease: smoothEasing }}
          className="mt-8 flex flex-col items-center gap-7"
        >
          <p className="max-w-md text-base font-light leading-relaxed text-white/80 md:text-lg">
            {t('subtitle')}
          </p>
          <Link
            href="/contact"
            onClick={() => trackContactIntent('hero_primary_cta', { destination: 'contact' })}
            className="btn-base btn-clay group justify-center transition-transform hover:-translate-y-0.5"
          >
            {t('ctaPrimary')}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute inset-x-0 bottom-24 z-20 flex justify-center md:bottom-28"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <ArrowDown size={18} />
        </motion.span>
      </motion.div>
    </section>
  );
}
