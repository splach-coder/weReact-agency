import type { ServiceLocaleCopy } from './services';

export type AudienceLandingPage = {
  slug: 'website-design-moroccan-businesses' | 'international-web-design-agency';
  primaryKeyword: string;
  keywords: readonly string[];
  relatedProjectIds: readonly string[];
  relatedServiceSlugs: readonly string[];
  modifiedAt: string;
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
};

export const audienceLandingPages: readonly AudienceLandingPage[] = [
  {
    slug: 'website-design-moroccan-businesses',
    primaryKeyword: 'website design for Moroccan businesses',
    keywords: ['business website Morocco', 'website for small business Morocco', 'site web entreprise Maroc'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'kasbah-angour'],
    relatedServiceSlugs: ['web-design-marrakech', 'seo-landing-pages', 'agence-web-marrakech'],
    modifiedAt: '2026-07-22',
    copy: {
      en: {
        title: 'Website Design for Moroccan Businesses',
        description: 'Fast bilingual websites for Moroccan businesses that need local visibility, stronger trust, and more calls, WhatsApp conversations, and quote requests.',
        eyebrow: 'For Moroccan businesses',
        heading: 'A clearer website for the customers already looking for your business.',
        lead: 'WeReact helps local services, shops, restaurants, professional firms, and growing Moroccan teams explain their offer and turn visits into real conversations.',
        outcomesTitle: 'Built around local buying decisions',
        outcomes: [
          'Explain the offer clearly on mobile.',
          'Connect local search visibility to calls and WhatsApp.',
          'Present services, prices, and proof without confusion.',
          'Support French and English customers from one structured site.',
        ],
        proofTitle: 'Local context with modern execution',
        proof: 'Our Marrakech-based studio combines local market understanding with fast, measurable web delivery for businesses across Morocco.',
        cta: 'Plan my business website',
        ctaNote: 'Share your business and goal. We reply within one business day.',
        faqs: [
          { question: 'What Moroccan businesses do you work with?', answer: 'We work with local services, hospitality, tourism, professional firms, retail, restaurants, and small teams that need a credible path from search to contact.' },
          { question: 'Can the website use WhatsApp as the main contact route?', answer: 'Yes. We can make WhatsApp prominent while still keeping forms, email, and phone available for customers who prefer another method.' },
          { question: 'Can you improve an existing business website?', answer: 'Yes. We can review its content, mobile usability, speed, local search signals, and contact journey before proposing the smallest useful improvement or rebuild.' },
        ],
      },
      fr: {
        title: 'Création de site web pour entreprises marocaines',
        description: 'Des sites bilingues et rapides pour les entreprises marocaines qui veulent plus de visibilité locale, de confiance, d’appels, de messages WhatsApp et de demandes de devis.',
        eyebrow: 'Pour les entreprises marocaines',
        heading: 'Un site plus clair pour les clients qui cherchent déjà votre entreprise.',
        lead: 'WeReact aide les services locaux, commerces, restaurants, cabinets et équipes marocaines en croissance à présenter leur offre et transformer les visites en vraies conversations.',
        outcomesTitle: 'Pensé pour les décisions d’achat locales',
        outcomes: [
          'Présenter clairement l’offre sur mobile.',
          'Relier la visibilité locale aux appels et à WhatsApp.',
          'Expliquer services, tarifs et preuves sans confusion.',
          'Servir les clients francophones et anglophones sur un site structuré.',
        ],
        proofTitle: 'Contexte local, exécution moderne',
        proof: 'Notre studio basé à Marrakech associe connaissance du marché marocain et réalisation web rapide et mesurable.',
        cta: 'Préparer mon site professionnel',
        ctaNote: 'Présentez votre entreprise et votre objectif. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Avec quelles entreprises marocaines travaillez-vous ?', answer: 'Nous travaillons avec les services locaux, l’hôtellerie, le tourisme, les cabinets, le commerce, la restauration et les petites équipes qui ont besoin d’un parcours crédible entre Google et le contact.' },
          { question: 'WhatsApp peut-il être le contact principal du site ?', answer: 'Oui. Nous pouvons mettre WhatsApp en avant tout en conservant formulaire, e-mail et téléphone pour les clients qui préfèrent un autre canal.' },
          { question: 'Pouvez-vous améliorer un site professionnel existant ?', answer: 'Oui. Nous pouvons analyser son contenu, son expérience mobile, sa vitesse, ses signaux locaux et son parcours de contact avant de proposer une amélioration ciblée ou une refonte.' },
        ],
      },
    },
  },
  {
    slug: 'international-web-design-agency',
    primaryKeyword: 'international web design agency Morocco',
    keywords: ['web development agency Morocco', 'bilingual web agency', 'nearshore web development Morocco'],
    relatedProjectIds: ['your-morocco', 'kasbah-angour', 'flying-tandem'],
    relatedServiceSlugs: ['web-design-marrakech', 'seo-landing-pages'],
    modifiedAt: '2026-07-22',
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
        proof: 'Our tourism and hospitality work is designed for visitors comparing Moroccan businesses from abroad, where language, mobile trust, and clarity matter.',
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
        description: 'Un partenaire web basé au Maroc pour les fondateurs, agences et équipes internationales qui recherchent une livraison claire, une capacité bilingue et un développement moderne.',
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
        proof: 'Nos projets tourisme et hôtellerie s’adressent à des visiteurs qui comparent des entreprises marocaines depuis l’étranger, où langue, confiance mobile et clarté comptent.',
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
