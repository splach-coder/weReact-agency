'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { captureAttribution, trackPageView } from '@/lib/analytics';

// `||` (not `??`) so an empty-string env var still falls back to the live
// production tag ids instead of silently disabling tracking.
const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim() || 'G-0HRPEYEZXY';
const GOOGLE_ADS_ID = (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '').trim() || 'AW-18245192967';
const TAG_IDS = [GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean) as string[];

// gtag.js (~350 KB with the Ads tag it pulls in) is not needed to render the
// page, so it is fetched on the visitor's first interaction, or a few seconds
// after the load event when nobody interacts. Every gtag() call made before
// that (consent defaults, config, page_view, events) waits in window.dataLayer
// and is replayed in order once the library arrives, so nothing is dropped.
const GTAG_IDLE_DELAY_MS = 3500;
const GTAG_INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;
// Paid clicks must reach the Ads conversion linker straight away.
const PAID_CLICK_PATTERN = /(?:^|[?&])(gclid|gbraid|wbraid|gad_source|utm_[a-z]+)=/;

function loadGoogleTagLibrary(tagId: string) {
  const src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

export default function GoogleTag() {
  const pathname = usePathname();
  const skippedInitialView = useRef(false);

  useEffect(() => {
    captureAttribution();

    if (!skippedInitialView.current) {
      skippedInitialView.current = true;
      return;
    }

    trackPageView(window.location.href);
  }, [pathname]);

  useEffect(() => {
    const tagId = TAG_IDS[0];
    if (!tagId) return;

    let timer = 0;
    const listenerOptions = { passive: true, capture: true } as const;

    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', scheduleIdleLoad);
      GTAG_INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, load, listenerOptions));
    };
    function load() {
      cleanup();
      loadGoogleTagLibrary(tagId);
    }
    function scheduleIdleLoad() {
      timer = window.setTimeout(load, PAID_CLICK_PATTERN.test(window.location.search) ? 0 : GTAG_IDLE_DELAY_MS);
    }

    GTAG_INTERACTION_EVENTS.forEach((type) => window.addEventListener(type, load, listenerOptions));
    if (document.readyState === 'complete') scheduleIdleLoad();
    else window.addEventListener('load', scheduleIdleLoad);

    return cleanup;
  }, []);

  if (!TAG_IDS.length) return null;

  const configLines = TAG_IDS.map((id) =>
    id.startsWith('AW-')
      ? `window.gtag('config', '${id}', { send_page_view: false, allow_enhanced_conversions: true });`
      : `window.gtag('config', '${id}', { send_page_view: false });`
  ).join('\n');

  return (
    <>
      <Script
        id="wereact-google-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('set', 'url_passthrough', true);
            ${configLines}
            window.gtag('event', 'page_view', {
              page_location: window.location.href,
              page_path: window.location.pathname,
              page_title: document.title
            });
          `,
        }}
      />
    </>
  );
}