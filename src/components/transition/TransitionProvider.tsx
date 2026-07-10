'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import gsap from 'gsap';
import { usePathname } from '@/i18n/navigation';
import { scrollToTop } from '@/lib/lenis';
import { CURTAIN, CURTAIN_VIEWBOX } from './curtain';

// Layout effect on the client, plain effect on the server (avoids SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Page-transition curtain — port of SOTD `Page.js` show()/hide() + `index.js`
 * onChange, adapted to the Next App Router.
 *
 * Flow: a TransitionLink awaits `cover()` (Atlas-Green sheet drops down with a
 * curved leading edge) BEFORE calling router.push. When the pathname then
 * changes, this overlay resets scroll to the top and plays the reveal (sheet
 * arcs up and away). Honors prefers-reduced-motion with an instant cut.
 */

type TransitionContextValue = {
  /** Drop the curtain to fully cover the screen. Resolves when covered. */
  cover: () => Promise<void>;
  /** Lift the curtain away from a fully covered state. Resolves when revealed. */
  reveal: () => Promise<void>;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  // Safe no-op fallback if a link is rendered outside the provider.
  return ctx ?? { cover: async () => {}, reveal: async () => {} };
}

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const pathRef = useRef<SVGPathElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const firstRender = useRef(true);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const setOverlayInteractive = (on: boolean) => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = on ? 'auto' : 'none';
  };

  // Drop the curtain to fully cover the screen, then resolve. Awaited by
  // TransitionLink so the outgoing page is hidden before router.push.
  const cover = useCallback(() => {
    return new Promise<void>((resolve) => {
      setOverlayInteractive(true);

      if (reduceRef.current || !pathRef.current) {
        gsap.set(pathRef.current, { attr: { d: CURTAIN.FULL } });
        resolve();
        return;
      }

      gsap
        .timeline({ onComplete: resolve })
        .set(pathRef.current, { attr: { d: CURTAIN.GONE } })
        .to(pathRef.current, { attr: { d: CURTAIN.COVER_CURVE }, duration: 0.5, ease: 'power2.in' })
        .to(pathRef.current, { attr: { d: CURTAIN.FULL }, duration: 0.35, ease: 'power2.out' });
    });
  }, []);

  const reveal = useCallback(() => {
    return new Promise<void>((resolve) => {
      scrollToTop(true);

      if (reduceRef.current || !pathRef.current) {
        gsap.set(pathRef.current, { attr: { d: CURTAIN.GONE } });
        setOverlayInteractive(false);
        resolve();
        return;
      }

      gsap
        .timeline({
          onComplete: () => {
            setOverlayInteractive(false);
            resolve();
          },
        })
        .set(pathRef.current, { attr: { d: CURTAIN.FULL } })
        .to(pathRef.current, { attr: { d: CURTAIN.REVEAL_CURVE }, duration: 0.45, ease: 'power2.in' })
        .to(pathRef.current, { attr: { d: CURTAIN.GONE }, duration: 0.4, ease: 'power2.out' });
    });
  }, []);

  // Reveal on EVERY route change — uniform across primary links, header,
  // mobile menu and back/forward, with no per-link wiring. For covered
  // navigations the sheet is already FULL; for the rest we snap it to FULL
  // before paint (layout effect) so the new page wipes in rather than flashing.
  useIsoLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    void reveal();
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ cover, reveal }}>
      {children}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[110]"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={CURTAIN_VIEWBOX}
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            data-page-transition-curtain
            d={CURTAIN.GONE}
            fill="var(--color-primary)"
          />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}
