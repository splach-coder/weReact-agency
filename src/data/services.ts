export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceLocaleCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  outcomesTitle: string;
  outcomes: readonly string[];
  proofTitle: string;
  proof: string;
  cta: string;
  ctaNote: string;
  faqs: readonly ServiceFaq[];
};

export type ServiceLandingPage = {
  slug: 'web-design-marrakech' | 'tourism-websites-morocco' | 'seo-landing-pages' | 'agence-web-marrakech';
  primaryKeyword: string;
  keywords: readonly string[];
  relatedProjectIds: readonly string[];
  modifiedAt: string;
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
};

export const serviceLandingPages: readonly ServiceLandingPage[] = [
  {
    slug: 'web-design-marrakech',
    primaryKeyword: 'website design Marrakech',
    keywords: ['website design Marrakech', 'web agency Marrakech', 'création site internet Marrakech', 'site web professionnel Maroc'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'flying-tandem'],
    modifiedAt: '2026-07-15',
    copy: {
      en: {
        title: 'Website Design in Marrakech',
        description: 'WeReact designs fast, credible websites in Marrakech for businesses that need more enquiries, bookings, and trust online.',
        eyebrow: 'Marrakech web studio',
        heading: 'Website design in Marrakech built to earn trust and enquiries.',
        lead: 'For hotels, tourism brands, local services, and growing businesses that need a website people can understand quickly and act on confidently.',
        outcomesTitle: 'What your website needs to do',
        outcomes: ['Explain your offer in seconds on mobile.', 'Show local credibility before asking for a call.', 'Make WhatsApp, quote requests, and contact routes easy to find.', 'Give Google a clear structure to crawl and understand.'],
        proofTitle: 'Built from real Marrakech context',
        proof: 'Our work includes local brands, tourism experiences, and destination-led websites where mobile discovery, trust, and direct inquiries matter.',
        cta: 'Request a project quote',
        ctaNote: 'Tell us what you need. We reply within one business day.',
        faqs: [
          { question: 'What types of businesses do you work with in Marrakech?', answer: 'We work with hospitality, tourism, local services, restaurants, lifestyle brands, and teams that need a credible website with a clear route to enquiry.' },
          { question: 'Can you build a website in English and French?', answer: 'Yes. We plan language structure, navigation, metadata, and conversion paths for English and French audiences from the beginning.' },
          { question: 'Is SEO included in a new website?', answer: 'Every build includes practical SEO foundations: clean page structure, metadata, performance-minded implementation, sitemap support, and conversion-ready content structure.' },
        ],
      },
      fr: {
        title: 'Création de site internet à Marrakech',
        description: 'WeReact conçoit des sites web rapides et crédibles à Marrakech pour générer davantage de demandes, de réservations et de confiance.',
        eyebrow: 'Studio web à Marrakech',
        heading: 'Des sites internet à Marrakech conçus pour inspirer confiance et générer des demandes.',
        lead: 'Pour les hôtels, acteurs du tourisme, services locaux et entreprises en croissance qui ont besoin d’un site clair, rapide et facile à contacter.',
        outcomesTitle: 'Ce que votre site doit accomplir',
        outcomes: ['Présenter votre offre clairement sur mobile.', 'Montrer votre crédibilité locale avant de demander un contact.', 'Rendre WhatsApp, les demandes de devis et les contacts faciles à trouver.', 'Donner à Google une structure claire à explorer et comprendre.'],
        proofTitle: 'Conçu avec une vraie connaissance de Marrakech',
        proof: 'Notre portfolio comprend des marques locales, des expériences touristiques et des sites orientés destination, où la confiance, le mobile et les demandes directes comptent.',
        cta: 'Demander un devis pour mon projet',
        ctaNote: 'Décrivez-nous votre besoin. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Avec quelles entreprises travaillez-vous à Marrakech ?', answer: 'Nous accompagnons l’hôtellerie, le tourisme, les services locaux, les restaurants, les marques lifestyle et les équipes qui ont besoin d’un site crédible avec un parcours de contact simple.' },
          { question: 'Pouvez-vous créer un site en français et en anglais ?', answer: 'Oui. Nous prévoyons la structure des langues, la navigation, les métadonnées et les parcours de conversion pour les audiences françaises et anglaises dès le départ.' },
          { question: 'Le SEO est-il inclus dans la création du site ?', answer: 'Chaque projet intègre des fondations SEO concrètes : structure de page propre, métadonnées, performance, sitemap et contenu pensé pour la conversion.' },
        ],
      },
    },
  },
  {
    slug: 'tourism-websites-morocco',
    primaryKeyword: 'tourism website design Morocco',
    keywords: ['tourism website design Morocco', 'hotel website Marrakech', 'travel website Morocco', 'site web tourisme Maroc'],
    relatedProjectIds: ['flying-tandem', 'kasbah-angour', 'morocco-atlas-guide', 'trust-drivers'],
    modifiedAt: '2026-07-15',
    copy: {
      en: {
        title: 'Tourism and Hospitality Websites in Morocco',
        description: 'Websites for hotels, riads, tour operators, transport brands, and travel businesses in Morocco that need clearer discovery and direct enquiries.',
        eyebrow: 'Tourism & hospitality',
        heading: 'Tourism websites in Morocco that make the next step feel easy.',
        lead: 'Travelers compare fast. Your website needs to explain the experience, answer practical questions, build confidence, and make a direct inquiry feel natural on any screen.',
        outcomesTitle: 'Designed around the booking journey',
        outcomes: ['Destination and service pages built around real trip-planning questions.', 'Mobile-first visual storytelling without hiding essential details.', 'Clear paths to direct enquiries, WhatsApp, and booking conversations.', 'Trust signals, multilingual structure, and SEO foundations for international discovery.'],
        proofTitle: 'Experience across Morocco travel',
        proof: 'From adventure activities and hospitality to private transport and destination guides, our case studies show the kinds of information travelers need before they contact a business.',
        cta: 'Talk about your tourism project',
        ctaNote: 'Tell us what visitors need to book or understand. We reply within one business day.',
        faqs: [
          { question: 'Do you build sites for riads, hotels, and tours?', answer: 'Yes. We shape the page structure around the way guests compare rooms, experiences, routes, inclusions, safety details, and contact options.' },
          { question: 'Can the website support international travelers?', answer: 'Yes. We build for mobile-first browsing, English and French audiences, practical travel questions, and clear inquiry routes.' },
          { question: 'Can you improve an existing tourism site?', answer: 'Yes. We can assess the current structure, booking journey, content gaps, speed, and conversion paths before recommending a focused rebuild or improvement plan.' },
        ],
      },
      fr: {
        title: 'Sites web tourisme et hôtellerie au Maroc',
        description: 'Des sites web pour hôtels, riads, agences de voyage, transport privé et acteurs du tourisme au Maroc qui veulent plus de demandes directes.',
        eyebrow: 'Tourisme & hôtellerie',
        heading: 'Des sites tourisme au Maroc qui rendent la prochaine étape évidente.',
        lead: 'Les voyageurs comparent vite. Votre site doit présenter l’expérience, répondre aux questions pratiques, rassurer et faciliter une demande directe sur tous les écrans.',
        outcomesTitle: 'Pensé pour le parcours de réservation',
        outcomes: ['Pages destinations et services organisées autour des vraies questions des voyageurs.', 'Narration visuelle mobile sans cacher les informations essentielles.', 'Accès direct aux demandes, à WhatsApp et aux échanges de réservation.', 'Signaux de confiance, structure multilingue et bases SEO pour une audience internationale.'],
        proofTitle: 'Une expérience concrète du voyage au Maroc',
        proof: 'Nos projets couvrent activités, hôtellerie, transport privé et guides de destination. Ils montrent les informations dont les voyageurs ont besoin avant de contacter une entreprise.',
        cta: 'Parler de mon projet tourisme',
        ctaNote: 'Expliquez-nous ce que vos visiteurs doivent comprendre ou réserver. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Créez-vous des sites pour riads, hôtels et excursions ?', answer: 'Oui. Nous organisons les pages selon la manière dont les voyageurs comparent les chambres, expériences, itinéraires, inclusions, informations de sécurité et options de contact.' },
          { question: 'Le site peut-il s’adresser aux voyageurs internationaux ?', answer: 'Oui. Nous concevons pour le mobile, les publics français et anglais, les questions de voyage pratiques et des parcours de demande clairs.' },
          { question: 'Pouvez-vous améliorer un site tourisme existant ?', answer: 'Oui. Nous pouvons analyser la structure actuelle, le parcours de réservation, les manques de contenu, la vitesse et les chemins de conversion avant de proposer une amélioration ciblée.' },
        ],
      },
    },
  },
  {
    slug: 'seo-landing-pages',
    primaryKeyword: 'SEO landing pages Morocco',
    keywords: ['SEO landing pages Morocco', 'Google Ads landing page Marrakech', 'landing page design Morocco', 'page d’atterrissage SEO Maroc'],
    relatedProjectIds: ['trust-drivers', 'yoo-marrakech', 'morocco-atlas-guide'],
    modifiedAt: '2026-07-15',
    copy: {
      en: {
        title: 'SEO-Ready Landing Pages in Morocco',
        description: 'Focused landing pages for Moroccan businesses running Google Ads, launching offers, or improving a single conversion journey.',
        eyebrow: 'Landing pages & conversion',
        heading: 'Landing pages that give paid traffic a clear place to convert.',
        lead: 'A campaign does not need more decoration. It needs one clear promise, useful proof, fast mobile performance, and a contact path that makes sense for the visitor.',
        outcomesTitle: 'Built for one important action',
        outcomes: ['One focused offer and message hierarchy.', 'Fast mobile layout designed for paid and organic traffic.', 'Trust, FAQ, and proof placed before the lead action.', 'Conversion events ready for Google Ads and analytics measurement.'],
        proofTitle: 'Where strategy meets the click',
        proof: 'We pair web design, content structure, and technical tracking so a campaign landing page can be measured and improved instead of treated like a static brochure.',
        cta: 'Plan a conversion page',
        ctaNote: 'Tell us your offer, audience, and campaign. We reply within one business day.',
        faqs: [
          { question: 'Do you build landing pages for Google Ads?', answer: 'Yes. We can build a focused campaign page with clear message matching, conversion paths, event tracking, and a mobile-first experience.' },
          { question: 'Can a landing page rank in Google too?', answer: 'It can support organic visibility when it answers a real search need and has enough useful content, but paid-campaign pages should not be overloaded with irrelevant keywords.' },
          { question: 'Will you help measure leads?', answer: 'We can implement the technical events needed to measure qualified form submissions and key contact actions in Google Ads and Google Analytics.' },
        ],
      },
      fr: {
        title: 'Landing pages SEO et Google Ads au Maroc',
        description: 'Des landing pages ciblées pour les entreprises marocaines qui lancent une offre, utilisent Google Ads ou améliorent un parcours de conversion.',
        eyebrow: 'Landing pages & conversion',
        heading: 'Des landing pages qui donnent à votre trafic une raison claire de convertir.',
        lead: 'Une campagne n’a pas besoin de plus de décoration. Elle a besoin d’une promesse claire, de preuves utiles, de vitesse sur mobile et d’un contact évident.',
        outcomesTitle: 'Conçue pour une action importante',
        outcomes: ['Une offre claire et une hiérarchie de message simple.', 'Une expérience mobile rapide pour le trafic payant et organique.', 'Preuves, FAQ et réassurance placées avant l’action.', 'Événements de conversion prêts pour Google Ads et Analytics.'],
        proofTitle: 'Quand la stratégie rencontre le clic',
        proof: 'Nous associons design, structure de contenu et mesure technique pour qu’une landing page puisse être analysée et améliorée, au lieu de rester une brochure statique.',
        cta: 'Préparer ma page de conversion',
        ctaNote: 'Présentez votre offre, votre audience et votre campagne. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Créez-vous des landing pages pour Google Ads ?', answer: 'Oui. Nous pouvons créer une page de campagne claire avec cohérence de message, parcours de conversion, suivi des événements et expérience mobile.' },
          { question: 'Une landing page peut-elle aussi se positionner sur Google ?', answer: 'Oui, lorsqu’elle répond à une vraie intention de recherche et contient assez de contenu utile. Une page de campagne ne doit toutefois pas être surchargée de mots-clés inutiles.' },
          { question: 'Pouvez-vous aider à mesurer les leads ?', answer: 'Nous pouvons intégrer les événements nécessaires pour mesurer les formulaires qualifiés et les actions de contact importantes dans Google Ads et Google Analytics.' },
        ],
      },
    },
  },
  {
    slug: 'agence-web-marrakech',
    primaryKeyword: 'agence web marrakech',
    keywords: ['création site web maroc', 'création site internet marrakech', 'agence création site web', 'agence web maroc', 'création site web marrakech', 'refonte site web maroc'],
    relatedProjectIds: ['flying-tandem', 'kasbah-angour', 'your-morocco'],
    modifiedAt: '2026-07-15',
    copy: {
      en: {
        title: 'Web Agency in Marrakech',
        description: 'WeReact is a web agency in Marrakech building fast, bilingual, SEO-ready websites for riads, tourism brands, and local businesses across Morocco, with transparent pricing and a free quote.',
        eyebrow: 'Web agency in Marrakech',
        heading: 'The web agency in Marrakech for a website that brings you clients.',
        lead: 'Website creation for riads, tourism experiences, and local businesses across Morocco: fast on mobile, bilingual French and English, SEO-ready, with transparent pricing and a free quote.',
        outcomesTitle: 'What a good web agency should deliver',
        outcomes: ['A fast website that loads well, even on an average mobile connection.', 'French and English versions planned from the start, not translated as an afterthought.', 'Clean SEO foundations so Google can find you in Morocco and abroad.', 'A clear contact journey: quote request, WhatsApp, and phone always within reach.'],
        proofTitle: 'Real projects in Marrakech and across Morocco',
        proof: 'We have built websites for tourism experiences, an Atlas hotel, and travel brands rooted in Morocco. Each project shows how a clear, fast website turns visitors into real enquiries.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'How much does a website cost in Morocco?', answer: 'As an honest starting point: a showcase website starts from 2,000 MAD and scales with pages, languages, and features. An e-commerce site starts from 3,500 MAD, with front-end and back-end included. Larger projects, like a riad direct-booking site or an advanced multilingual build, get a custom quote based on scope. We send a precise, free quote within one business day based on your exact scope.' },
          { question: 'How long does it take to build a website?', answer: 'Plan for 2 to 3 days for most builds: a simple showcase site moves fastest, while booking or e-commerce features can take a little more preparation. We agree on a clear timeline with the quote.' },
          { question: 'Do you work outside Marrakech?', answer: 'Yes. We are based in Marrakech and work with clients across Morocco (Casablanca, Rabat, Agadir) as well as remotely for international projects.' },
        ],
      },
      fr: {
        title: 'Agence web à Marrakech : création de site web au Maroc',
        description: 'WeReact est une agence web à Marrakech qui crée des sites rapides, bilingues et prêts pour le SEO, pour les riads, le tourisme et les entreprises locales partout au Maroc, avec des tarifs transparents et un devis gratuit.',
        eyebrow: 'Agence web à Marrakech',
        heading: 'L’agence web à Marrakech pour un site qui vous amène des clients.',
        lead: 'Création de site web pour les riads, les expériences touristiques et les entreprises locales partout au Maroc : rapide sur mobile, bilingue français et anglais, prêt pour le SEO, avec des tarifs transparents et un devis gratuit.',
        outcomesTitle: 'Ce qu’une bonne agence web doit vous livrer',
        outcomes: ['Un site rapide qui se charge bien, même sur une connexion mobile moyenne.', 'Des versions française et anglaise pensées dès le départ, pas traduites après coup.', 'Des fondations SEO propres pour être trouvé sur Google au Maroc et à l’international.', 'Un parcours de contact clair : demande de devis, WhatsApp et téléphone toujours à portée de main.'],
        proofTitle: 'Des projets réels à Marrakech et au Maroc',
        proof: 'Nous avons créé des sites pour des expériences touristiques, un hôtel de l’Atlas et des marques de voyage ancrées au Maroc. Chaque projet montre comment un site clair et rapide transforme des visiteurs en vraies demandes.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Combien coûte un site web au Maroc ?', answer: 'En clair : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 3 500 DH, front et back inclus. Les projets plus importants, comme un site de réservation directe pour riad ou une structure multilingue avancée, sont établis sur devis selon le périmètre. Nous envoyons un devis gratuit et précis sous un jour ouvré, selon votre périmètre exact.' },
          { question: 'Combien de temps pour créer un site ?', answer: 'Comptez 2 à 3 jours pour la plupart des sites : un site vitrine simple avance plus vite, tandis qu’une réservation ou une boutique en ligne peut demander un peu plus de préparation. Nous fixons un calendrier clair dès le devis.' },
          { question: 'Travaillez-vous ailleurs qu’à Marrakech ?', answer: 'Oui. Nous sommes basés à Marrakech et accompagnons des clients dans tout le Maroc (Casablanca, Rabat, Agadir) ainsi qu’à distance pour les projets internationaux.' },
        ],
      },
    },
  },
];

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}
