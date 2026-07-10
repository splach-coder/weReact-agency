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

    const ctx = gsap.context(() => {
      gsap.set(mediaRef.current, { scale: 0.001, transformOrigin: '50% 50%', force3D: true });
      gsap.set([eyebrowRef.current, titleRef.current, captionRef.current], { autoAlpha: 0, y: 34 });
      gsap.set([leftRef.current, rightRef.current], { x: 0, y: 0, force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=270%',
          pin: panelRef.current,
          scrub: 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(mediaRef.current, { scale: 1, duration: 0.74, ease: 'power2.out', force3D: true }, 0)
        .to([eyebrowRef.current, titleRef.current], { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.86)
        .to(captionRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.98)
        .to(leftRef.current, { x: '-14vw', y: '-4vh', duration: 0.46, ease: 'power1.inOut' }, 1.1)
        .to(rightRef.current, { x: '14vw', y: '4vh', duration: 0.46, ease: 'power1.inOut' }, 1.1)
        .to([eyebrowRef.current, titleRef.current, captionRef.current], { autoAlpha: 0, y: -20, duration: 0.32, ease: 'power2.inOut' }, 1.62)
        .to({}, { duration: 0.56 });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[var(--color-background-main)]">
      <div ref={panelRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
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

        <span ref={eyebrowRef} className="text-mono absolute top-10 left-1/2 z-10 -translate-x-1/2 text-white/75">
          {t('eyebrow')}
        </span>

        <h2 ref={titleRef} className="font-display relative z-10 flex items-center gap-[0.3em] whitespace-nowrap text-[clamp(2.4rem,8.5vw,7.5rem)] leading-none text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.45)]">
          <span ref={leftRef} className="block">{t('titleLeft')}</span>
          <span ref={rightRef} className="block italic text-[var(--color-accent-sage)]">{t('titleRight')}</span>
        </h2>

        <p
          ref={captionRef}
          className="absolute bottom-16 left-1/2 z-10 max-w-md -translate-x-1/2 px-6 text-center text-base font-light text-white/80"
        >
          {t('caption')}
        </p>
      </div>
    </section>
  );
}