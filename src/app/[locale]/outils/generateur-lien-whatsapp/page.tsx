import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { getFreeTool } from '@/data/tools';
import { WhatsAppLinkGenerator } from '@/components/tools/WhatsAppLinkGenerator';
import { GrowthContactCta } from '@/components/GrowthCtas';
import { ENTITY_IDS, createBreadcrumbJsonLd, createFaqJsonLd, createPageMetadata, createWebPageJsonLd } from '@/lib/seo';
import { renderInlineLinks } from '@/lib/inline-links';

const SLUG = 'generateur-lien-whatsapp';
const tool = getFreeTool(SLUG)!;
const WHATSAPP_HELP = 'https://faq.whatsapp.com/5913398998672934';

type Props = { params: Promise<{ locale: string }> };

type Section = { heading: string; paragraphs: readonly string[] };

const CONTENT: Record<'en' | 'fr', {
  eyebrow: string;
  lead: string;
  privacy: string;
  sections: readonly Section[];
  faqs: readonly { question: string; answer: string }[];
  ctaTitle: string;
  ctaText: string;
  cta: string;
  sourceLabel: string;
}> = {
  fr: {
    eyebrow: 'Outil gratuit',
    lead: 'Transformez votre numéro en lien wa.me, avec un message déjà écrit et un QR code, pour votre site, votre bio Instagram, votre fiche Google ou une carte imprimée.',
    privacy: 'Gratuit et sans inscription. Le lien et le QR code sont calculés dans votre navigateur : votre numéro n’est ni envoyé ni enregistré.',
    sections: [
      {
        heading: 'Comment le lien est construit',
        paragraphs: [
          'Un lien de discussion WhatsApp a la forme https://wa.me/ suivie du numéro complet au format international : l’indicatif du pays, sans le signe +, sans le 0 du numéro national, sans espaces ni tirets. C’est la règle publiée par WhatsApp dans sa page d’aide sur les liens clic vers WhatsApp.',
          'Au Maroc, 06 12 34 56 78 devient 212612345678, et le lien https://wa.me/212612345678. Le générateur fait cette conversion pour vous, que vous tapiez le numéro avec le 0, avec +212 ou avec 00212.',
          'Le message pré-rempli s’ajoute après ?text=, encodé pour le web : les espaces deviennent %20, les accents et la ponctuation sont convertis. La personne qui clique voit le message dans la zone de saisie et choisit de l’envoyer ou de le modifier ; rien ne part automatiquement.',
        ],
      },
      {
        heading: 'Où placer votre lien',
        paragraphs: [
          'Sur votre site, à côté de chaque prix et de chaque offre, avec un message qui nomme l’offre : « Bonjour, je souhaite réserver l’excursion dans la vallée de l’Ourika ». Vous savez tout de suite de quelle page vient la demande, et vous répondez plus vite.',
          'Dans votre bio Instagram et vos publications, dans vos publications Google Business, dans votre signature d’e-mail. Le QR code sert pour tout ce qui est imprimé : carte de visite, menu, vitrine, chambre de riad, véhicule de transport touristique.',
          'Un lien par usage vaut mieux qu’un seul pour tout : un message différent pour le site, Instagram et les cartes vous montre lequel apporte des clients.',
        ],
      },
      {
        heading: 'WhatsApp ou WhatsApp Business ?',
        paragraphs: [
          'Le même lien fonctionne avec les deux applications. WhatsApp Business, gratuite, ajoute un profil d’entreprise (adresse, horaires, site), un catalogue de produits ou de services, des réponses rapides et des messages d’absence, utiles quand les demandes arrivent le soir ou le week-end.',
          'Si vous recevez la plupart de vos clients par WhatsApp, le site doit les y amener sans friction : un bouton visible sur mobile, à côté de l’information que la personne vient de lire. C’est ce que nous plaçons sur chaque [site vitrine que nous créons au Maroc](/fr/website-design-moroccan-businesses), et sur chaque page d’activité des [sites d’agences de voyage](/fr/site-web-agence-de-voyage).',
        ],
      },
    ],
    faqs: [
      { question: 'Faut-il mettre le +212 dans le lien ?', answer: 'Non. Le lien contient l’indicatif 212 sans le signe +, et le 0 du numéro national disparaît : 06 12 34 56 78 devient 212612345678.' },
      { question: 'Le lien fonctionne-t-il avec WhatsApp Business ?', answer: 'Oui. Le format wa.me est le même pour WhatsApp et WhatsApp Business. Le lien ouvre une discussion avec le numéro, quelle que soit l’application installée dessus.' },
      { question: 'Le message pré-rempli est-il envoyé automatiquement ?', answer: 'Non. Il apparaît dans la zone de saisie de la personne qui clique, qui peut l’envoyer tel quel, le modifier ou l’effacer.' },
      { question: 'Mon numéro est-il enregistré ?', answer: 'Non. Le générateur fonctionne entièrement dans votre navigateur : le numéro et le message ne sont envoyés à aucun serveur.' },
      { question: 'Peut-on créer un lien vers un groupe WhatsApp ?', answer: 'Les liens d’invitation à un groupe se créent dans WhatsApp, depuis les informations du groupe, par un administrateur. Cet outil crée des liens vers un numéro.' },
      { question: 'Comment ajouter un bouton WhatsApp sur mon site ?', answer: 'Copiez le code du bouton généré plus haut et collez-le dans votre page, ou demandez-le à la personne qui gère votre site. Sur les sites que nous créons, le bouton est prévu dès la maquette, avec un message par page. [Voir notre création de site web au Maroc](/fr/website-design-moroccan-businesses).' },
    ],
    ctaTitle: 'Un site qui transforme les visites en conversations WhatsApp',
    ctaText: 'Nous créons des sites rapides sur mobile, avec le bon bouton WhatsApp à côté de chaque offre, à partir de 2 000 DH. Devis gratuit sous un jour ouvré.',
    cta: 'Demander un devis',
    sourceLabel: 'Source : WhatsApp, « Comment utiliser les liens clic vers WhatsApp »',
  },
  en: {
    eyebrow: 'Free tool',
    lead: 'Turn your number into a wa.me link, with a pre-filled message and a QR code, for your website, your Instagram bio, your Google listing or a printed card.',
    privacy: 'Free, no sign-up. The link and QR code are built in your browser: your number is not sent anywhere or stored.',
    sections: [
      {
        heading: 'How the link is built',
        paragraphs: [
          'A WhatsApp chat link is https://wa.me/ followed by the full number in international format: the country code, without the + sign, without the leading 0 of the national number, and without spaces or dashes. That is the rule WhatsApp publishes in its help page on click to chat.',
          'In Morocco, 06 12 34 56 78 becomes 212612345678, and the link https://wa.me/212612345678. The generator does the conversion for you, whether you type the number with the 0, with +212 or with 00212.',
          'The pre-filled message goes after ?text=, encoded for the web: spaces become %20, accents and punctuation are converted. The person who clicks sees the message in the input box and chooses to send it or edit it; nothing is sent automatically.',
        ],
      },
      {
        heading: 'Where to put your link',
        paragraphs: [
          'On your website, next to every price and offer, with a message that names the offer: “Hello, I would like to book the Ourika valley day trip”. You know at once which page the enquiry came from, and you answer faster.',
          'In your Instagram bio and posts, your Google Business posts, your email signature. The QR code is for anything printed: business cards, menus, shop windows, riad rooms, tourist transport vehicles.',
          'One link per use beats one link for everything: a different message for the website, Instagram and printed cards shows you which one brings customers.',
        ],
      },
      {
        heading: 'WhatsApp or WhatsApp Business?',
        paragraphs: [
          'The same link works with both apps. WhatsApp Business, which is free, adds a business profile (address, hours, website), a catalogue of products or services, quick replies and away messages, useful when enquiries arrive in the evening or at the weekend.',
          'If most of your customers reach you on WhatsApp, your website should take them there without friction: a button visible on mobile, next to the information they just read. We place one on every [website we build in Morocco](/en/website-design-moroccan-businesses), and on every activity page of our [travel agency websites](/en/site-web-agence-de-voyage).',
        ],
      },
    ],
    faqs: [
      { question: 'Do I put +212 in the link?', answer: 'No. The link contains the country code 212 without the + sign, and the leading 0 of the national number is dropped: 06 12 34 56 78 becomes 212612345678.' },
      { question: 'Does the link work with WhatsApp Business?', answer: 'Yes. The wa.me format is the same for WhatsApp and WhatsApp Business. The link opens a chat with the number, whichever app is installed on it.' },
      { question: 'Is the pre-filled message sent automatically?', answer: 'No. It appears in the input box of the person who clicks, who can send it as it is, edit it or delete it.' },
      { question: 'Is my number stored?', answer: 'No. The generator runs entirely in your browser: the number and message are not sent to any server.' },
      { question: 'Can I create a link to a WhatsApp group?', answer: 'Group invite links are created inside WhatsApp, from the group info screen, by an admin. This tool creates links to a phone number.' },
      { question: 'How do I add a WhatsApp button to my website?', answer: 'Copy the button code generated above and paste it into your page, or send it to whoever manages your site. On the websites we build, the button is planned from the first mock-up, with one message per page. [See our website design in Morocco](/en/website-design-moroccan-businesses).' },
    ],
    ctaTitle: 'A website that turns visits into WhatsApp conversations',
    ctaText: 'We build websites that are fast on mobile, with the right WhatsApp button next to every offer, from 2,000 MAD. Free quote within one business day.',
    cta: 'Request a quote',
    sourceLabel: 'Source: WhatsApp, “How to use click to chat”',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = tool.copy[locale === 'fr' ? 'fr' : 'en'];
  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/outils/${SLUG}`,
    locale,
    keywords: [...tool.keywords],
  });
}

export default async function WhatsAppLinkToolPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const language = locale === 'fr' ? 'fr' : 'en';
  const copy = tool.copy[language];
  const content = CONTENT[language];
  const path = `/${locale}/outils/${SLUG}`;
  const url = `${siteConfig.url}${path}`;

  const pageJsonLd = createWebPageJsonLd({
    path,
    name: copy.title,
    description: copy.description,
    locale,
    dateModified: tool.modifiedAt,
    about: { '@id': `${url}#tool` },
    mainEntity: { '@id': `${url}#tool` },
  });
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#tool`,
    name: copy.title,
    description: copy.summary,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: language,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'MAD' },
    provider: { '@id': ENTITY_IDS.business },
  };
  const faqJsonLd = createFaqJsonLd(content.faqs);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: language === 'fr' ? 'Accueil' : 'Home', url: `/${locale}` },
    { name: copy.title, url: path },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      {[pageJsonLd, appJsonLd, faqJsonLd, breadcrumbJsonLd].map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <section className="px-6 pb-12 pt-12 md:px-16 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono flex items-center gap-3 text-[var(--color-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
            {content.eyebrow}
          </p>
          <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.4rem,5.2vw,5rem)] leading-[0.96]">{copy.title}</h1>
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl">{content.lead}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">{content.privacy}</p>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-16 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <WhatsAppLinkGenerator locale={locale} />
        </div>
      </section>

      <section className="border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-16">
          {content.sections.map((section) => (
            <article key={section.heading} className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
              <h2 className="font-display text-3xl leading-tight md:text-4xl">{section.heading}</h2>
              <div className="grid max-w-3xl gap-5 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{renderInlineLinks(paragraph)}</p>
                ))}
              </div>
            </article>
          ))}
          <p className="text-sm text-[var(--color-text-muted)] lg:pl-[calc(32%+4rem)]">
            <a className="underline underline-offset-4 hover:text-[var(--color-primary)]" href={`${WHATSAPP_HELP}/?locale=${language === 'fr' ? 'fr_FR' : 'en_US'}`} target="_blank" rel="noopener noreferrer">
              {content.sourceLabel}
            </a>
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <h2 className="font-display text-3xl leading-tight md:text-4xl">{language === 'fr' ? 'Questions fréquentes' : 'Frequently asked questions'}</h2>
          <dl className="grid max-w-3xl gap-8">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="border-t border-[rgba(58,90,64,0.16)] pt-6">
                <dt className="text-xl leading-snug text-[var(--color-text-main)]">{faq.question}</dt>
                <dd className="mt-3 text-lg leading-relaxed text-[var(--color-text-secondary)]">{renderInlineLinks(faq.answer)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-16 md:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-[rgba(58,90,64,0.18)] pt-10 md:flex-row md:items-end">
          <div>
            <p className="text-mono text-[var(--color-primary)]">WeReact agency</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[0.96] md:text-5xl">{content.ctaTitle}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{content.ctaText}</p>
          </div>
          <GrowthContactCta cta={content.cta} contactHref={`/${locale}/contact?from=${SLUG}`} slug={SLUG} />
        </div>
      </section>
    </div>
  );
}
