'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { buildCalBookingUrl, buildCalConfig, getCalCopy } from '@/lib/cal';
import { getStoredAttribution, trackContactIntent, trackLead } from '@/lib/analytics';

const CAL_EMBED_SRC = 'https://app.cal.com/embed/embed.js';
// Start loading the inline calendar this far before it enters the viewport.
const CAL_PRELOAD_MARGIN = '1000px 0px';

// Cal's embed sizes its iframe from inline styles; without this the calendar
// can render collapsed or hidden inside our grid.
const CAL_EMBED_FIX_CSS = `
cal-inline,cal-inline>*{display:block;width:100%;height:100%;min-height:inherit}
cal-inline iframe,cal-modal-box iframe,iframe[src*="app.cal.com"]{
  visibility:visible!important;height:100%!important;width:100%!important;min-height:640px!important
}
`;

type CalApi = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[][];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/** Loads the Cal.com embed script once and resolves with the queueing `Cal` function. */
function loadCal() {
  return new Promise<CalApi>((resolve, reject) => {
    if (!document.getElementById('cal-embed-fix')) {
      const style = document.createElement('style');
      style.id = 'cal-embed-fix';
      style.textContent = CAL_EMBED_FIX_CSS;
      document.head.appendChild(style);
    }

    const existingScript = document.querySelector(`script[src="${CAL_EMBED_SRC}"]`);

    if (!window.Cal) {
      const cal: CalApi = function (...args: unknown[]) {
        const api = window.Cal;
        if (!api) return;
        if (!api.loaded) {
          api.ns = api.ns ?? {};
          api.q = api.q ?? [];
          api.q.push(args);
          return;
        }
        api(...args);
      };
      cal.ns = {};
      cal.q = [];
      window.Cal = cal;
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = CAL_EMBED_SRC;
      script.async = true;
      script.addEventListener('error', () => reject(new Error('Cal embed failed to load')), { once: true });
      document.head.appendChild(script);
    }

    if (window.Cal) resolve(window.Cal);
    else reject(new Error('Cal embed unavailable'));
  });
}

/** Reports a completed booking as a lead, tagged with the page it came from. */
function useCalBookingTracking(cal: CalApi | null, source: string) {
  useEffect(() => {
    if (!cal) return;
    const callback = () => {
      trackLead('cal_booking', { page: source, location: 'cal_embed' });
    };
    cal('on', { action: 'bookingSuccessful', callback });
    // `Cal` is a page-wide singleton: remove the listener on unmount so a later
    // embed on another page cannot report the same booking twice.
    return () => cal('off', { action: 'bookingSuccessful', callback });
  }, [cal, source]);
}

type CalProps = {
  source: string;
  locale: string;
};

/** Inline Cal.com calendar. Falls back to a link to the hosted booking page if the embed never renders. */
export function CalInline({ source, locale }: CalProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [cal, setCal] = useState<CalApi | null>(null);
  const [failed, setFailed] = useState(false);
  // The embed (script + iframe, ~1 MB) only starts loading once the calendar is
  // about to scroll into view, so it never competes with the first render.
  const [nearViewport, setNearViewport] = useState(false);
  const copy = getCalCopy(locale);
  const calLink = siteConfig.business.calLink;

  useCalBookingTracking(cal, source);

  useEffect(() => {
    if (!container || nearViewport) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setNearViewport(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNearViewport(true);
      },
      { rootMargin: CAL_PRELOAD_MARGIN },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [container, nearViewport]);

  useEffect(() => {
    if (!calLink || !container || !nearViewport) return;
    let cancelled = false;

    loadCal()
      .then((api) => {
        if (cancelled) return;
        api('inline', {
          elementOrSelector: container,
          calLink,
          config: buildCalConfig(getStoredAttribution(), locale),
        });
        api('ui', { hideEventTypeDetails: true, layout: 'month_view' });
        // `api` is itself a function: pass an updater so React stores it instead of calling it.
        setCal(() => api);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    const timeout = window.setTimeout(() => {
      if (!cancelled && container.childElementCount === 0) setFailed(true);
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [calLink, locale, container, nearViewport]);

  if (!calLink) return null;

  if (failed) {
    return (
      <a
        href={buildCalBookingUrl(siteConfig.business.calBookingUrl, getStoredAttribution())}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContactIntent('cal_fallback_link', { page: source })}
        className="inline-flex min-h-12 items-center gap-3 bg-[var(--color-primary)] px-6 py-4 text-mono text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        {copy.fallback}
      </a>
    );
  }

  return <div ref={setContainer} className="min-h-[760px] w-full md:min-h-[680px]" aria-label={copy.heading} />;
}

/** Button that opens the Cal.com booking modal; opens the hosted page in a new tab if the embed fails. */
export function CalButton({ source, locale, className }: CalProps & { className?: string }) {
  const [cal, setCal] = useState<CalApi | null>(null);
  const [loading, setLoading] = useState(false);
  const copy = getCalCopy(locale);
  const calLink = siteConfig.business.calLink;

  useCalBookingTracking(cal, source);

  if (!calLink) return null;

  const openCal = async () => {
    if (loading) return;
    setLoading(true);
    trackContactIntent('cal_open', { page: source });

    try {
      const api = await loadCal();
      // `api` is itself a function: pass an updater so React stores it instead of calling it.
      setCal(() => api);
      api('modal', { calLink, config: buildCalConfig(getStoredAttribution(), locale) });
    } catch {
      window.open(
        buildCalBookingUrl(siteConfig.business.calBookingUrl, getStoredAttribution()),
        '_blank',
        'noopener,noreferrer',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={openCal}
      disabled={loading}
      className={
        className ??
        'inline-flex min-h-12 items-center gap-3 border border-[rgba(58,90,64,0.28)] px-6 py-4 text-mono text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-white disabled:opacity-60'
      }
    >
      {copy.cta}
    </button>
  );
}
