import type { ServiceLocaleCopy } from './services';

export type AudienceLandingPage = {
  slug: 'website-design-moroccan-businesses' | 'international-web-design-agency';
  primaryKeyword: string;
  keywords: readonly string[];
  relatedProjectIds: readonly string[];
  relatedServiceSlugs: readonly string[];
  relatedPostSlugs: readonly string[];
  /** Shows the starting-price block (and its OfferCatalog schema) on the page. */
  showPricing?: boolean;
  modifiedAt: string;
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
};

export const audienceLandingPages: readonly AudienceLandingPage[] = [
  {
    slug: 'website-design-moroccan-businesses',
    primaryKeyword: 'création site web maroc',
    keywords: ['création site web maroc', 'agence web maroc', 'website design Morocco', 'business website Morocco', 'site web entreprise Maroc', 'conception site web maroc'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'kasbah-angour'],
    relatedServiceSlugs: ['web-design-marrakech', 'web-design-casablanca', 'web-design-tanger', 'creation-site-e-commerce-maroc', 'agence-seo-marrakech'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'auto-entrepreneur-maroc', 'fiche-google-business-maroc', 'etude-sites-agences-web-marrakech'],
    showPricing: true,
    modifiedAt: '2026-11-12',
    copy: {
      en: {
        title: 'Website Design in Morocco for Local Businesses',
        description: 'Website design in Morocco for local businesses: fast bilingual websites, published starting prices from 2,000 MAD, and a free quote within one business day.',
        eyebrow: 'For Moroccan businesses',
        heading: 'Website design in Morocco for the customers already looking for your business.',
        lead: 'WeReact helps local services, shops, restaurants, professional firms, and growing Moroccan teams explain their offer and turn visits into real conversations, from [Marrakech](/en/web-design-marrakech) to [Casablanca](/en/web-design-casablanca), [Rabat](/en/web-design-rabat) and [Agadir](/en/web-design-agadir).',
        outcomesTitle: 'Built around local buying decisions',
        outcomes: [
          'Explain the offer clearly on mobile.',
          'Connect local search visibility to calls and WhatsApp.',
          'Present services, prices, and proof without confusion.',
          'Support French and English customers from one structured site.',
        ],
        proofTitle: 'Local context with modern execution',
        proof: 'Our Marrakech-based studio combines local market understanding with fast, measurable web delivery for businesses across Morocco, from [local brand concepts](/en/work/yoo-marrakech) to [an Atlas hotel](/en/work/kasbah-angour).',
        cta: 'Plan my business website',
        ctaNote: 'Share your business and goal. We reply within one business day.',
        sections: [
          {
            heading: 'How a website project runs',
            paragraphs: [
              'A first conversation, by phone or WhatsApp, to understand your business, your customers, and what the website has to bring in: calls, quote requests, bookings or sales.',
              'A precise quote within one business day, with the scope, the price and the timing. For a defined-scope showcase website, plan for 2 to 3 days.',
              'The build with shared previews: you see the site take shape and approve it before it goes live.',
              'Launch with the SEO foundations in place: titles, descriptions, speed, sitemap and structured data. The domain, the hosting and the code stay yours.',
            ],
          },
          {
            heading: 'What a showcase website includes',
            paragraphs: [
              'A focused website for a local business: home, services, about and contact, built with the local SEO foundations that help you appear when someone searches for what you do.',
              'Extra pages, a second language, a booking flow or an [online store](/en/creation-site-e-commerce-maroc) change the price. Our [pricing guide](/en/blog/combien-coute-site-web-maroc) explains what moves a quote, and our [Google Business Profile guide](/en/blog/fiche-google-business-maroc) covers the map results.',
            ],
          },
          {
            heading: 'Across Morocco',
            paragraphs: [
              'We are based in Marrakech and work remotely with businesses in other cities: [Casablanca](/en/web-design-casablanca), [Rabat](/en/web-design-rabat), [Tangier](/en/web-design-tanger) and [Agadir](/en/web-design-agadir). The prices and the method are the same everywhere.',
            ],
          },
        ],
        faqs: [
          { question: 'What Moroccan businesses do you work with?', answer: 'We work with local services, hospitality, tourism, professional firms, retail, restaurants, and small teams that need a credible path from search to contact.' },
          { question: 'I have just registered as an auto-entrepreneur. Is a showcase site enough?', answer: 'Often, yes: a few pages with your services, prices, area and WhatsApp, from 2,000 MAD, plus a free Google Business Profile. Our [auto-entrepreneur guide for 2026](/en/blog/auto-entrepreneur-maroc) covers the status itself: registration, tax and invoicing.' },
          { question: 'Can the website use WhatsApp as the main contact route?', answer: 'Yes. We can make WhatsApp prominent while still keeping forms, email, and phone available for customers who prefer another method.' },
          { question: 'Can you improve an existing business website?', answer: 'Yes. We can review its content, mobile usability, speed, local search signals, and contact journey before proposing the smallest useful improvement or rebuild.' },
          { question: 'How much does a website cost in Morocco?', answer: 'A showcase website starts from 2,000 MAD and an [e-commerce website](/en/creation-site-e-commerce-maroc) from 3,500 MAD, front-end and back-end included. What moves a quote is in our [website pricing guide for Morocco](/en/blog/combien-coute-site-web-maroc).' },
        ],
      },
      fr: {
        title: 'Création de site web au Maroc',
        description: 'Création de site web au Maroc pour les entreprises locales : sites rapides et bilingues, tarifs affichés à partir de 2 000 MAD, devis gratuit sous un jour ouvré.',
        eyebrow: 'Pour les entreprises marocaines',
        heading: 'Création de site web au Maroc, pour les clients qui cherchent déjà votre entreprise.',
        lead: 'WeReact aide les services locaux, commerces, restaurants, cabinets et équipes marocaines en croissance à présenter leur offre et transformer les visites en vraies conversations, de [Marrakech](/fr/web-design-marrakech) à [Casablanca](/fr/web-design-casablanca), [Rabat](/fr/web-design-rabat) et [Agadir](/fr/web-design-agadir).',
        outcomesTitle: 'Pensé pour les décisions d’achat locales',
        outcomes: [
          'Présenter clairement l’offre sur mobile.',
          'Relier la visibilité locale aux appels et à WhatsApp.',
          'Expliquer services, tarifs et preuves sans confusion.',
          'Servir les clients francophones et anglophones sur un site structuré.',
        ],
        proofTitle: 'Contexte local, exécution moderne',
        proof: 'Notre studio basé à Marrakech associe connaissance du marché marocain et réalisation web rapide et mesurable, des [concepts de marques locales](/fr/work/yoo-marrakech) à [un hôtel de l’Atlas](/fr/work/kasbah-angour).',
        cta: 'Préparer mon site professionnel',
        ctaNote: 'Présentez votre entreprise et votre objectif. Nous répondons sous un jour ouvré.',
        sections: [
          {
            heading: 'Comment se passe la création de votre site',
            paragraphs: [
              'Un premier échange, par téléphone ou WhatsApp, pour comprendre votre activité, vos clients et ce que le site doit vous apporter : des appels, des demandes de devis, des réservations ou des ventes.',
              'Un devis précis sous un jour ouvré, avec le périmètre, le prix et le délai. Pour un site vitrine à périmètre défini, comptez 2 à 3 jours.',
              'La réalisation avec des aperçus partagés : vous voyez le site avancer et vous le validez avant sa mise en ligne.',
              'La mise en ligne avec les fondations SEO en place : titres, descriptions, vitesse, plan du site et données structurées. Le nom de domaine, l’hébergement et le code restent à vous.',
            ],
          },
          {
            heading: 'Ce que comprend un site vitrine',
            paragraphs: [
              'Un site ciblé pour une entreprise locale : accueil, services, à propos et contact, construit avec les fondations SEO locales qui vous aident à apparaître quand quelqu’un cherche ce que vous faites.',
              'Des pages supplémentaires, une deuxième langue, une réservation ou une [boutique en ligne](/fr/creation-site-e-commerce-maroc) font évoluer le prix. Notre [guide des prix](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier un devis, et notre [guide de la fiche Google Business](/fr/blog/fiche-google-business-maroc) couvre les résultats sur la carte.',
            ],
          },
          {
            heading: 'Partout au Maroc',
            paragraphs: [
              'Nous sommes basés à Marrakech et travaillons à distance avec les entreprises des autres villes : [Casablanca](/fr/web-design-casablanca), [Rabat](/fr/web-design-rabat), [Tanger](/fr/web-design-tanger) et [Agadir](/fr/web-design-agadir). Les prix et la méthode sont les mêmes partout.',
            ],
          },
        ],
        faqs: [
          { question: 'Avec quelles entreprises marocaines travaillez-vous ?', answer: 'Nous travaillons avec les services locaux, l’hôtellerie, le tourisme, les cabinets, le commerce, la restauration et les petites équipes qui ont besoin d’un parcours crédible entre Google et le contact.' },
          { question: 'Je viens de m’inscrire comme auto-entrepreneur. Un site vitrine suffit-il ?', answer: 'Souvent, oui : quelques pages avec vos services, vos prix, votre zone et WhatsApp, à partir de 2 000 DH, plus une fiche Google Business gratuite. Notre [guide de l’auto-entrepreneur en 2026](/fr/blog/auto-entrepreneur-maroc) couvre le statut lui-même : inscription, impôt et facturation.' },
          { question: 'WhatsApp peut-il être le contact principal du site ?', answer: 'Oui. Nous pouvons mettre WhatsApp en avant tout en conservant formulaire, e-mail et téléphone pour les clients qui préfèrent un autre canal.' },
          { question: 'Pouvez-vous améliorer un site professionnel existant ?', answer: 'Oui. Nous pouvons analyser son contenu, son expérience mobile, sa vitesse, ses signaux locaux et son parcours de contact avant de proposer une amélioration ciblée ou une refonte.' },
          { question: 'Combien coûte un site web au Maroc ?', answer: 'Un site vitrine démarre à partir de 2 000 DH et un [site e-commerce](/fr/creation-site-e-commerce-maroc) à partir de 3 500 DH, front et back inclus. Ce qui fait varier un devis est détaillé dans notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc).' },
        ],
      },
    },
  },
  {
    slug: 'international-web-design-agency',
    primaryKeyword: 'international web design agency Morocco',
    keywords: ['web development agency Morocco', 'bilingual web agency', 'nearshore web development Morocco'],
    relatedProjectIds: ['your-morocco', 'kasbah-angour', 'flying-tandem'],
    relatedServiceSlugs: ['web-design-marrakech', 'tourism-websites-morocco', 'agence-seo-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'website-design-marrakech-business-guide'],
    modifiedAt: '2026-11-13',
    copy: {
      en: {
        title: 'International Web Design Agency in Morocco',
        description: 'A Morocco-based web design partner for international founders, agencies, and teams needing clear delivery, bilingual capability, and modern development.',
        eyebrow: 'Marrakech to the world',
        heading: 'A responsive Morocco-based web partner for international teams.',
        lead: 'WeReact works remotely in English and French, from focused landing pages to multilingual websites and custom digital experiences with clear scope and handoff.',
        outcomesTitle: 'A practical remote partnership',
        outcomes: [
          'Clear scope, timeline, and communication before build.',
          'English and French content structures planned together.',
          'Modern performance-minded implementation and ownership handoff.',
          'Ongoing care available after launch without platform lock-in.',
        ],
        proofTitle: 'Built for international audiences',
        proof: 'Our [tourism and hospitality work](/en/tourism-websites-morocco) is designed for visitors comparing Moroccan businesses from abroad, where language, mobile trust, and clarity matter.',
        cta: 'Discuss an international project',
        ctaNote: 'Share the scope, market, and launch goal. We reply within one business day.',
        faqs: [
          { question: 'Can WeReact work fully remotely?', answer: 'Yes. Discovery, review, delivery, and handoff can all run remotely with clear written checkpoints.' },
          { question: 'Which languages do you support?', answer: 'We work in English and French and can structure multilingual sites so each language has its own crawlable pages and metadata.' },
          { question: 'Can you collaborate with an existing agency or team?', answer: 'Yes. We can own a complete website or work within an agreed design, development, content, or landing-page scope.' },
        ],
      },
      fr: {
        title: 'Agence web internationale basée au Maroc',
        description: 'Un partenaire web basé au Maroc pour fondateurs, agences et équipes internationales : livraison claire, bilingue, développement moderne.',
        eyebrow: 'De Marrakech vers le monde',
        heading: 'Un partenaire web réactif au Maroc pour les équipes internationales.',
        lead: 'WeReact travaille à distance en français et en anglais, des landing pages ciblées aux sites multilingues et expériences digitales sur mesure, avec un périmètre et une livraison clairs.',
        outcomesTitle: 'Une collaboration à distance concrète',
        outcomes: [
          'Périmètre, calendrier et communication définis avant la réalisation.',
          'Structures de contenu françaises et anglaises pensées ensemble.',
          'Développement moderne orienté performance et transfert de propriété.',
          'Maintenance disponible après lancement sans dépendance à une plateforme.',
        ],
        proofTitle: 'Conçu pour des audiences internationales',
        proof: 'Nos [projets tourisme et hôtellerie](/fr/tourism-websites-morocco) s’adressent à des visiteurs qui comparent des entreprises marocaines depuis l’étranger, où langue, confiance mobile et clarté comptent.',
        cta: 'Discuter d’un projet international',
        ctaNote: 'Partagez le périmètre, le marché et l’objectif de lancement. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'WeReact peut-elle travailler entièrement à distance ?', answer: 'Oui. La découverte, les validations, la livraison et le transfert peuvent se dérouler à distance avec des points de contrôle écrits et clairs.' },
          { question: 'Quelles langues prenez-vous en charge ?', answer: 'Nous travaillons en français et en anglais et structurons les sites multilingues avec des pages et métadonnées explorables pour chaque langue.' },
          { question: 'Pouvez-vous collaborer avec une agence ou une équipe existante ?', answer: 'Oui. Nous pouvons prendre en charge tout le site ou intervenir sur un périmètre défini de design, développement, contenu ou landing page.' },
        ],
      },
    },
  },
];

export function getAudienceLandingPage(slug: string) {
  return audienceLandingPages.find((page) => page.slug === slug);
}
