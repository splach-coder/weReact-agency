'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/transition/TransitionLink';
import { smoothEasing } from '@/lib/animations';

const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: smoothEasing } },
};
const mask = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: smoothEasing } },
};
const still = { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };
const stillMask = { hidden: { y: '0%' }, visible: { y: '0%' } };

export default function SelectedProjects() {
  const t = useTranslations('Home.projects');
  const reduceMotion = useReducedMotion();
  const fadeVariant = reduceMotion ? still : fade;
  const maskVariant = reduceMotion ? stillMask : mask;

  return (
    <section className="relative overflow-hidden bg-[var(--color-background-main)] py-24 md:py-36">
      <div aria-hidden="true" data-depth="0" className="absolute inset-x-0 top-0 h-px bg-[rgba(58,90,64,0.18)]" />
      <div
        aria-hidden="true"
        data-depth="1"
        className="pointer-events-none absolute bottom-0 left-0 hidden h-28 w-full bg-[linear-gradient(180deg,transparent,rgba(227,227,220,0.45))] md:block"
      />
      <motion.div
        aria-hidden="true"
        data-depth="2"
        initial={reduceMotion ? false : { opacity: 0, x: 36 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: smoothEasing }}
        className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-[34vw] bg-[rgba(58,90,64,0.2)] md:block"
      />

      <motion.div
        data-depth="4"
        variants={wrap}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[minmax(0,1fr)_360px] md:items-end md:px-16"
      >
        <div>
          <motion.p variants={fadeVariant} className="text-mono mb-5 text-[var(--color-primary)]">
            <span className="mr-3 text-2xl font-black leading-none text-[var(--color-accent-sage)]">02</span>
            {t('eyebrow')}
          </motion.p>

          <span className="block overflow-hidden pb-[0.12em]">
            <motion.h2
              variants={maskVariant}
              className="max-w-4xl font-display text-5xl leading-[0.96] tracking-tight text-[var(--color-text-main)] sm:text-6xl md:text-7xl"
            >
              {t('title')}
            </motion.h2>
          </span>

          <motion.p
            variants={fadeVariant}
            className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)]"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <motion.div variants={fadeVariant} className="md:justify-self-end">
          <Link
            href="/work"
            className="group inline-flex min-h-12 cursor-pointer items-center gap-3 bg-[var(--color-primary)] px-7 py-4 text-mono text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)]"
          >
            {t('viewAll')}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}