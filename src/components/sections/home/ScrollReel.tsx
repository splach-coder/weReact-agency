'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Pinned craft reel. The media scales from visually zero to full-bleed first;
 * text stays hidden until the image is almost full, then the title drifts apart.
 */
const MEDIA = [
  {
    src: '/images/craft-production.webp',
    alt: 'Premium web production workspace with abstract website layouts and Moroccan craft details',
  },
];

export default function ScrollReel() {
  const t = useTranslations('Home.reel');
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      gsap.set(mediaRef.current, isMobile
        ? { scale: 1.14, yPercent: 0, transformOrigin: '50% 50%', force3D: true }
        : { scale: 0.001, transformOrigin: '50% 50%', force3D: true },
      );
      gsap.set([eyebrowRef.current, titleRef.current, captionRef.current], { autoAlpha: 0, y: 34 });
      gsap.set([leftRef.current, rightRef.current], { x: 0, y: 0, force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=160%' : '+=270%',
          pin: panelRef.current,
          scrub: isMobile ? 1.3 : 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(mediaRef.current, isMobile
        ? { scale: 1, duration: 0.9, ease: 'none', force3D: true }
        : { scale: 1, duration: 0.74, ease: 'power2.out', force3D: true }, 0)
        .to([eyebrowRef.current, titleRef.current], { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' }, isMobile ? 0.58 : 0.86)
        .to(captionRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, isMobile ? 0.7 : 0.98)
        .to(leftRef.current, { x: isMobile ? '-7vw' : '-14vw', y: isMobile ? '-2vh' : '-4vh', duration: 0.4, ease: 'power1.inOut' }, isMobile ? 0.82 : 1.1)
        .to(rightRef.current, { x: isMobile ? '7vw' : '14vw', y: isMobile ? '2vh' : '4vh', duration: 0.4, ease: 'power1.inOut' }, isMobile ? 0.82 : 1.1)
        .to([eyebrowRef.current, titleRef.current, captionRef.current], { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.inOut' }, isMobile ? 1.36 : 1.62)
        .to({}, { duration: isMobile ? 0.26 : 0.56 });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-background-main)]">
      <div ref={panelRef} className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden md:h-screen">
        <div ref={mediaRef} className="absolute inset-0 origin-center overflow-hidden will-change-transform transform-gpu">
          {MEDIA.map((media) => (
            <div key={media.src} className="absolute inset-0">
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes="100vw"
                priority
                className="object-cover"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          ))}
          <div aria-hidden className="absolute inset-0 bg-[rgba(16,26,18,0.46)]" />
        </div>

        <span ref={eyebrowRef} className="text-mono absolute top-7 left-1/2 z-10 -translate-x-1/2 text-center text-white/75 md:top-10">
          {t('eyebrow')}
        </span>

        <h2 ref={titleRef} className="font-display relative z-10 flex flex-col items-center gap-0 px-5 text-center text-[clamp(2rem,10vw,3.2rem)] leading-[0.92] text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.45)] md:flex-row md:gap-[0.3em] md:px-0 md:text-left md:whitespace-nowrap md:text-[clamp(2.4rem,8.5vw,7.5rem)] md:leading-none">
          <span ref={leftRef} className="block">{t('titleLeft')}</span>
          <span ref={rightRef} className="block italic text-[var(--color-accent-sage)]">{t('titleRight')}</span>
        </h2>

        <p
          ref={captionRef}
          className="absolute bottom-7 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-6 text-center text-sm leading-relaxed text-white/80 md:bottom-16 md:text-base"
        >
          {t('caption')}
        </p>
      </div>
    </section>
  );
}