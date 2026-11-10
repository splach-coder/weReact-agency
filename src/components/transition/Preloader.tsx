'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CURTAIN, CURTAIN_VIEWBOX } from './curtain';
import { PRELOADER_COMPLETE_EVENT, PRELOADER_LIFT_EVENT } from '@/lib/events';
import {
  PRELOADER_FAILSAFE_MS,
  PRELOADER_PAID_CLICK_SOURCE,
  PRELOADER_SESSION_KEY,
} from './preloader-config';

const PAID_CLICK_PATTERN = new RegExp(PRELOADER_PAID_CLICK_SOURCE);

function announcePreloaderComplete() {
  document.documentElement.dataset.wereactPreloaderComplete = 'true';
  window.dispatchEvent(new Event(PRELOADER_COMPLETE_EVENT));
}

/** The sheet is about to lift: whatever sits under it becomes visible now. */
function announcePreloaderLift() {
  document.documentElement.dataset.wereactPreloaderLift = 'true';
  window.dispatchEvent(new Event(PRELOADER_LIFT_EVENT));
}

function markSessionPreloaded() {
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, '1');
  } catch {
    // Storage can be blocked; the curtain then simply replays next load.
  }
}
/**
 * First-load curtain — port of the SOTD `Preloader.js`. An Atlas-Green panel
 * with a live % counter that, once it reaches 100, plays the curve-morph
 * lift-out (number wipes up, the green sheet's bottom edge arcs up and the
 * whole sheet slides away to reveal the page).
 *
 * Runs ONCE per browser session (sessionStorage flag) so in-site navigation
 * isn't gated behind it. Honors prefers-reduced-motion (renders nothing).
 *
 * The sheet is server-rendered and shown by CSS as soon as the inline boot
 * script (PreloaderBoot) flags the load, so it covers the page from the very
 * first paint instead of dropping in after hydration; this component then
 * takes it over and plays the counter + lift-out.
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
    const root = document.documentElement;
    // Paid ad clicks (gclid/gbraid/wbraid/utm_*) skip the curtain entirely —
    // paid visitors must reach the page instantly, not wait behind a ~3s
    // scroll-locked loader they already paid to bypass.
    const paidClick = PAID_CLICK_PATTERN.test(window.location.search);

    // The boot script made this call before first paint; follow it so the
    // server-rendered sheet and this component always agree.
    let show = root.dataset.wereactPreloader === 'on';
    if (root.dataset.wereactPreloader === undefined) {
      let seen: string | null = '1';
      try {
        seen = sessionStorage.getItem(PRELOADER_SESSION_KEY);
      } catch {
        // Storage blocked: skip the curtain.
      }
      show = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !seen && !paidClick;
    }
    // CSS already faded the sheet out because this script took too long to
    // arrive; do not bring it back over a page the visitor is already reading.
    if (show && performance.now() > PRELOADER_FAILSAFE_MS) show = false;

    if (!show) {
      // Still mark the session so later organic navigation doesn't replay it.
      if (paidClick || root.dataset.wereactPreloader === 'on') markSessionPreloaded();
      if (root.dataset.wereactPreloader === 'on') root.dataset.wereactPreloader = 'skip';
      frame = window.requestAnimationFrame(() => {
        announcePreloaderComplete();
        setActive(false);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    root.dataset.wereactPreloader = 'on';
    markSessionPreloaded();
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
      tl.call(announcePreloaderLift);
      tl.to(numberRef.current, { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power2.in' });
      tl.to(pathRef.current, { attr: { d: CURTAIN.REVEAL_CURVE }, duration: 0.5, ease: 'power2.in' }, '-=0.2');
      tl.to(pathRef.current, { attr: { d: CURTAIN.GONE }, duration: 0.4, ease: 'power2.out' });
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
      tl.call(() => {
        document.documentElement.style.overflow = '';
        document.documentElement.dataset.wereactPreloader = 'done';
        setActive(false);
        window.requestAnimationFrame(announcePreloaderComplete);
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
    };
  }, [active]);

  if (active === false) return null;

  // `preloader-root` (globals.css) keeps this hidden unless the boot script
  // flagged the load ("on") or the component has taken over (data-active).
  return (
    <div
      ref={rootRef}
      className="preloader-root fixed inset-0 z-[120] items-center justify-center"
      data-active={active ? 'true' : undefined}
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
