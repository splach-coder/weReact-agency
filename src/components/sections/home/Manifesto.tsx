'use client';

import { Fragment, useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { smoothEasing } from '@/lib/animations';

type ManifestoWordProps = {
  text: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

const enter = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: smoothEasing } },
};

const still = {
  hidden: { opacity: 1, y: 0, filter: 'blur(0px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

function ManifestoWord({ text, index, total, progress, reduceMotion }: ManifestoWordProps) {
  const start = Math.max(0, (index - 0.75) / total);
  const end = Math.min(1, (index + 1.65) / total);
  const clipPath = useTransform(
    progress,
    [start, end],
    reduceMotion ? ['inset(0 0% 0 0)', 'inset(0 0% 0 0)'] : ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );
  const fillOpacity = useTransform(progress, [start, end], reduceMotion ? [1, 1] : [0.72, 1]);
  const wordContent = text;

  return (
    <span className="relative inline-block overflow-hidden align-bottom text-[rgba(58,90,64,0.22)]">
      <span>{wordContent}</span>
      <motion.span
        aria-hidden="true"
        style={{ clipPath, opacity: fillOpacity }}
        className="absolute inset-0 text-[var(--color-primary)]"
      >
        {wordContent}
      </motion.span>
    </span>
  );
}

export default function Manifesto() {
  const t = useTranslations('Home.manifesto');
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const fillProgress = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);
  const railScale = useTransform(scrollYProgress, [0.08, 0.72], [0, 1]);
  const words = t('body').split(' ');
  const activeEnter = reduceMotion ? still : enter;

  return (
    <section
      id="belief"
      ref={sectionRef}
      data-scene="manifesto"
      className={`relative isolate overflow-visible bg-[var(--color-background-main)] text-[var(--color-primary)] ${reduceMotion ? 'px-6 py-14 md:px-16 md:py-16' : 'min-h-[128svh] md:min-h-[150vh]'}`}
    >
      <div aria-hidden="true" data-depth="0" className="absolute inset-0 -z-10 bg-[var(--color-background-main)]" />
      <div
        aria-hidden="true"
        data-depth="1"
        className="absolute left-1/2 top-1/2 -z-10 h-[min(34rem,calc(100vw-2rem))] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(58,90,64,0.08)]"
      />

      <div data-pin="belief" className={reduceMotion ? "" : "sticky top-[14svh] flex h-[72svh] items-center overflow-hidden px-5 md:top-[20vh] md:h-[60vh] md:px-16"}>
        <motion.div
          data-depth="4"
          variants={activeEnter}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-110px' }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <motion.div
            aria-hidden="true"
            data-depth="5"
            style={{ scaleX: railScale, transformOrigin: 'left center' }}
            className="mb-8 h-px w-28 bg-[var(--color-accent-sage)] md:mb-10"
          />

          <p className="text-mono mb-7 flex items-center justify-center gap-2.5 text-[var(--color-primary)] md:mb-9">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--color-accent-sage)]" />
            {t('eyebrow')}
          </p>

          <p
            aria-label={t('body')}
            className="font-display text-[clamp(1.45rem,6.6vw,2rem)] leading-[1.22] tracking-tight md:text-[clamp(1.55rem,3vw,3.15rem)] md:leading-[1.18] text-[var(--color-primary)]"
          >
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <ManifestoWord
                  text={word}
                  index={index}
                  total={words.length}
                  progress={fillProgress}
                  reduceMotion={reduceMotion}
                />
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </p>

          <motion.div
            aria-hidden="true"
            data-depth="2"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.65, ease: smoothEasing }}
            className="mt-9 h-1.5 w-1.5 bg-[var(--color-accent-sage)]"
          />
        </motion.div>
      </div>
    </section>
  );
}