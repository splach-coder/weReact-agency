import { CONSENT_STORAGE_KEY, getConsentState } from '@/lib/consent';

const acceptedState = JSON.stringify(getConsentState('accepted'));
const deniedState = JSON.stringify(getConsentState('rejected'));

export default function GoogleConsentDefaults() {
  return (
    <script
      id="wereact-consent-defaults"
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            var choice = null;
            try {
              choice = window.localStorage.getItem('${CONSENT_STORAGE_KEY}');
            } catch {}

            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
            // Morocco-focused audience: default to granted (banner still lets visitors opt out).
            window.gtag('consent', 'default', choice === 'rejected' ? ${deniedState} : ${acceptedState});
          })();
        `,
      }}
    />
  );
}