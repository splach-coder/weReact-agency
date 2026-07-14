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

  if (!TAG_IDS.length) return null;

  const primaryTagId = TAG_IDS[0];
  const configLines = TAG_IDS.map((id) =>
    id.startsWith('AW-')
      ? `window.gtag('config', '${id}', { send_page_view: false, allow_enhanced_conversions: true });`
      : `window.gtag('config', '${id}', { send_page_view: false });`
  ).join('\n');

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`}
        strategy="afterInteractive"
      />
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