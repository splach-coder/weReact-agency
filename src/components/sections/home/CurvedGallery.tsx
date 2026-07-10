'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { projects } from '@/data/projects';
import SectionHeading from '@/components/ui/SectionHeading';

const SHOTS = projects.slice(0, 5).map((p) => p.image);
const CENTER = (SHOTS.length - 1) / 2;
const STEP_DEG = 15; // per-image inward rotation → cylinder curve

export default function CurvedGallery() {
  const t = useTranslations('Home.gallery');
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // The whole curved strip tilts up and scales as it scrolls through center,
  // then drifts — a cinematic reveal of the panorama.
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [22, 2, 18]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.8, 1.02, 0.86]);
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['7%', '-7%']);

  return (
    <section className="overflow-hidden bg-[var(--color-background-main)] py-24 md:py-32">
      <div className="mx-auto mb-16 max-w-7xl px-6 md:px-16">
        <SectionHeading index="05" eyebrow={t('eyebrow')} title={t('title')} align="center" />
      </div>

      <div ref={ref} className="flex justify-center [perspective:1100px]">
        <motion.div
          style={{ rotateX, scale, x }}
          className="flex items-center justify-center will-change-transform [transform-style:preserve-3d]"
        >
          {SHOTS.map((src, i) => {
            const offset = i - CENTER;
            // Side images rotate inward and sit back → concave cylinder.
            const rotateY = reduce ? 0 : -offset * STEP_DEG;
            const z = reduce ? 0 : -Math.abs(offset) * 90;
            return (
              <div
                key={src}
                style={{
                  transform: `rotateY(${rotateY}deg) translateZ(${z}px)`,
                  transformStyle: 'preserve-3d',
                }}
                className="relative mx-[-1.5%] aspect-[3/4] w-[24vw] shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-2xl)] ring-1 ring-black/10 md:w-[20vw]"
              >
                <Image src={src} alt="" fill sizes="24vw" className="object-cover" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
