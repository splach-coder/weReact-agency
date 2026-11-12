'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { buildWaMeLink, COUNTRY_CODES, normalizeWhatsAppNumber } from '@/lib/whatsapp-link';

type GeneratorCopy = {
  country: string;
  number: string;
  numberHint: string;
  message: string;
  messagePlaceholder: string;
  result: string;
  empty: string;
  copyLink: string;
  copied: string;
  test: string;
  qrTitle: string;
  qrNote: string;
  downloadPng: string;
  downloadSvg: string;
  htmlTitle: string;
  copyHtml: string;
  buttonLabel: string;
  warnings: Record<'tooShort' | 'tooLong' | 'moroccoLength' | 'moroccoPrefix', string>;
};

const COPY: Record<'en' | 'fr', GeneratorCopy> = {
  fr: {
    country: 'Indicatif du pays',
    number: 'Numéro WhatsApp',
    numberHint: 'Tapez le numéro comme vous le donnez d’habitude, par exemple 06 12 34 56 78. Un numéro commençant par + ou 00 est lu tel quel.',
    message: 'Message pré-rempli (facultatif)',
    messagePlaceholder: 'Bonjour, je souhaite un devis pour…',
    result: 'Votre lien',
    empty: 'Entrez un numéro pour obtenir le lien.',
    copyLink: 'Copier le lien',
    copied: 'Copié',
    test: 'Tester le lien',
    qrTitle: 'QR code',
    qrNote: 'À imprimer sur une carte, un menu, une vitrine ou dans un véhicule : on le scanne avec l’appareil photo du téléphone.',
    downloadPng: 'Télécharger en PNG',
    downloadSvg: 'Télécharger en SVG',
    htmlTitle: 'Code du bouton pour votre site',
    copyHtml: 'Copier le code',
    buttonLabel: 'Écrire sur WhatsApp',
    warnings: {
      tooShort: 'Ce numéro semble trop court pour un numéro international.',
      tooLong: 'Ce numéro semble trop long : un numéro international compte au plus 15 chiffres.',
      moroccoLength: 'Un numéro marocain compte 9 chiffres après le 212 (10 chiffres avec le 0 en national).',
      moroccoPrefix: 'Les numéros mobiles marocains commencent par 6 ou 7 après le 212. Vérifiez que WhatsApp est bien installé sur ce numéro.',
    },
  },
  en: {
    country: 'Country code',
    number: 'WhatsApp number',
    numberHint: 'Type the number the way you usually give it, for example 06 12 34 56 78. A number starting with + or 00 is read as it is.',
    message: 'Pre-filled message (optional)',
    messagePlaceholder: 'Hello, I would like a quote for…',
    result: 'Your link',
    empty: 'Enter a number to get the link.',
    copyLink: 'Copy link',
    copied: 'Copied',
    test: 'Test the link',
    qrTitle: 'QR code',
    qrNote: 'Print it on a card, a menu, a shop window or in a vehicle: people scan it with their phone camera.',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    htmlTitle: 'Button code for your website',
    copyHtml: 'Copy code',
    buttonLabel: 'Chat on WhatsApp',
    warnings: {
      tooShort: 'This number looks too short for an international number.',
      tooLong: 'This number looks too long: an international number has at most 15 digits.',
      moroccoLength: 'A Moroccan number has 9 digits after 212 (10 digits with the leading 0 when dialled nationally).',
      moroccoPrefix: 'Moroccan mobile numbers start with 6 or 7 after 212. Check that WhatsApp is installed on this number.',
    },
  },
};

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(href: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

const fieldClass =
  'mt-2 w-full rounded-lg border border-[rgba(58,90,64,0.24)] bg-white px-4 py-3 text-base text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(58,90,64,0.18)]';
const buttonClass =
  'inline-flex items-center gap-2 rounded-full border border-[rgba(58,90,64,0.28)] px-4 py-2 text-sm text-[var(--color-text-main)] transition hover:border-[var(--color-primary)] hover:bg-[rgba(58,90,64,0.06)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export function WhatsAppLinkGenerator({ locale }: { locale: string }) {
  const t = COPY[locale === 'fr' ? 'fr' : 'en'];
  const ids = { country: useId(), number: useId(), message: useId(), hint: useId() };
  const [country, setCountry] = useState('212');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState<'link' | 'html' | null>(null);
  const [qrSvg, setQrSvg] = useState('');
  const [qrPng, setQrPng] = useState('');

  const normalized = useMemo(() => normalizeWhatsAppNumber(number, country), [number, country]);
  const link = normalized.digits ? buildWaMeLink(normalized.digits, message) : '';
  const html = link
    ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${escapeHtml(t.buttonLabel)}</a>`
    : '';

  useEffect(() => {
    let cancelled = false;
    if (!link) {
      setQrSvg('');
      setQrPng('');
      return;
    }
    const timer = window.setTimeout(async () => {
      const QRCode = (await import('qrcode')).default;
      const options = { errorCorrectionLevel: 'M' as const, margin: 2, color: { dark: '#1f2a22', light: '#ffffff' } };
      const [svg, png] = await Promise.all([
        QRCode.toString(link, { ...options, type: 'svg' }),
        QRCode.toDataURL(link, { ...options, width: 1024 }),
      ]);
      if (!cancelled) {
        setQrSvg(svg);
        setQrPng(png);
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [link]);

  async function handleCopy(kind: 'link' | 'html') {
    const ok = await copyText(kind === 'link' ? link : html);
    if (!ok) return;
    setCopied(kind);
    trackEvent('tool_use', { tool: 'whatsapp_link', action: `copy_${kind}`, has_message: message ? 'yes' : 'no' });
    window.setTimeout(() => setCopied(null), 1800);
  }

  const warning = normalized.warning ? t.warnings[normalized.warning] : '';

  return (
    <div className="grid gap-10 rounded-2xl border border-[rgba(58,90,64,0.16)] bg-white p-6 md:p-10 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
      <form className="grid content-start gap-6" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-6 sm:grid-cols-[0.42fr_0.58fr]">
          <label htmlFor={ids.country} className="text-sm text-[var(--color-text-secondary)]">
            {t.country}
            <select id={ids.country} className={fieldClass} value={country} onChange={(event) => setCountry(event.target.value)}>
              {COUNTRY_CODES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {locale === 'fr' ? entry.fr : entry.en} (+{entry.code})
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={ids.number} className="text-sm text-[var(--color-text-secondary)]">
            {t.number}
            <input
              id={ids.number}
              className={fieldClass}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              value={number}
              aria-describedby={ids.hint}
              onChange={(event) => setNumber(event.target.value)}
            />
          </label>
        </div>
        <p id={ids.hint} className="-mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{t.numberHint}</p>
        <label htmlFor={ids.message} className="text-sm text-[var(--color-text-secondary)]">
          {t.message}
          <textarea
            id={ids.message}
            className={`${fieldClass} min-h-28 resize-y`}
            maxLength={1000}
            placeholder={t.messagePlaceholder}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>

        <div aria-live="polite">
          <p className="text-mono text-[var(--color-primary)]">{t.result}</p>
          {link ? (
            <p className="mt-3 break-all rounded-lg bg-[var(--color-background-main)] px-4 py-3 font-mono text-sm text-[var(--color-text-main)]">{link}</p>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{t.empty}</p>
          )}
          {warning && <p className="mt-3 text-sm leading-relaxed text-[#8a4b16]">{warning}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={buttonClass} disabled={!link} onClick={() => handleCopy('link')}>
              {copied === 'link' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied === 'link' ? t.copied : t.copyLink}
            </button>
            {link ? (
              <a
                className={buttonClass}
                href={link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => trackEvent('tool_use', { tool: 'whatsapp_link', action: 'test' })}
              >
                <ExternalLink size={16} aria-hidden="true" />
                {t.test}
              </a>
            ) : (
              <button type="button" className={buttonClass} disabled>
                <ExternalLink size={16} aria-hidden="true" />
                {t.test}
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-mono text-[var(--color-primary)]">{t.htmlTitle}</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[var(--color-background-main)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {html || '—'}
          </pre>
          <button type="button" className={`${buttonClass} mt-4`} disabled={!html} onClick={() => handleCopy('html')}>
            {copied === 'html' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied === 'html' ? t.copied : t.copyHtml}
          </button>
        </div>
      </form>

      <div className="grid content-start gap-4">
        <p className="text-mono text-[var(--color-primary)]">{t.qrTitle}</p>
        <div className="flex aspect-square w-full max-w-[320px] items-center justify-center rounded-xl border border-[rgba(58,90,64,0.16)] bg-white p-3">
          {qrSvg ? (
            <div
              className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
              role="img"
              aria-label={`${t.qrTitle}: ${link}`}
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : (
            <span className="px-6 text-center text-sm text-[var(--color-text-muted)]">{t.empty}</span>
          )}
        </div>
        <p className="max-w-[320px] text-sm leading-relaxed text-[var(--color-text-muted)]">{t.qrNote}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={buttonClass}
            disabled={!qrPng}
            onClick={() => {
              downloadFile(qrPng, `whatsapp-${normalized.digits}.png`);
              trackEvent('tool_use', { tool: 'whatsapp_link', action: 'download_png' });
            }}
          >
            <Download size={16} aria-hidden="true" />
            {t.downloadPng}
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={!qrSvg}
            onClick={() => {
              const url = URL.createObjectURL(new Blob([qrSvg], { type: 'image/svg+xml' }));
              downloadFile(url, `whatsapp-${normalized.digits}.svg`);
              window.setTimeout(() => URL.revokeObjectURL(url), 1000);
              trackEvent('tool_use', { tool: 'whatsapp_link', action: 'download_svg' });
            }}
          >
            <Download size={16} aria-hidden="true" />
            {t.downloadSvg}
          </button>
        </div>
      </div>
    </div>
  );
}
