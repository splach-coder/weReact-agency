import type Lenis from 'lenis';

/**
 * Module-level singleton for the active Lenis instance.
 *
 * SmoothScroll creates Lenis once on mount and registers it here so other
 * client code (notably the page-transition overlay) can drive the scroller —
 * e.g. snap to the top instantly after a route swap — without prop-drilling or
 * a context provider. Returns null when smooth scroll is disabled
 * (prefers-reduced-motion) or before the provider has mounted.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Jump to the top of the page. Uses Lenis when active, else native scroll. */
export function scrollToTop(immediate = true) {
  if (instance) {
    instance.scrollTo(0, { immediate });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }
}
