export type ServiceFaq = {
  question: string;
  answer: string;
};

/** A sourced figure shown in the "what we measured" block (information gain). */
export type ServiceInsight = {
  figure: string;
  label: string;
  /** Where the figure comes from. Required for anything not measured by WeReact itself. */
  source?: { label: string; href: string };
};

/** A longer content section. Paragraphs may contain `[text](/path)` links. */
export type ServiceSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type ServiceLocaleCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  /** May contain `[text](/path)` internal links (see src/lib/inline-links.tsx). */
  lead: string;
  outcomesTitle: string;
  outcomes: readonly string[];
  proofTitle: string;
  /** May contain `[text](/path)` internal links. */
  proof: string;
  cta: string;
  ctaNote: string;
  /** Answers may contain `[text](/path)` internal links; they are stripped for FAQPage JSON-LD. */
  faqs: readonly ServiceFaq[];
  insights?: {
    title: string;
    lead?: string;
    items: readonly ServiceInsight[];
    note?: string;
  };
  sections?: readonly ServiceSection[];
};

export type ServiceLandingPage = {
  slug:
    | 'web-design-marrakech'
    | 'tourism-websites-morocco'
    | 'seo-landing-pages'
    | 'web-design-casablanca'
    | 'agence-seo-marrakech'
    | 'web-design-rabat'
    | 'web-design-agadir'
    | 'hotel-website-design'
    | 'agence-google-ads-maroc'
    | 'site-web-agence-de-voyage'
    | 'creation-site-e-commerce-maroc';
  primaryKeyword: string;
  keywords: readonly string[];
  relatedProjectIds: readonly string[];
  /** Slugs of other growth landing pages (services or audiences) linked from this page. */
  relatedPageSlugs: readonly string[];
  /** Slugs of blog posts linked from this page as related guides. */
  relatedPostSlugs: readonly string[];
  /** Shows the starting-price block (and its OfferCatalog schema) on the page. */
  showPricing?: boolean;
  modifiedAt: string;
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
};

export type ServicePricingTier = {
  name: string;
  /** Starting price in MAD, or null when the tier is quoted per project. */
  fromMad: number | null;
  note: string;
};

export type ServicePricingCopy = {
  title: string;
  lead: string;
  tiers: readonly ServicePricingTier[];
  footnote: string;
};

export const servicePricing: Record<'en' | 'fr', ServicePricingCopy> = {
  en: {
    title: 'What it costs',
    lead: 'Transparent starting points, not a quote. We scope your project first, then send a precise figure — free, within one business day.',
    tiers: [
      { name: 'Showcase website', fromMad: 2000, note: 'Scales with pages, languages, and features.' },
      { name: 'E-commerce website', fromMad: 3500, note: 'Front-end and back-end included.' },
      { name: 'Riad / hotel direct booking', fromMad: null, note: 'Custom quote based on scope.' },
    ],
    footnote: 'Delivery is 2-3 days for defined-scope showcase sites and landing pages. Booking, e-commerce, and complex integrations get a scoped timeline before work begins.',
  },
  fr: {
    title: 'Combien ça coûte',
    lead: 'Des points de départ transparents, pas un devis. Nous cadrons votre projet, puis nous envoyons un chiffre précis — gratuit, sous un jour ouvré.',
    tiers: [
      { name: 'Site vitrine', fromMad: 2000, note: 'Évolue selon les pages, les langues et les fonctionnalités.' },
      { name: 'Site e-commerce', fromMad: 3500, note: 'Front et back inclus.' },
      { name: 'Réservation directe riad / hôtel', fromMad: null, note: 'Sur devis, selon le périmètre.' },
    ],
    footnote: 'Comptez 2 à 3 jours pour les sites vitrines et landing pages à périmètre défini. Réservation, e-commerce et intégrations complexes reçoivent un calendrier cadré avant le démarrage.',
  },
};

export const serviceLandingPages: readonly ServiceLandingPage[] = [
  {
    slug: 'web-design-marrakech',
    primaryKeyword: 'agence web marrakech',
    keywords: ['agence web marrakech', 'création site web marrakech', 'création site internet marrakech', 'website design Marrakech', 'web agency Marrakech', 'agence création site web', 'refonte site web marrakech', 'site web professionnel Maroc'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'flying-tandem'],
    relatedPageSlugs: ['site-web-agence-de-voyage', 'hotel-website-design', 'agence-seo-marrakech', 'creation-site-e-commerce-maroc', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['website-design-marrakech-business-guide', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Web Agency in Marrakech: Website Design',
        description: 'Web agency in Marrakech designing fast, bilingual, SEO-ready websites for riads, tourism brands, and local businesses. Clear starting prices, free quote in one day.',
        eyebrow: 'Web agency in Marrakech',
        heading: 'A web agency in Marrakech for websites that earn trust and bring enquiries.',
        lead: 'Website design for riads, hotels, tour and activity operators, and local businesses: fast on mobile, built in French and English, ready for Google, with starting prices on the page and a free quote.',
        outcomesTitle: 'What your website needs to do',
        outcomes: ['Explain your offer in seconds on mobile, even on an average connection.', 'Show local credibility before asking for a call.', 'Make WhatsApp, quote requests, and contact routes easy to find.', 'Serve French and English visitors from versions planned at the start, not translated afterwards.', 'Give Google a clear structure to crawl and understand.'],
        proofTitle: 'Built from real Marrakech context',
        proof: 'Our work includes [a paragliding operator near Marrakech](/en/work/flying-tandem), [a city guide](/en/work/by-marrakech), and [a local brand concept](/en/work/yoo-marrakech) built by the studio. On each one, mobile discovery, trust, and direct enquiries decide whether the website pays for itself.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'How much does a website cost in Marrakech?', answer: 'As an honest starting point: a showcase website starts from 2,000 MAD and scales with pages, languages, and features. An e-commerce site starts from 3,500 MAD, with front-end and back-end included. Larger projects, like a riad direct-booking site or an advanced multilingual build, get a custom quote based on scope. We send a precise, free quote within one business day. What moves a quote up or down is in our [website pricing guide for Morocco](/en/blog/combien-coute-site-web-maroc).' },
          { question: 'How long does it take to build a website?', answer: 'Plan for 2 to 3 days for most defined-scope builds: a simple showcase site moves fastest, while booking or [e-commerce](/en/creation-site-e-commerce-maroc) features need more preparation. We agree on a clear timeline with the quote.' },
          { question: 'What types of businesses do you work with in Marrakech?', answer: 'We work with [hotels and riads](/en/hotel-website-design), [travel agencies and activity operators](/en/site-web-agence-de-voyage), local services, restaurants, lifestyle brands, and teams that need a credible website with a clear route to enquiry.' },
          { question: 'Can you build a website in English and French?', answer: 'Yes. We plan language structure, navigation, metadata, and conversion paths for English and French audiences from the beginning.' },
          { question: 'Is SEO included in a new website?', answer: 'Every build includes practical SEO foundations: clean page structure, metadata, performance-minded implementation, sitemap support, and conversion-ready content structure. For ongoing rankings and your Google Business Profile, see our [SEO agency in Marrakech](/en/agence-seo-marrakech).' },
          { question: 'Do you work outside Marrakech?', answer: 'Yes. We are based in Marrakech and work with clients across Morocco ([Casablanca](/en/web-design-casablanca), [Rabat](/en/web-design-rabat), [Agadir](/en/web-design-agadir)) as well as remotely for [international projects](/en/international-web-design-agency).' },
        ],
      },
      fr: {
        title: 'Agence web à Marrakech : création de site web',
        description: 'Agence web à Marrakech : création de sites web rapides, bilingues et prêts pour le SEO pour riads, tourisme et entreprises locales. Tarifs affichés, devis gratuit sous un jour.',
        eyebrow: 'Agence web à Marrakech',
        heading: 'Agence web à Marrakech : des sites qui inspirent confiance et amènent des demandes.',
        lead: 'Création de site web pour les riads, les hôtels, les excursions et activités, et les entreprises locales : rapide sur mobile, pensé en français et en anglais, prêt pour Google, avec des tarifs de départ affichés et un devis gratuit.',
        outcomesTitle: 'Ce que votre site doit accomplir',
        outcomes: ['Présenter votre offre clairement sur mobile, même avec une connexion moyenne.', 'Montrer votre crédibilité locale avant de demander un contact.', 'Rendre WhatsApp, les demandes de devis et les contacts faciles à trouver.', 'Servir vos visiteurs en français et en anglais, avec des versions pensées dès le départ et non traduites après coup.', 'Donner à Google une structure claire à explorer et comprendre.'],
        proofTitle: 'Conçu avec une vraie connaissance de Marrakech',
        proof: 'Notre portfolio comprend [un opérateur de parapente près de Marrakech](/fr/work/flying-tandem), [un guide de la ville](/fr/work/by-marrakech) et [un concept de marque locale](/fr/work/yoo-marrakech) créé par le studio. Sur chacun, la découverte sur mobile, la confiance et les demandes directes décident si le site est rentable.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Combien coûte un site web à Marrakech ?', answer: 'En clair : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 3 500 DH, front et back inclus. Les projets plus importants, comme un site de réservation directe pour riad ou une structure multilingue avancée, sont établis sur devis selon le périmètre. Nous envoyons un devis gratuit et précis sous un jour ouvré. Ce qui fait varier un devis est détaillé dans notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc).' },
          { question: 'Combien de temps pour créer un site ?', answer: 'Comptez 2 à 3 jours pour la plupart des sites à périmètre défini : un site vitrine simple avance plus vite, tandis qu’une réservation ou une [boutique en ligne](/fr/creation-site-e-commerce-maroc) demande plus de préparation. Nous fixons un calendrier clair dès le devis.' },
          { question: 'Avec quelles entreprises travaillez-vous à Marrakech ?', answer: 'Nous accompagnons [les hôtels et riads](/fr/hotel-website-design), [les agences de voyage et les activités](/fr/site-web-agence-de-voyage), les services locaux, les restaurants, les marques lifestyle et les équipes qui ont besoin d’un site crédible avec un parcours de contact simple.' },
          { question: 'Pouvez-vous créer un site en français et en anglais ?', answer: 'Oui. Nous prévoyons la structure des langues, la navigation, les métadonnées et les parcours de conversion pour les audiences françaises et anglaises dès le départ.' },
          { question: 'Le SEO est-il inclus dans la création du site ?', answer: 'Chaque projet intègre des fondations SEO concrètes : structure de page propre, métadonnées, performance, sitemap et contenu pensé pour la conversion. Pour le positionnement dans la durée et la fiche Google, voir notre [agence SEO à Marrakech](/fr/agence-seo-marrakech).' },
          { question: 'Travaillez-vous ailleurs qu’à Marrakech ?', answer: 'Oui. Nous sommes basés à Marrakech et accompagnons des clients dans tout le Maroc ([Casablanca](/fr/web-design-casablanca), [Rabat](/fr/web-design-rabat), [Agadir](/fr/web-design-agadir)) ainsi qu’à distance pour les [projets internationaux](/fr/international-web-design-agency).' },
        ],
      },
    },
  },
  {
    slug: 'tourism-websites-morocco',
    primaryKeyword: 'tourism website design Morocco',
    keywords: ['tourism website design Morocco', 'hotel website Marrakech', 'travel website Morocco', 'site web tourisme Maroc'],
    relatedProjectIds: ['flying-tandem', 'kasbah-angour', 'morocco-atlas-guide', 'trust-drivers'],
    relatedPageSlugs: ['site-web-agence-de-voyage', 'hotel-website-design', 'web-design-marrakech', 'agence-seo-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
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
        proof: 'From [adventure activities](/en/work/flying-tandem) and [hospitality](/en/work/kasbah-angour) to [private transport](/en/work/trust-drivers) and [destination guides](/en/work/morocco-atlas-guide), our case studies show the kinds of information travelers need before they contact a business.',
        cta: 'Talk about your tourism project',
        ctaNote: 'Tell us what visitors need to book or understand. We reply within one business day.',
        faqs: [
          { question: 'Do you build sites for riads, hotels, and tours?', answer: 'Yes, with dedicated approaches for [hotels and riads](/en/hotel-website-design) and for [travel agencies, tours and activities](/en/site-web-agence-de-voyage). We shape the page structure around the way guests compare rooms, experiences, routes, inclusions, safety details, and contact options.' },
          { question: 'Can the website support international travelers?', answer: 'Yes. We build for mobile-first browsing, English and French audiences, practical travel questions, and clear inquiry routes.' },
          { question: 'Can you improve an existing tourism site?', answer: 'Yes. We can assess the current structure, booking journey, content gaps, speed, and conversion paths before recommending a focused rebuild or improvement plan. Our [tourism SEO guide for Morocco](/en/blog/tourism-hospitality-seo-morocco) lists what we check.' },
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
        proof: 'Nos projets couvrent [activités](/fr/work/flying-tandem), [hôtellerie](/fr/work/kasbah-angour), [transport privé](/fr/work/trust-drivers) et [guides de destination](/fr/work/morocco-atlas-guide). Ils montrent les informations dont les voyageurs ont besoin avant de contacter une entreprise.',
        cta: 'Parler de mon projet tourisme',
        ctaNote: 'Expliquez-nous ce que vos visiteurs doivent comprendre ou réserver. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Créez-vous des sites pour riads, hôtels et excursions ?', answer: 'Oui, avec une approche dédiée aux [hôtels et riads](/fr/hotel-website-design) et aux [agences de voyage, excursions et activités](/fr/site-web-agence-de-voyage). Nous organisons les pages selon la manière dont les voyageurs comparent les chambres, expériences, itinéraires, inclusions, informations de sécurité et options de contact.' },
          { question: 'Le site peut-il s’adresser aux voyageurs internationaux ?', answer: 'Oui. Nous concevons pour le mobile, les publics français et anglais, les questions de voyage pratiques et des parcours de demande clairs.' },
          { question: 'Pouvez-vous améliorer un site tourisme existant ?', answer: 'Oui. Nous pouvons analyser la structure actuelle, le parcours de réservation, les manques de contenu, la vitesse et les chemins de conversion avant de proposer une amélioration ciblée. Notre [guide SEO pour le tourisme au Maroc](/fr/blog/tourism-hospitality-seo-morocco) détaille ce que nous vérifions.' },
        ],
      },
    },
  },
  {
    slug: 'seo-landing-pages',
    primaryKeyword: 'SEO landing pages Morocco',
    keywords: ['SEO landing pages Morocco', 'Google Ads landing page Marrakech', 'landing page design Morocco', 'page d’atterrissage SEO Maroc'],
    relatedProjectIds: ['trust-drivers', 'yoo-marrakech', 'morocco-atlas-guide'],
    relatedPageSlugs: ['agence-google-ads-maroc', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['seo-strategies-for-agencies', 'website-design-marrakech-business-guide'],
    modifiedAt: '2026-11-10',
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
          { question: 'Do you build landing pages for Google Ads?', answer: 'Yes. We can build a focused campaign page with clear message matching, conversion paths, event tracking, and a mobile-first experience. We can also [run the Google Ads campaign](/en/agence-google-ads-maroc) itself.' },
          { question: 'Can a landing page rank in Google too?', answer: 'It can support organic visibility when it answers a real search need and has enough useful content, but paid-campaign pages should not be overloaded with irrelevant keywords. For organic rankings, see our [SEO agency in Marrakech](/en/agence-seo-marrakech).' },
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
          { question: 'Créez-vous des landing pages pour Google Ads ?', answer: 'Oui. Nous pouvons créer une page de campagne claire avec cohérence de message, parcours de conversion, suivi des événements et expérience mobile. Nous pouvons aussi [gérer la campagne Google Ads](/fr/agence-google-ads-maroc) elle-même.' },
          { question: 'Une landing page peut-elle aussi se positionner sur Google ?', answer: 'Oui, lorsqu’elle répond à une vraie intention de recherche et contient assez de contenu utile. Une page de campagne ne doit toutefois pas être surchargée de mots-clés inutiles. Pour le référencement naturel, voir notre [agence SEO à Marrakech](/fr/agence-seo-marrakech).' },
          { question: 'Pouvez-vous aider à mesurer les leads ?', answer: 'Nous pouvons intégrer les événements nécessaires pour mesurer les formulaires qualifiés et les actions de contact importantes dans Google Ads et Google Analytics.' },
        ],
      },
    },
  },
  {
    slug: 'web-design-casablanca',
    primaryKeyword: 'agence web casablanca',
    keywords: ['agence web casablanca', 'création site web casablanca', 'création site internet casablanca', 'agence création site web casablanca', 'site vitrine casablanca', 'refonte site web casablanca'],
    relatedProjectIds: ['trust-drivers', 'by-marrakech', 'your-morocco'],
    relatedPageSlugs: ['web-design-rabat', 'web-design-marrakech', 'creation-site-e-commerce-maroc', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'website-design-marrakech-business-guide'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Web Agency for Casablanca Businesses',
        description: 'Web agency for Casablanca businesses: fast, bilingual, SEO-ready websites. Transparent pricing and a free quote within one business day.',
        eyebrow: 'Websites for Casablanca',
        heading: 'Websites for Casablanca businesses, built to win the enquiry.',
        lead: 'Casablanca is Morocco’s most competitive market. Your website has to load fast, prove you are credible, and make contact effortless — before a visitor goes back to the search results.',
        outcomesTitle: 'What a Casablanca business website needs',
        outcomes: ['Fast mobile performance for buyers comparing several suppliers at once.', 'French and English planned together, for local clients and international partners.', 'Clear credibility signals for B2B, services, and professional firms.', 'Quote request, WhatsApp, and phone reachable from every page.'],
        proofTitle: 'Built remotely, managed closely',
        proof: 'We are based in Marrakech and work with clients across Casablanca and the Grand Casablanca region. Everything runs on calls, WhatsApp, and shared previews — you see the site take shape before it goes live.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'Do you work with clients in Casablanca if you are based in Marrakech?', answer: 'Yes. Most of our project work runs remotely through calls, WhatsApp, and shared previews, so distance does not slow anything down. We can also travel to Casablanca for a kickoff meeting on larger projects.' },
          { question: 'How much does a website cost in Casablanca?', answer: 'The same transparent pricing applies across Morocco: a showcase website starts from 2,000 MAD and scales with pages, languages, and features. An [e-commerce site](/en/creation-site-e-commerce-maroc) starts from 3,500 MAD with front-end and back-end included. You get a precise, free quote within one business day, and our [pricing guide](/en/blog/combien-coute-site-web-maroc) explains what changes it.' },
          { question: 'Can you redesign our existing website?', answer: 'Yes. We start by reviewing your current structure, speed, content gaps, and contact paths, then recommend either a focused improvement or a full rebuild — whichever gets you results faster.' },
        ],
      },
      fr: {
        title: 'Agence web à Casablanca - Sites internet',
        description: 'Agence web à Casablanca : création de sites rapides, bilingues et prêts pour le SEO. Tarifs transparents, devis gratuit sous un jour ouvré.',
        eyebrow: 'Sites web à Casablanca',
        heading: 'Création de site web à Casablanca pour des entreprises qui veulent des clients.',
        lead: 'Casablanca est le marché le plus concurrentiel du Maroc. Votre site doit charger vite, prouver votre sérieux et rendre le contact évident — avant que le visiteur ne retourne sur Google.',
        outcomesTitle: 'Ce que votre site à Casablanca doit accomplir',
        outcomes: ['Une vitesse mobile réelle, pour des acheteurs qui comparent plusieurs prestataires.', 'Le français et l’anglais pensés ensemble, pour vos clients locaux et vos partenaires étrangers.', 'Des signaux de crédibilité clairs pour le B2B, les services et les professions libérales.', 'Demande de devis, WhatsApp et téléphone accessibles depuis chaque page.'],
        proofTitle: 'À distance, mais suivi de près',
        proof: 'Nous sommes basés à Marrakech et travaillons avec des clients à Casablanca et dans tout le Grand Casablanca. Tout se pilote par appels, WhatsApp et aperçus partagés : vous voyez le site avancer avant sa mise en ligne.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Travaillez-vous avec des clients à Casablanca depuis Marrakech ?', answer: 'Oui. La majorité de nos projets se pilotent à distance par appels, WhatsApp et aperçus partagés : la distance ne ralentit rien. Pour les projets importants, nous pouvons aussi nous déplacer à Casablanca pour une réunion de lancement.' },
          { question: 'Combien coûte un site web à Casablanca ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un [site e-commerce](/fr/creation-site-e-commerce-maroc) démarre à partir de 3 500 DH, front et back inclus. Vous recevez un devis gratuit et précis sous un jour ouvré, et notre [guide des prix](/fr/blog/combien-coute-site-web-maroc) explique ce qui le fait varier.' },
          { question: 'Pouvez-vous refaire notre site existant ?', answer: 'Oui. Nous commençons par analyser votre structure actuelle, la vitesse, les manques de contenu et les parcours de contact, puis nous recommandons soit une amélioration ciblée, soit une refonte complète — selon ce qui donne des résultats le plus vite.' },
        ],
      },
    },
  },
  {
    slug: 'agence-seo-marrakech',
    primaryKeyword: 'agence seo marrakech',
    keywords: ['agence seo marrakech', 'agence seo maroc', 'référencement naturel maroc', 'consultant seo maroc', 'seo prix maroc', 'référencement naturel marrakech'],
    relatedProjectIds: ['trust-drivers', 'morocco-atlas-guide', 'kasbah-angour'],
    relatedPageSlugs: ['web-design-marrakech', 'seo-landing-pages', 'agence-google-ads-maroc'],
    relatedPostSlugs: ['fiche-google-business-maroc', 'tourism-hospitality-seo-morocco', 'seo-strategies-for-agencies'],
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'SEO Agency in Marrakech, Morocco',
        description: 'SEO agency in Marrakech helping Moroccan businesses rank on Google: technical SEO, local SEO, content structure, and measurable organic growth.',
        eyebrow: 'SEO & organic growth',
        heading: 'An SEO agency in Marrakech that earns rankings the durable way.',
        lead: 'Being found on Google in Morocco is not luck. It is clean technical foundations, pages that answer real searches, local signals, and content structured for both classic search and AI answers.',
        outcomesTitle: 'What our SEO work covers',
        outcomes: ['A technical audit: crawlability, speed, structure, and indexation issues fixed first.', 'Local SEO for Marrakech and Morocco: Google Business Profile, local pages, and geo signals.', 'Content mapped to real search demand in French and English, not guessed topics.', 'Monthly, measurable reporting: rankings, organic traffic, and enquiries — not vanity metrics.'],
        proofTitle: 'SEO built into everything we ship',
        proof: 'Our studio projects, such as [Trust Drivers Tours](/en/work/trust-drivers) and [Morocco Atlas Guide](/en/work/morocco-atlas-guide), are where we test structure on real Morocco travel and local searches. What works there — structure, speed, local signals, useful content — is what we apply to client sites.',
        cta: 'Request an SEO review',
        ctaNote: 'Share your website and goals. We reply within one business day.',
        faqs: [
          { question: 'How much does SEO cost in Morocco?', answer: 'It depends on your market and starting point. After a free review of your site we propose a scoped monthly plan or a one-off technical fix, each with clear deliverables — no vague retainers. If you need enquiries while SEO builds up, [Google Ads](/en/agence-google-ads-maroc) can run alongside it.' },
          { question: 'How long until SEO shows results?', answer: 'Technical fixes and local SEO often move within weeks. Competitive commercial keywords typically take three to six months of consistent work. We set expectations from the first review.' },
          { question: 'Do you also handle Google Business Profile?', answer: 'Yes. For local businesses in Marrakech and across Morocco, the map pack is often the fastest win, so we optimize your profile, categories, photos, and reviews alongside the website. Our [Google Business Profile guide for Morocco](/en/blog/fiche-google-business-maroc) explains the method.' },
        ],
      },
      fr: {
        title: 'Agence SEO à Marrakech et au Maroc',
        description: 'Agence SEO à Marrakech : référencement naturel pour les entreprises marocaines — SEO technique, SEO local, contenu et croissance organique mesurable.',
        eyebrow: 'SEO & référencement naturel',
        heading: 'Une agence SEO à Marrakech qui construit des positions durables.',
        lead: 'Être trouvé sur Google au Maroc n’est pas une question de chance : des fondations techniques propres, des pages qui répondent à de vraies recherches, des signaux locaux et un contenu structuré pour la recherche classique comme pour les réponses IA.',
        outcomesTitle: 'Ce que couvre notre travail SEO',
        outcomes: ['Un audit technique : crawl, vitesse, structure et problèmes d’indexation corrigés en premier.', 'Le SEO local pour Marrakech et le Maroc : fiche Google Business, pages locales et signaux géographiques.', 'Un contenu aligné sur la vraie demande de recherche en français et en anglais, pas des sujets devinés.', 'Un reporting mensuel mesurable : positions, trafic organique et demandes — pas des chiffres de vanité.'],
        proofTitle: 'Le SEO est intégré à tout ce que nous livrons',
        proof: 'Nos projets studio, comme [Trust Drivers Tours](/fr/work/trust-drivers) et [Morocco Atlas Guide](/fr/work/morocco-atlas-guide), nous servent de terrain d’essai sur de vraies recherches du voyage et du local au Maroc. Ce qui y fonctionne — structure, vitesse, signaux locaux, contenu utile — est ce que nous appliquons aux sites clients.',
        cta: 'Demander un audit SEO',
        ctaNote: 'Partagez votre site et vos objectifs. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Combien coûte le SEO au Maroc ?', answer: 'Cela dépend de votre marché et de votre point de départ. Après une revue gratuite de votre site, nous proposons un plan mensuel cadré ou une intervention technique ponctuelle, avec des livrables clairs — pas de forfait flou. Si vous avez besoin de demandes pendant que le SEO progresse, [Google Ads](/fr/agence-google-ads-maroc) peut tourner en parallèle.' },
          { question: 'En combien de temps le SEO donne-t-il des résultats ?', answer: 'Les corrections techniques et le SEO local bougent souvent en quelques semaines. Les mots-clés commerciaux concurrentiels demandent en général trois à six mois de travail régulier. Nous fixons les attentes dès la première revue.' },
          { question: 'Gérez-vous aussi la fiche Google Business ?', answer: 'Oui. Pour les entreprises locales à Marrakech et partout au Maroc, le pack local est souvent le gain le plus rapide : nous optimisons la fiche, les catégories, les photos et les avis en parallèle du site. Notre [guide de la fiche Google Business au Maroc](/fr/blog/fiche-google-business-maroc) explique la méthode.' },
        ],
      },
    },
  },
  {
    slug: 'web-design-rabat',
    primaryKeyword: 'agence web rabat',
    keywords: ['agence web rabat', 'création site web rabat', 'agence de communication rabat', 'agence marketing digital rabat', 'site vitrine rabat'],
    relatedProjectIds: ['trust-drivers', 'your-morocco', 'yoo-marrakech'],
    relatedPageSlugs: ['web-design-casablanca', 'web-design-marrakech', 'web-design-agadir', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'website-design-marrakech-business-guide'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Web Agency for Rabat Businesses',
        description: 'Web agency for Rabat businesses: fast, bilingual, SEO-ready websites for institutions, services, and firms. Free quote within one business day.',
        eyebrow: 'Websites for Rabat',
        heading: 'Websites for Rabat businesses that look as serious as you are.',
        lead: 'Rabat runs on credibility: institutions, professional services, consultancies, and B2B firms. Your website has to communicate competence in seconds — in French and English — and make contact effortless.',
        outcomesTitle: 'What a Rabat business website needs',
        outcomes: ['A professional first impression that matches an institutional, B2B, or service audience.', 'French and English planned together for administrations, partners, and international contacts.', 'Fast, accessible pages that work on any connection and any device.', 'Clear contact routes: quote request, email, phone, and WhatsApp from every page.'],
        proofTitle: 'Built remotely, managed closely',
        proof: 'We are based in Marrakech and work with clients across Morocco. Projects run on calls, WhatsApp, and shared previews — you see the site take shape before it goes live, wherever you are.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'Do you work with clients in Rabat from Marrakech?', answer: 'Yes. Most projects run remotely through calls, WhatsApp, and shared previews, so distance changes nothing. For larger engagements we can travel to Rabat for a kickoff meeting.' },
          { question: 'How much does a website cost in Rabat?', answer: 'The same transparent pricing applies across Morocco: a showcase website starts from 2,000 MAD and scales with pages, languages, and features. [E-commerce](/en/creation-site-e-commerce-maroc) starts from 3,500 MAD. You get a precise, free quote within one business day.' },
          { question: 'Can you build a bilingual or trilingual website?', answer: 'Yes. French and English are planned from the start — structure, navigation, metadata, and conversion paths. Arabic can be added when your audience needs it.' },
        ],
      },
      fr: {
        title: 'Agence web à Rabat - Création de site',
        description: 'Agence web pour les entreprises de Rabat : création de sites rapides, bilingues et prêts pour le SEO. Devis gratuit sous un jour ouvré.',
        eyebrow: 'Sites web à Rabat',
        heading: 'Création de site web à Rabat, aussi sérieuse que votre activité.',
        lead: 'Rabat fonctionne à la crédibilité : institutions, services professionnels, cabinets et B2B. Votre site doit démontrer votre compétence en quelques secondes — en français et en anglais — et rendre le contact évident.',
        outcomesTitle: 'Ce que votre site à Rabat doit accomplir',
        outcomes: ['Une première impression professionnelle, à la hauteur d’un public institutionnel, B2B ou de services.', 'Le français et l’anglais pensés ensemble pour les administrations, partenaires et contacts internationaux.', 'Des pages rapides et accessibles, sur toutes les connexions et tous les écrans.', 'Des parcours de contact clairs : devis, email, téléphone et WhatsApp depuis chaque page.'],
        proofTitle: 'À distance, mais suivi de près',
        proof: 'Nous sommes basés à Marrakech et travaillons avec des clients dans tout le Maroc. Les projets se pilotent par appels, WhatsApp et aperçus partagés : vous voyez le site avancer avant sa mise en ligne, où que vous soyez.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Travaillez-vous avec des clients à Rabat depuis Marrakech ?', answer: 'Oui. La plupart des projets se pilotent à distance par appels, WhatsApp et aperçus partagés : la distance ne change rien. Pour les projets importants, nous pouvons nous déplacer à Rabat pour une réunion de lancement.' },
          { question: 'Combien coûte un site web à Rabat ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un [site e-commerce](/fr/creation-site-e-commerce-maroc) démarre à partir de 3 500 DH. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
          { question: 'Pouvez-vous créer un site bilingue ou trilingue ?', answer: 'Oui. Le français et l’anglais sont prévus dès le départ — structure, navigation, métadonnées et parcours de conversion. L’arabe peut être ajouté si votre audience en a besoin.' },
        ],
      },
    },
  },
  {
    slug: 'web-design-agadir',
    primaryKeyword: 'agence web agadir',
    keywords: ['agence web agadir', 'création site web agadir', 'agence de marketing digital agadir', 'site web tourisme agadir', 'site web hôtel agadir'],
    relatedProjectIds: ['flying-tandem', 'kasbah-angour', 'your-morocco'],
    relatedPageSlugs: ['site-web-agence-de-voyage', 'hotel-website-design', 'tourism-websites-morocco', 'web-design-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Web Agency for Agadir Businesses',
        description: 'Web agency for Agadir businesses: websites for hotels, surf camps, tours, and local services — fast, bilingual, SEO-ready, with a free quote.',
        eyebrow: 'Websites for Agadir',
        heading: 'Websites for Agadir businesses built to win the booking.',
        lead: 'Agadir lives on visitors: hotels, surf camps, excursions, restaurants, and the services around them. Your website has to convince a traveler on their phone — before they scroll to a competitor or an OTA.',
        outcomesTitle: 'What an Agadir business website needs',
        outcomes: ['Mobile-first pages for travelers comparing options between two beach sessions.', 'French and English together, because your guests arrive from everywhere.', 'Direct enquiry and WhatsApp routes that reduce dependence on commission platforms.', 'SEO foundations so “Agadir + your service” searches actually find you.'],
        proofTitle: 'Tourism is our home ground',
        proof: 'Paragliding experiences, an Atlas hotel, tour platforms, destination guides — our portfolio is built on Moroccan tourism, where mobile clarity and trust decide whether an enquiry happens.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'Do you work with clients in Agadir from Marrakech?', answer: 'Yes. Projects run remotely through calls, WhatsApp, and shared previews — the same way we already work with tourism clients across Morocco.' },
          { question: 'Can the website reduce OTA commissions?', answer: 'A website cannot replace platforms overnight, but clear direct-booking paths, trust signals, and WhatsApp contact can shift a share of bookings to commission-free channels. See how we build [websites for travel agencies, tours and activities](/en/site-web-agence-de-voyage).' },
          { question: 'How much does a website cost in Agadir?', answer: 'The same transparent pricing applies across Morocco: showcase sites from 2,000 MAD, e-commerce from 3,500 MAD, and custom quotes for booking-focused [hotel](/en/hotel-website-design) or [activity](/en/site-web-agence-de-voyage) websites — free and precise within one business day.' },
        ],
      },
      fr: {
        title: 'Agence web à Agadir - Création de site',
        description: 'Agence web pour les entreprises d’Agadir : sites pour hôtels, surf camps, excursions et services locaux — rapides, bilingues et prêts pour le SEO.',
        eyebrow: 'Sites web à Agadir',
        heading: 'Création de site web à Agadir, pensée pour gagner la réservation.',
        lead: 'Agadir vit de ses visiteurs : hôtels, surf camps, excursions, restaurants et tous les services autour. Votre site doit convaincre un voyageur sur son téléphone — avant qu’il ne passe à un concurrent ou à une plateforme.',
        outcomesTitle: 'Ce que votre site à Agadir doit accomplir',
        outcomes: ['Des pages mobiles pour des voyageurs qui comparent entre deux sessions de plage.', 'Le français et l’anglais ensemble, parce que vos clients viennent de partout.', 'Des demandes directes et WhatsApp pour réduire la dépendance aux plateformes à commission.', 'Des fondations SEO pour que les recherches « Agadir + votre service » vous trouvent vraiment.'],
        proofTitle: 'Le tourisme est notre terrain',
        proof: 'Parapente, hôtel de l’Atlas, plateformes de circuits, guides de destination — notre portfolio est construit sur le tourisme marocain, là où la clarté mobile et la confiance déclenchent la demande.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Travaillez-vous avec des clients à Agadir depuis Marrakech ?', answer: 'Oui. Les projets se pilotent à distance par appels, WhatsApp et aperçus partagés — comme nous le faisons déjà avec des clients tourisme dans tout le Maroc.' },
          { question: 'Un site peut-il réduire les commissions des plateformes ?', answer: 'Un site ne remplace pas les plateformes du jour au lendemain, mais des parcours de réservation directe clairs, des signaux de confiance et un contact WhatsApp peuvent déplacer une partie des réservations vers des canaux sans commission. Voir notre approche des [sites pour agences de voyage, excursions et activités](/fr/site-web-agence-de-voyage).' },
          { question: 'Combien coûte un site web à Agadir ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : site vitrine à partir de 2 000 DH, e-commerce à partir de 3 500 DH, et devis sur mesure pour les [sites hôteliers](/fr/hotel-website-design) ou [d’activités](/fr/site-web-agence-de-voyage) orientés réservation — gratuit et précis sous un jour ouvré.' },
        ],
      },
    },
  },
  {
    slug: 'hotel-website-design',
    primaryKeyword: 'hotel website design',
    keywords: ['hotel website design', 'riad website design', 'boutique hotel website design', 'hotel seo agency', 'travel agency website design', 'tour operator website design'],
    relatedProjectIds: ['kasbah-angour', 'flying-tandem', 'morocco-atlas-guide'],
    relatedPageSlugs: ['tourism-websites-morocco', 'site-web-agence-de-voyage', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Hotel & Riad Website Design',
        description: 'Website design for hotels, riads, and boutique stays: direct-booking focus, hotel SEO, and mobile-first pages that turn lookers into direct enquiries.',
        eyebrow: 'Hotels, riads & boutique stays',
        heading: 'Hotel and riad websites designed to win the direct booking.',
        lead: 'Every guest who books direct instead of through an OTA saves you 15-25% commission. That is what your website is for: showing the property honestly, answering the questions guests actually have, and making direct contact the easy path.',
        outcomesTitle: 'Designed around how guests decide',
        outcomes: ['Room and suite pages built for comparison: photos, details, and rates without a maze.', 'Trust answered up front: location, airport access, food, safety, and what is included.', 'Direct booking and WhatsApp enquiry paths placed where decision moments happen.', 'Hotel SEO foundations: schema, speed, and content that ranks for your property and area.'],
        proofTitle: 'We build for Moroccan hospitality',
        proof: 'From [an Atlas mountain hotel](/en/work/kasbah-angour) to adventure tourism and destination guides, our work is rooted in how travelers research Morocco — on a phone, between reviews, ready to message the property that feels clear and credible.',
        cta: 'Talk about your property',
        ctaNote: 'Tell us about your hotel, riad, or guesthouse. We reply within one business day.',
        faqs: [
          { question: 'Can the website take direct bookings?', answer: 'Yes. Depending on your operation we integrate a booking engine, a request-to-book flow, or a WhatsApp-first enquiry path — whichever converts best for your property size and team.' },
          { question: 'Do you also do SEO for hotels?', answer: 'Yes. [Hotel SEO](/en/agence-seo-marrakech) is one of our core services: property and area pages, schema markup, review signals, and content that answers the searches travelers make before booking. Our [tourism SEO guide](/en/blog/tourism-hospitality-seo-morocco) shows the method.' },
          { question: 'How much does a hotel or riad website cost?', answer: 'Showcase property sites start from 2,000 MAD. Direct-booking builds are quoted on scope — engine integration, languages, and content volume — with a free, precise quote within one business day.' },
        ],
      },
      fr: {
        title: 'Site web pour hôtel et riad',
        description: 'Création de site web pour hôtels, riads et maisons d’hôtes : réservation directe, SEO hôtelier et pages mobiles qui transforment les visites en demandes.',
        eyebrow: 'Hôtels, riads & maisons d’hôtes',
        heading: 'Des sites d’hôtels et de riads conçus pour gagner la réservation directe.',
        lead: 'Chaque client qui réserve en direct plutôt que via une plateforme vous économise 15 à 25 % de commission. C’est le rôle de votre site : montrer le lieu honnêtement, répondre aux vraies questions des voyageurs et faire du contact direct le chemin le plus simple.',
        outcomesTitle: 'Pensé selon la décision du voyageur',
        outcomes: ['Des pages chambres et suites faites pour comparer : photos, détails et tarifs sans labyrinthe.', 'La confiance traitée d’emblée : localisation, accès aéroport, restauration, sécurité et inclusions.', 'Réservation directe et WhatsApp placés aux moments de décision.', 'Des fondations SEO hôtelières : données structurées, vitesse et contenu qui positionne votre établissement et sa région.'],
        proofTitle: 'Nous construisons pour l’hôtellerie marocaine',
        proof: 'D’[un hôtel de l’Atlas](/fr/work/kasbah-angour) aux activités touristiques et guides de destination, notre travail suit la manière dont les voyageurs préparent le Maroc — sur mobile, entre deux avis, prêts à écrire à l’établissement qui paraît clair et crédible.',
        cta: 'Parler de votre établissement',
        ctaNote: 'Présentez votre hôtel, riad ou maison d’hôtes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Le site peut-il prendre des réservations directes ?', answer: 'Oui. Selon votre organisation, nous intégrons un moteur de réservation, un parcours de demande de réservation ou un contact WhatsApp prioritaire — ce qui convertit le mieux pour votre taille d’établissement et votre équipe.' },
          { question: 'Faites-vous aussi le SEO pour les hôtels ?', answer: 'Oui. Le [SEO hôtelier](/fr/agence-seo-marrakech) est un de nos services clés : pages établissement et région, données structurées, signaux d’avis et contenu qui répond aux recherches des voyageurs avant réservation. Notre [guide SEO tourisme](/fr/blog/tourism-hospitality-seo-morocco) montre la méthode.' },
          { question: 'Combien coûte un site pour hôtel ou riad ?', answer: 'Un site vitrine d’établissement démarre à partir de 2 000 DH. Les projets orientés réservation directe sont établis sur devis — moteur de réservation, langues et volume de contenu — avec un chiffrage gratuit et précis sous un jour ouvré.' },
        ],
      },
    },
  },
  {
    slug: 'agence-google-ads-maroc',
    primaryKeyword: 'agence google ads maroc',
    keywords: ['agence google ads maroc', 'agence google ads marrakech', 'campagne google ads maroc', 'agence sea maroc', 'publicité google maroc'],
    relatedProjectIds: ['trust-drivers', 'yoo-marrakech', 'by-marrakech'],
    relatedPageSlugs: ['seo-landing-pages', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['seo-strategies-for-agencies', 'combien-coute-site-web-maroc'],
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Google Ads Agency in Morocco',
        description: 'Google Ads agency in Morocco: campaigns, landing pages, and conversion tracking built together, so every dirham of ad spend can be measured.',
        eyebrow: 'Google Ads & paid search',
        heading: 'Google Ads in Morocco, measured down to the enquiry.',
        lead: 'Most wasted ad budgets share one cause: campaigns sending clicks to pages that cannot convert or be measured. We run the campaign, the landing page, and the tracking as one system.',
        outcomesTitle: 'How we run paid search',
        outcomes: ['Campaign structure matched to real Moroccan search demand, in French and English.', 'Landing pages whose message matches the ad — no generic homepage traffic.', 'Conversion tracking wired to real actions: forms, WhatsApp, calls, and bookings.', 'Weekly signal checks: search terms, quality scores, and cost per enquiry — not just clicks.'],
        proofTitle: 'We run our own campaigns too',
        proof: 'We built the conversion tracking on our own Google Ads account: form leads, WhatsApp clicks, and attribution of every enquiry. That method, with the [landing pages](/en/seo-landing-pages) that go with it, is what we apply to your campaigns.',
        cta: 'Plan a campaign review',
        ctaNote: 'Tell us your offer and budget. We reply within one business day.',
        faqs: [
          { question: 'What budget do I need for Google Ads in Morocco?', answer: 'Meaningful data usually starts around 3,000-5,000 MAD per month in ad spend for local services, more in competitive niches. We size the recommendation to your market before you commit.' },
          { question: 'Do you build the landing pages too?', answer: 'Yes, and we recommend it. A message-matched landing page with proper conversion events stops you paying for clicks that land on a generic page that does not answer the search. See our [SEO-ready landing pages](/en/seo-landing-pages).' },
          { question: 'How do you report performance?', answer: 'You see cost per enquiry, not just clicks: qualified form submissions, WhatsApp conversations, and calls tracked as conversions, reported in plain language every month.' },
        ],
      },
      fr: {
        title: 'Agence Google Ads au Maroc',
        description: 'Agence Google Ads au Maroc : campagnes, landing pages et suivi des conversions construits ensemble, pour mesurer chaque dirham investi.',
        eyebrow: 'Google Ads & référencement payant',
        heading: 'Google Ads au Maroc, mesuré jusqu’à la demande client.',
        lead: 'La plupart des budgets publicitaires gaspillés ont la même cause : des campagnes qui envoient des clics vers des pages incapables de convertir ou d’être mesurées. Nous pilotons la campagne, la landing page et le tracking comme un seul système.',
        outcomesTitle: 'Notre façon de gérer le paid search',
        outcomes: ['Une structure de campagne alignée sur la vraie demande marocaine, en français et en anglais.', 'Des landing pages dont le message correspond à l’annonce — pas de trafic vers une page d’accueil générique.', 'Un suivi des conversions branché sur de vraies actions : formulaires, WhatsApp, appels et réservations.', 'Des contrôles hebdomadaires : termes de recherche, niveaux de qualité et coût par demande — pas seulement des clics.'],
        proofTitle: 'Nous gérons aussi nos propres campagnes',
        proof: 'Nous avons construit le suivi des conversions de notre propre compte Google Ads : formulaires, clics WhatsApp et attribution de chaque demande. C’est cette méthode, avec les [landing pages](/fr/seo-landing-pages) qui vont avec, que nous appliquons à vos campagnes.',
        cta: 'Planifier une revue de campagne',
        ctaNote: 'Présentez votre offre et votre budget. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Quel budget faut-il pour Google Ads au Maroc ?', answer: 'Des données significatives commencent généralement autour de 3 000 à 5 000 DH par mois de budget publicitaire pour des services locaux, davantage dans les niches concurrentielles. Nous dimensionnons la recommandation à votre marché avant tout engagement.' },
          { question: 'Créez-vous aussi les landing pages ?', answer: 'Oui, et nous le recommandons. Une landing page alignée sur le message de l’annonce, avec de vrais événements de conversion, évite de payer des clics envoyés vers une page générique qui ne répond pas à la recherche. Voir nos [landing pages SEO et Google Ads](/fr/seo-landing-pages).' },
          { question: 'Comment présentez-vous les résultats ?', answer: 'Vous voyez le coût par demande, pas seulement les clics : formulaires qualifiés, conversations WhatsApp et appels suivis comme conversions, présentés en langage clair chaque mois.' },
        ],
      },
    },
  },
  {
    slug: 'site-web-agence-de-voyage',
    primaryKeyword: 'site web agence de voyage',
    keywords: ['site web agence de voyage', 'création site web agence de voyage', 'site web pour agence de voyage', 'site agence de voyage maroc', 'site de réservation excursion', 'tour operator website design', 'tour booking website Morocco'],
    relatedProjectIds: ['flying-tandem', 'your-morocco', 'trust-drivers'],
    relatedPageSlugs: ['tourism-websites-morocco', 'hotel-website-design', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Websites for Travel Agencies, Tours and Activities in Morocco',
        description: 'Website design for travel agencies, tours and activity operators in Morocco: one page per activity, visible prices, booking requests and WhatsApp. From 2,000 MAD.',
        eyebrow: 'Travel agencies, tours and activities',
        heading: 'A travel agency website that takes bookings directly, not only through the platforms.',
        lead: 'For inbound agencies, tour and activity operators, and tourist transport in Morocco: one page per activity and place, the details a traveler checks before paying, and WhatsApp next to the price. It is the booking side of our [tourism and hospitality websites](/en/tourism-websites-morocco).',
        outcomesTitle: 'What your website needs to do',
        outcomes: [
          'One page per activity and place, so each search can find you: quad biking in the Palmeraie, a dinner in the Agafay desert, a day trip to the Ourika valley.',
          'The details that settle a booking: duration, start time, pickup or meeting point, what is included, group size, and cancellation terms.',
          'A price or a clear “from” price on every page, so travelers do not go back to the platform listing that shows one.',
          'A short booking request and a WhatsApp button with a pre-filled message that names the activity.',
          'French and English versions, each with pages Google can index.',
        ],
        proofTitle: 'Built on real travel websites',
        proof: 'We built the website for [Flying Tandem](/en/work/flying-tandem), a paragliding operator near Marrakech, and for [Your Morocco](/en/work/your-morocco), a tour platform. We also run our own test sites such as [Trust Drivers Tours](/en/work/trust-drivers), where we try page structures on real searches before we offer them to clients.',
        cta: 'Plan my agency website',
        ctaNote: 'Tell us your activities and how you take bookings today. We reply within one business day.',
        sections: [
          {
            heading: 'Platforms and a direct website do different jobs',
            paragraphs: [
              'Marketplaces such as GetYourGuide and Viator bring travelers who have never heard of you, and they take a commission on each booking they deliver. A direct website does not replace that discovery.',
              'Its job is the travelers who already know you: repeat guests, recommendations, people who search your name or find your Google Business Profile, and visitors from Instagram. Each of them who books on your site instead of on a platform is a booking without commission.',
            ],
          },
          {
            heading: 'Three ways to take bookings',
            paragraphs: [
              'A booking request form with manual confirmation suits most small operators: the traveler picks a date and group size, you confirm availability and price.',
              'WhatsApp first is how most enquiries arrive in Morocco. The button sits next to the price and the itinerary, and the message is pre-filled with the activity and date so you can answer fast.',
              'An online booking engine with payment makes sense when you have many departures a day. If you already use one, we place it on your activity pages; if not, we decide together at scoping whether the volume justifies it.',
            ],
          },
          {
            heading: 'What brings travelers from Google',
            paragraphs: [
              'Travelers search the activity and the place together, then compare three or four operators on their phone. A page per activity and place, with real photos, practical details and a price, is what lets you appear in that comparison.',
              'Your Google Business Profile matters as much as the site for “near me” and map searches, and reviews linked to their source carry more weight than copied quotes. Our [tourism SEO guide for Morocco](/en/blog/tourism-hospitality-seo-morocco) has the full checklist, and our [SEO agency in Marrakech](/en/agence-seo-marrakech) can run it for you.',
            ],
          },
        ],
        faqs: [
          { question: 'How much does a travel agency website cost?', answer: 'A showcase website starts from 2,000 MAD: activity pages, prices, a booking request and WhatsApp. A website with online booking and payment is quoted on scope, depending on the number of activities, languages and the booking engine. Our [website pricing guide for Morocco](/en/blog/combien-coute-site-web-maroc) explains what moves a quote.' },
          { question: 'Should I leave GetYourGuide or Viator?', answer: 'No. Platforms are useful for discovery. The website is there so travelers who already know you can book you directly, without the platform’s commission on that booking.' },
          { question: 'How long does it take to go live?', answer: 'Plan for 2 to 3 days for a defined-scope showcase site. A website with online booking gets a precise timeline with the quote.' },
          { question: 'Can the site be in French and English?', answer: 'Yes. Both languages are planned from the start, with their own pages, navigation and metadata so each can be found on Google.' },
        ],
      },
      fr: {
        title: 'Site web pour agence de voyage, excursions et activités au Maroc',
        description: 'Création de site web pour agences de voyage, excursions et activités au Maroc : une page par activité, prix affichés, demande de réservation et WhatsApp. À partir de 2 000 MAD.',
        eyebrow: 'Agences de voyage, excursions et activités',
        heading: 'Un site d’agence de voyage qui reçoit les réservations en direct, pas seulement via les plateformes.',
        lead: 'Pour les agences réceptives, les prestataires d’excursions et d’activités et le transport touristique au Maroc : une page par activité et par lieu, les informations que le voyageur vérifie avant de payer, et WhatsApp à côté du prix. C’est le volet réservation de nos [sites tourisme et hôtellerie](/fr/tourism-websites-morocco).',
        outcomesTitle: 'Ce que votre site doit faire',
        outcomes: [
          'Une page par activité et par lieu, pour être trouvé sur chaque recherche : quad dans la Palmeraie, dîner dans le désert d’Agafay, excursion dans la vallée de l’Ourika.',
          'Les informations qui décident d’une réservation : durée, heure de départ, prise en charge ou point de rendez-vous, ce qui est inclus, taille du groupe et conditions d’annulation.',
          'Un prix, ou un prix « à partir de » clair, sur chaque page, pour que le voyageur ne retourne pas sur la fiche de la plateforme qui en affiche un.',
          'Une demande de réservation courte et un bouton WhatsApp avec un message pré-rempli qui nomme l’activité.',
          'Des versions française et anglaise, chacune avec des pages que Google peut indexer.',
        ],
        proofTitle: 'Construit sur de vrais sites de voyage',
        proof: 'Nous avons créé le site de [Flying Tandem](/fr/work/flying-tandem), un opérateur de parapente près de Marrakech, et celui de [Your Morocco](/fr/work/your-morocco), une plateforme de circuits. Nous gérons aussi nos propres sites d’essai comme [Trust Drivers Tours](/fr/work/trust-drivers), où nous testons les structures de pages sur de vraies recherches avant de les proposer à nos clients.',
        cta: 'Préparer le site de mon agence',
        ctaNote: 'Présentez vos activités et la façon dont vous prenez les réservations aujourd’hui. Nous répondons sous un jour ouvré.',
        sections: [
          {
            heading: 'Plateformes et site direct ne font pas le même travail',
            paragraphs: [
              'Les places de marché comme GetYourGuide et Viator amènent des voyageurs qui ne vous connaissent pas encore, et prennent une commission sur chaque réservation qu’elles apportent. Un site direct ne remplace pas cette visibilité.',
              'Son rôle, ce sont les voyageurs qui vous connaissent déjà : clients qui reviennent, recommandations, personnes qui cherchent votre nom ou trouvent votre fiche Google, visiteurs venus d’Instagram. Chacun d’eux qui réserve sur votre site plutôt que sur une plateforme, c’est une réservation sans commission.',
            ],
          },
          {
            heading: 'Trois façons de prendre les réservations',
            paragraphs: [
              'Un formulaire de demande avec confirmation manuelle convient à la plupart des petits prestataires : le voyageur choisit une date et le nombre de personnes, vous confirmez la disponibilité et le prix.',
              'WhatsApp d’abord, parce que c’est par là qu’arrivent la plupart des demandes au Maroc. Le bouton est placé à côté du prix et de l’itinéraire, et le message est pré-rempli avec l’activité et la date pour que vous répondiez vite.',
              'Un moteur de réservation en ligne avec paiement se justifie quand vous avez plusieurs départs par jour. Si vous en utilisez déjà un, nous l’intégrons à vos pages d’activités ; sinon, nous décidons ensemble au cadrage si votre volume le justifie.',
            ],
          },
          {
            heading: 'Ce qui fait venir les voyageurs depuis Google',
            paragraphs: [
              'Le voyageur tape l’activité et le lieu ensemble, puis compare trois ou quatre prestataires sur son téléphone. Une page par activité et par lieu, avec de vraies photos, les informations pratiques et un prix, c’est ce qui vous fait entrer dans cette comparaison.',
              'Pour les recherches « près de moi » et sur la carte, votre fiche Google Business compte autant que le site, et des avis reliés à leur source pèsent plus que des citations recopiées. Notre [guide SEO pour le tourisme au Maroc](/fr/blog/tourism-hospitality-seo-morocco) donne la liste complète, et notre [agence SEO à Marrakech](/fr/agence-seo-marrakech) peut la mettre en œuvre pour vous.',
            ],
          },
        ],
        faqs: [
          { question: 'Combien coûte un site pour une agence de voyage ?', answer: 'Un site vitrine démarre à partir de 2 000 DH : pages d’activités, prix, demande de réservation et WhatsApp. Un site avec réservation et paiement en ligne est établi sur devis, selon le nombre d’activités, les langues et le moteur choisi. Notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier un devis.' },
          { question: 'Faut-il quitter GetYourGuide ou Viator ?', answer: 'Non. Les plateformes restent utiles pour être découvert. Le site sert à ce que les voyageurs qui vous connaissent déjà réservent en direct, sans la commission de la plateforme sur cette réservation.' },
          { question: 'En combien de temps le site est-il en ligne ?', answer: 'Comptez 2 à 3 jours pour un site vitrine à périmètre défini. Un site avec réservation en ligne reçoit un calendrier précis avec le devis.' },
          { question: 'Le site peut-il être en français et en anglais ?', answer: 'Oui. Les deux langues sont prévues dès le départ, avec leurs propres pages, leur navigation et leurs métadonnées, pour que chacune puisse être trouvée sur Google.' },
        ],
      },
    },
  },
  {
    slug: 'creation-site-e-commerce-maroc',
    primaryKeyword: 'création site e-commerce maroc',
    keywords: ['création site e-commerce maroc', 'creation site web e commerce maroc', 'création boutique en ligne maroc', 'prix site e-commerce maroc', 'e-commerce website Morocco'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'kasbah-angour'],
    relatedPageSlugs: ['web-design-marrakech', 'website-design-moroccan-businesses', 'seo-landing-pages', 'agence-seo-marrakech'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'website-design-marrakech-business-guide'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'E-commerce Website Design in Morocco',
        description: 'E-commerce website design in Morocco from 3,500 MAD, front-end and back-end included: product catalogue, cart and checkout built for mobile, in French and English.',
        eyebrow: 'Online stores in Morocco',
        heading: 'An online store in Morocco that sells on mobile, with the payment your customers use.',
        lead: 'E-commerce websites for Moroccan brands and shops: product catalogue, cart and checkout designed for mobile, in French and English, from 3,500 MAD with front-end and back-end included. Our [website pricing guide](/en/blog/combien-coute-site-web-maroc) explains what moves the price.',
        outcomesTitle: 'What your store needs to do',
        outcomes: [
          'Clear product pages on mobile: photos, price, sizes or variants, availability.',
          'A short checkout, with the payment method agreed at scoping: cash on delivery, bank transfer or card.',
          'WhatsApp for questions before purchase, without leaving the product page.',
          'Category pages structured for Google, in French and English when you need both.',
        ],
        proofTitle: 'The same foundations as our fast websites',
        proof: 'Our published work is mostly tourism and local brands, such as the [Yoo Marrakech](/en/work/yoo-marrakech) studio concept. Online stores sit on the same foundations: pages that load fast on mobile, a structure Google can read, and as few steps as possible between interest and order.',
        cta: 'Plan my online store',
        ctaNote: 'Tell us what you sell and roughly how many products. We reply within one business day.',
        sections: [
          {
            heading: 'Decide on payment before the build',
            paragraphs: [
              'Many Moroccan stores start with cash on delivery: the customer orders online and pays the courier. It is simple to launch, but the order journey has to plan for confirming orders, often by phone or WhatsApp, and for returns.',
              'Card payment goes through an approved payment provider and needs a contract with your bank. We scope it with you when your order volume justifies it, so it does not delay the launch.',
            ],
          },
          {
            heading: 'What changes the price of a store',
            paragraphs: [
              'The number of products and variants, the languages, the payment method, and any link to stock or delivery tools are what move a quote. Content you already have, such as product photos and descriptions, shortens the work.',
              'If you sell a handful of products and take orders on WhatsApp, a [showcase website](/en/web-design-marrakech) with an order button may be enough to start. We will tell you which one fits before you commit.',
            ],
          },
        ],
        faqs: [
          { question: 'How much does an e-commerce website cost in Morocco?', answer: 'From 3,500 MAD, front-end and back-end included. The quote depends on the number of products, languages, payment method and integrations. We send a precise figure within one business day, and our [pricing guide](/en/blog/combien-coute-site-web-maroc) has the detail.' },
          { question: 'Can I offer cash on delivery?', answer: 'Yes. It is the most common way to start in Morocco, and we plan order confirmation into the journey.' },
          { question: 'How long does it take to build an online store?', answer: 'A precise timeline is agreed with the quote, depending on the number of products and the payment method chosen.' },
          { question: 'Will the store be found on Google?', answer: 'Every build includes SEO foundations: clean category and product pages, metadata and speed. For ongoing work on rankings, see our [SEO agency in Marrakech](/en/agence-seo-marrakech).' },
        ],
      },
      fr: {
        title: 'Création de site e-commerce au Maroc',
        description: 'Création de site e-commerce au Maroc à partir de 3 500 MAD, front et back inclus : catalogue, panier et commande pensés pour le mobile, en français et en anglais.',
        eyebrow: 'Boutiques en ligne au Maroc',
        heading: 'Une boutique en ligne au Maroc qui vend sur mobile, avec le paiement que vos clients utilisent.',
        lead: 'Création de site e-commerce pour les marques et commerces marocains : catalogue, panier et commande pensés pour le mobile, en français et en anglais, à partir de 3 500 MAD, front et back inclus. Notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier le prix.',
        outcomesTitle: 'Ce que votre boutique doit faire',
        outcomes: [
          'Des fiches produits claires sur mobile : photos, prix, tailles ou variantes, disponibilité.',
          'Une commande courte, avec le mode de paiement défini au cadrage : paiement à la livraison, virement ou carte.',
          'WhatsApp pour les questions avant l’achat, sans quitter la fiche produit.',
          'Des pages catégories structurées pour Google, en français et en anglais si vous avez besoin des deux.',
        ],
        proofTitle: 'La même base que nos sites rapides',
        proof: 'Nos réalisations publiées sont surtout dans le tourisme et les marques locales, comme le concept studio [Yoo Marrakech](/fr/work/yoo-marrakech). Une boutique en ligne repose sur la même base : des pages rapides sur mobile, une structure que Google comprend, et le moins d’étapes possible entre l’intérêt et la commande.',
        cta: 'Préparer ma boutique en ligne',
        ctaNote: 'Dites-nous ce que vous vendez et à peu près combien de produits. Nous répondons sous un jour ouvré.',
        sections: [
          {
            heading: 'Le paiement se décide avant la création',
            paragraphs: [
              'Beaucoup de boutiques marocaines démarrent avec le paiement à la livraison : le client commande en ligne et paie le livreur. C’est simple à lancer, mais le parcours doit prévoir la confirmation des commandes, souvent par téléphone ou WhatsApp, et les retours.',
              'Le paiement par carte passe par un prestataire de paiement agréé et demande un contrat avec votre banque. Nous le cadrons avec vous quand votre volume de commandes le justifie, pour qu’il ne retarde pas le lancement.',
            ],
          },
          {
            heading: 'Ce qui fait varier le prix d’une boutique',
            paragraphs: [
              'Le nombre de produits et de variantes, les langues, le mode de paiement et les liens éventuels avec le stock ou la livraison font varier un devis. Le contenu que vous avez déjà, comme les photos et descriptions produits, raccourcit le travail.',
              'Si vous vendez quelques produits et prenez les commandes sur WhatsApp, un [site vitrine](/fr/web-design-marrakech) avec un bouton de commande peut suffire pour démarrer. Nous vous disons lequel convient avant tout engagement.',
            ],
          },
        ],
        faqs: [
          { question: 'Combien coûte un site e-commerce au Maroc ?', answer: 'À partir de 3 500 DH, front et back inclus. Le devis dépend du nombre de produits, des langues, du mode de paiement et des intégrations. Nous envoyons un chiffre précis sous un jour ouvré, et notre [guide des prix](/fr/blog/combien-coute-site-web-maroc) donne le détail.' },
          { question: 'Puis-je proposer le paiement à la livraison ?', answer: 'Oui. C’est le mode le plus courant pour démarrer au Maroc, et nous prévoyons la confirmation des commandes dans le parcours.' },
          { question: 'Combien de temps pour créer une boutique en ligne ?', answer: 'Un calendrier précis est fixé avec le devis, selon le nombre de produits et le mode de paiement choisi.' },
          { question: 'La boutique sera-t-elle trouvée sur Google ?', answer: 'Chaque projet intègre des fondations SEO : pages catégories et produits propres, métadonnées et vitesse. Pour un travail suivi sur le positionnement, voir notre [agence SEO à Marrakech](/fr/agence-seo-marrakech).' },
        ],
      },
    },
  },
];

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}
