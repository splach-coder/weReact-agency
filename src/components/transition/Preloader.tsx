'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CURTAIN, CURTAIN_VIEWBOX } from './curtain';

const SESSION_KEY = 'wereact_preloaded';

/**
 * First-load curtain — port of the SOTD `Preloader.js`. An Atlas-Green panel
 * with a live % counter that, once it reaches 100, plays the curve-morph
 * lift-out (number wipes up, the green sheet's bottom edge arcs up and the
 * whole sheet slides away to reveal the page).
 *
 * Runs ONCE per browser session (sessionStorage flag) so in-site navigation
 * isn't gated behind it. Honors prefers-reduced-motion (renders nothing).
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState<boolean | null>(null);

  // Decide on mount whether to show at all (client-only checks).
  useEffect(() => {
    let frame = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = sessionStorage.getItem(SESSION_KEY);

    if (reduce || seen) {
      frame = window.requestAnimationFrame(() => setActive(false));
      return () => window.cancelAnimationFrame(frame);
    }

    sessionStorage.setItem(SESSION_KEY, '1');
    // Lock scroll while the loader is up.
    document.documentElement.style.overflow = 'hidden';
    frame = window.requestAnimationFrame(() => setActive(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!active) return;

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Count 0 → 100 with a deliberate minimum duration so it always reads.
      tl.to(counter, {
        v: 100,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => setCount(Math.round(counter.v)),
      });

      // Lift-out: number wipes up, then the green sheet arcs up and away.
      tl.to(numberRef.current, { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power2.in' });
      tl.to(pathRef.current, { attr: { d: CURTAIN.REVEAL_CURVE }, duration: 0.5, ease: 'power2.in' }, '-=0.2');
      tl.to(pathRef.current, { attr: { d: CURTAIN.GONE }, duration: 0.4, ease: 'power2.out' });
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
      tl.call(() => {
        document.documentElement.style.overflow = '';
        setActive(false);
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* The green sheet IS the morphing SVG path so the curved lift-out reads. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={CURTAIN_VIEWBOX}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={CURTAIN.FULL} fill="var(--color-primary)" />
      </svg>

      <div ref={numberRef} className="relative z-10 overflow-hidden">
        <span className="text-mono text-5xl font-medium tracking-tight text-[var(--color-background-main)] md:text-7xl">
          {count}
          <span className="text-[var(--color-accent-sage)]">%</span>
        </span>
      </div>
    </div>
  );
}
