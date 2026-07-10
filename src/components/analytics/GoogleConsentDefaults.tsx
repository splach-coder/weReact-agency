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
            window.gtag('consent', 'default', choice === 'accepted' ? ${acceptedState} : ${deniedState});
          })();
        `,
      }}
    />
  );
}