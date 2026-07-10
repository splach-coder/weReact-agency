'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from '@/lib/lenis';

/**
 * Global smooth-scroll provider (Lenis) — the inertia/momentum scrolling that
 * gives premium sites their feel. Disabled when the user prefers reduced motion.
 *
 * Lenis is bridged to GSAP the canonical way: GSAP's ticker drives Lenis' RAF
 * loop, and every Lenis scroll event pumps ScrollTrigger.update(). This is what
 * lets pinned/scrubbed ScrollTrigger sections (e.g. the ScrollReel) stay in
 * perfect sync with the smoothed scroll position. The instance is published to
 * a module singleton (`@/lib/lenis`) so the page-transition overlay can reset
 * scroll on navigation.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
