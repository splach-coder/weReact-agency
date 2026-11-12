/**
 * Free tools published on the site. Each tool has its own page under
 * /[locale]/outils/<slug>; this list feeds the XML and HTML sitemaps,
 * llms.txt and the link tests, so a new tool only needs an entry here
 * plus its page.
 */

export type ToolLocaleCopy = {
  /** Page title and H1. */
  title: string;
  description: string;
  /** One line for lists (HTML sitemap, llms.txt). */
  summary: string;
};

export type FreeTool = {
  slug: 'generateur-lien-whatsapp';
  primaryKeyword: string;
  keywords: readonly string[];
  modifiedAt: string;
  copy: Record<'en' | 'fr', ToolLocaleCopy>;
};

export const freeTools: readonly FreeTool[] = [
  {
    slug: 'generateur-lien-whatsapp',
    primaryKeyword: 'lien whatsapp',
    keywords: ['lien whatsapp', 'générateur lien whatsapp', 'créer lien whatsapp', 'wa me', 'lien whatsapp numéro', 'lien whatsapp business', 'qr code whatsapp', 'whatsapp link generator'],
    modifiedAt: '2026-11-12',
    copy: {
      en: {
        title: 'WhatsApp Link Generator (wa.me) with QR Code',
        description: 'Free WhatsApp link generator: turn your number into a wa.me link with a pre-filled message and a QR code, for your website, Instagram bio or printed cards.',
        summary: 'Free wa.me link and QR code generator for a WhatsApp number, with a pre-filled message. Runs in the browser, nothing is stored.',
      },
      fr: {
        title: 'Générateur de lien WhatsApp (wa.me) et QR code',
        description: 'Générateur de lien WhatsApp gratuit : votre numéro en lien wa.me avec message pré-rempli et QR code, pour votre site, votre bio Instagram ou vos cartes.',
        summary: 'Générateur gratuit de lien wa.me et de QR code vers un numéro WhatsApp, avec message pré-rempli. Fonctionne dans le navigateur, rien n’est enregistré.',
      },
    },
  },
];

export function getFreeTool(slug: string) {
  return freeTools.find((tool) => tool.slug === slug);
}
