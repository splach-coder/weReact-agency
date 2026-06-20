'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Parallax photo collage — calm version of the editorial "manifesto" beat.
const COLLAGE = [
  { src: '/images/projects/kasbah-angour.webp', className: 'left-[2%] top-[8%] w-[26%] md:w-[18%]', depth: 40 },
  { src: '/images/projects/your-morocco.webp', className: 'right-[3%] top-[4%] w-[30%] md:w-[20%]', depth: 70 },
  { src: '/images/projects/flying-tandem.webp', className: 'left-[8%] bottom-[6%] w-[28%] md:w-[19%]', depth: 90 },
  { src: '/images/projects/by-marrakech.webp', className: 'right-[6%] bottom-[8%] w-[26%] md:w-[17%]', depth: 55 },
];

function CollageImage({
  src,
  className,
  depth,
  reduce,
  progress,
}: {
  src: string;
  className: string;
  depth: number;
  reduce: boolean;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const y = useTransform(progress, [0, 1], [reduce ? 0 : depth, reduce ? 0 : -depth]);
  return (
    <motion.div
      style={{ y }}
      className={`pointer-events-none absolute overflow-hidden rounded-xl shadow-[var(--shadow-lg)] ${className}`}
    >
      <Image
        src={src}
        alt=""
        width={400}
        height={300}
        className="h-full w-full object-cover opacity-90"
      />
    </motion.div>
  );
}

export default function Manifesto() {
  const t = useTranslations('Home.manifesto');
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--color-primary)] py-28 md:py-40 text-white"
    >
      {/* Collage */}
      <div aria-hidden="true" className="absolute inset-0 z-0 opacity-25 md:opacity-40">
        {COLLAGE.map((c) => (
          <CollageImage key={c.src} {...c} reduce={reduce} progress={scrollYProgress} />
        ))}
      </div>

      {/* Statement */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-mono mb-8 text-[var(--color-accent-warm)]"
        >
          {t('eyebrow')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug tracking-tight"
        >
          {t('body')}
        </motion.p>
      </div>
    </section>
  );
}
