const WHATSAPP_PHONE = '212602258009';

const PREFILL: Record<string, string> = {
  en: 'Hello WeReact, I am interested in a website for my business. Can we talk?',
  fr: "Bonjour WeReact, je suis intéressé(e) par un site web pour mon activité. Pouvons-nous en parler ?",
};

/**
 * Locale-aware WhatsApp deep link so French visitors start the conversation
 * in French (message match matters at the hand-off moment for ad traffic).
 * Optional context (page/service) is appended so leads arrive pre-qualified.
 */
export function buildWhatsAppLink(locale: string, context?: string) {
  const message = PREFILL[locale] ?? PREFILL.en;
  const text = context ? `${message} — ${context}` : message;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
