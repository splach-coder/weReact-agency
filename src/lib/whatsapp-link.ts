/**
 * wa.me click-to-chat links, as documented by WhatsApp: the full number in
 * international format (country code, no "+", no leading trunk "0", no spaces
 * or dashes), optionally followed by ?text= and a URL-encoded message.
 * https://faq.whatsapp.com/5913398998672934
 */

export const COUNTRY_CODES = [
  { code: '212', fr: 'Maroc', en: 'Morocco' },
  { code: '33', fr: 'France', en: 'France' },
  { code: '34', fr: 'Espagne', en: 'Spain' },
  { code: '32', fr: 'Belgique', en: 'Belgium' },
  { code: '41', fr: 'Suisse', en: 'Switzerland' },
  { code: '49', fr: 'Allemagne', en: 'Germany' },
  { code: '39', fr: 'Italie', en: 'Italy' },
  { code: '31', fr: 'Pays-Bas', en: 'Netherlands' },
  { code: '44', fr: 'Royaume-Uni', en: 'United Kingdom' },
  { code: '1', fr: 'États-Unis / Canada', en: 'United States / Canada' },
  { code: '971', fr: 'Émirats arabes unis', en: 'United Arab Emirates' },
  { code: '966', fr: 'Arabie saoudite', en: 'Saudi Arabia' },
  { code: '974', fr: 'Qatar', en: 'Qatar' },
  { code: '213', fr: 'Algérie', en: 'Algeria' },
  { code: '216', fr: 'Tunisie', en: 'Tunisia' },
  { code: '222', fr: 'Mauritanie', en: 'Mauritania' },
  { code: '221', fr: 'Sénégal', en: 'Senegal' },
  { code: '225', fr: 'Côte d’Ivoire', en: 'Côte d’Ivoire' },
] as const;

/** Countries whose international numbers keep the leading 0 (Italian landlines). */
const KEEPS_LEADING_ZERO = new Set(['39']);

export type WhatsAppNumberWarning = 'tooShort' | 'tooLong' | 'moroccoLength' | 'moroccoPrefix';

export type NormalizedWhatsAppNumber = {
  /** Digits only, international format, or '' when nothing usable was typed. */
  digits: string;
  warning?: WhatsAppNumberWarning;
};

/**
 * Turns a number typed the way people write it ("06 12 34 56 78",
 * "+212 6 12 34 56 78", "00212612345678") into wa.me digits.
 */
export function normalizeWhatsAppNumber(raw: string, countryCode: string): NormalizedWhatsAppNumber {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return { digits: '' };

  if (trimmed.startsWith('+')) {
    // Already international.
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith(countryCode) && digits.length >= countryCode.length + 8 && !digits.startsWith('0')) {
    // Typed with the country code but without "+".
  } else {
    const national = KEEPS_LEADING_ZERO.has(countryCode) ? digits : digits.replace(/^0+/, '');
    digits = countryCode + national;
  }

  return { digits, warning: getWarning(digits) };
}

function getWarning(digits: string): WhatsAppNumberWarning | undefined {
  if (digits.startsWith('212')) {
    const rest = digits.slice(3);
    if (rest.length !== 9) return 'moroccoLength';
    if (!/^[67]/.test(rest)) return 'moroccoPrefix';
    return undefined;
  }
  if (digits.length < 8) return 'tooShort';
  if (digits.length > 15) return 'tooLong';
  return undefined;
}

export function buildWaMeLink(digits: string, message = '') {
  const base = `https://wa.me/${digits}`;
  return message.trim() ? `${base}?text=${encodeURIComponent(message)}` : base;
}
