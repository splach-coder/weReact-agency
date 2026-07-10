'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Settings2, X } from 'lucide-react';
import {
  CONSENT_STORAGE_KEY,
  getConsentState,
  OPEN_CONSENT_PREFERENCES_EVENT,
  parseConsentChoice,
  type ConsentChoice,
} from '@/lib/consent';

type CookieConsentProps = {
  locale: string;
};

const copy = {
  en: {
    title: 'Your privacy, your choice',
    description: 'We use analytics and advertising cookies to understand what brings clients to WeReact. You can allow them or continue with essential site features only.',
    essential: 'Essential only',
    accept: 'Accept analytics & ads',
  },
  fr: {
    title: 'Votre vie privee, votre choix',
    description: 'Nous utilisons des cookies d analyse et de publicite pour comprendre ce qui amene des clients vers WeReact. Vous pouvez les accepter ou continuer avec les fonctions essentielles uniquement.',
    essential: 'Fonctions essentielles',
    accept: 'Accepter analyse et pub',
  },
} as const;

function readConsentChoice() {
  try {
    return parseConsentChoice(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export default function CookieConsent({ locale }: CookieConsentProps) {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const content = locale === 'fr' ? copy.fr : copy.en;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsOpen(!readConsentChoice());
      setIsReady(true);
    });
    const openPreferences = () => setIsOpen(true);
    window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, openPreferences);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  function saveConsent(choice: ConsentChoice) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Consent still applies for this visit when browser storage is unavailable.
    }

    window.gtag?.('consent', 'update', getConsentState(choice));
    setIsOpen(false);
  }

  if (!isReady) return null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          aria-labelledby="cookie-consent-title"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[130] border border-[color:rgba(58,90,64,0.24)] bg-[var(--color-background-main)] p-5 text-[var(--color-text-main)] shadow-[0_18px_50px_rgba(46,72,51,0.2)] sm:left-auto sm:right-6 sm:w-[26rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex items-start justify-between gap-6">
            <div>
              <span className="text-mono block text-[10px] text-[var(--color-primary-light)]">01 / PRIVACY</span>
              <h2 id="cookie-consent-title" className="mt-2 font-display text-2xl leading-none text-[var(--color-primary-dark)]">
                {content.title}
              </h2>
            </div>
            <Settings2 aria-hidden="true" size={19} className="mt-1 shrink-0 text-[var(--color-primary)]" />
          </div>

          <p className="max-w-[38ch] text-sm leading-6 text-[var(--color-text-secondary)]">{content.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => saveConsent('rejected')}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:rgba(58,90,64,0.38)] px-3 py-2 text-mono text-[10px] text-[var(--color-primary-dark)] transition-colors hover:bg-[color:rgba(58,90,64,0.07)]"
            >
              <X aria-hidden="true" size={14} />
              {content.essential}
            </button>
            <button
              type="button"
              onClick={() => saveConsent('accepted')}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--color-primary)] px-3 py-2 text-mono text-[10px] text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              <Check aria-hidden="true" size={14} />
              {content.accept}
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}