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
  slug:
    | 'web-design-marrakech'
    | 'tourism-websites-morocco'
    | 'seo-landing-pages'
    | 'web-design-casablanca'
    | 'agence-seo-marrakech'
    | 'web-design-rabat'
    | 'web-design-agadir'
    | 'hotel-website-design'
    | 'agence-google-ads-maroc';
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
      { name: 'Showcase website', fromMad: 3500, note: 'Scales with pages, languages, and features.' },
      { name: 'E-commerce website', fromMad: 6000, note: 'Front-end and back-end included.' },
      { name: 'Riad / hotel direct booking', fromMad: null, note: 'Custom quote based on scope.' },
    ],
    footnote: 'Delivery is 2-3 days for defined-scope showcase sites and landing pages. Booking, e-commerce, and complex integrations get a scoped timeline before work begins.',
  },
  fr: {
    title: 'Combien ça coûte',
    lead: 'Des points de départ transparents, pas un devis. Nous cadrons votre projet, puis nous envoyons un chiffre précis — gratuit, sous un jour ouvré.',
    tiers: [
      { name: 'Site vitrine', fromMad: 3500, note: 'Évolue selon les pages, les langues et les fonctionnalités.' },
      { name: 'Site e-commerce', fromMad: 6000, note: 'Front et back inclus.' },
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
    relatedPageSlugs: ['agence-seo-marrakech', 'tourism-websites-morocco', 'hotel-website-design', 'web-design-casablanca', 'website-design-moroccan-businesses'],
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
        proof: 'Our work includes a paragliding operator near Marrakech, a city guide, and local brand sites. On each one, mobile discovery, trust, and direct enquiries decide whether the website pays for itself.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your project in a few lines. We reply within one business day.',
        faqs: [
          { question: 'How much does a website cost in Marrakech?', answer: 'As an honest starting point: a showcase website starts from 3,500 MAD and scales with pages, languages, and features. An e-commerce site starts from 6,000 MAD, with front-end and back-end included. Larger projects, like a riad direct-booking site or an advanced multilingual build, get a custom quote based on scope. We send a precise, free quote within one business day.' },
          { question: 'How long does it take to build a website?', answer: 'Plan for 2 to 3 days for most defined-scope builds: a simple showcase site moves fastest, while booking or e-commerce features need more preparation. We agree on a clear timeline with the quote.' },
          { question: 'What types of businesses do you work with in Marrakech?', answer: 'We work with hospitality, tourism, local services, restaurants, lifestyle brands, and teams that need a credible website with a clear route to enquiry.' },
          { question: 'Can you build a website in English and French?', answer: 'Yes. We plan language structure, navigation, metadata, and conversion paths for English and French audiences from the beginning.' },
          { question: 'Is SEO included in a new website?', answer: 'Every build includes practical SEO foundations: clean page structure, metadata, performance-minded implementation, sitemap support, and conversion-ready content structure.' },
          { question: 'Do you work outside Marrakech?', answer: 'Yes. We are based in Marrakech and work with clients across Morocco (Casablanca, Rabat, Agadir) as well as remotely for international projects.' },
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
        proof: 'Notre portfolio comprend un opérateur de parapente près de Marrakech, un guide de la ville et des sites de marques locales. Sur chacun, la découverte sur mobile, la confiance et les demandes directes décident si le site est rentable.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Combien coûte un site web à Marrakech ?', answer: 'En clair : un site vitrine démarre à partir de 3 500 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 6 000 DH, front et back inclus. Les projets plus importants, comme un site de réservation directe pour riad ou une structure multilingue avancée, sont établis sur devis selon le périmètre. Nous envoyons un devis gratuit et précis sous un jour ouvré.' },
          { question: 'Combien de temps pour créer un site ?', answer: 'Comptez 2 à 3 jours pour la plupart des sites à périmètre défini : un site vitrine simple avance plus vite, tandis qu’une réservation ou une boutique en ligne demande plus de préparation. Nous fixons un calendrier clair dès le devis.' },
          { question: 'Avec quelles entreprises travaillez-vous à Marrakech ?', answer: 'Nous accompagnons l’hôtellerie, le tourisme, les services locaux, les restaurants, les marques lifestyle et les équipes qui ont besoin d’un site crédible avec un parcours de contact simple.' },
          { question: 'Pouvez-vous créer un site en français et en anglais ?', answer: 'Oui. Nous prévoyons la structure des langues, la navigation, les métadonnées et les parcours de conversion pour les audiences françaises et anglaises dès le départ.' },
          { question: 'Le SEO est-il inclus dans la création du site ?', answer: 'Chaque projet intègre des fondations SEO concrètes : structure de page propre, métadonnées, performance, sitemap et contenu pensé pour la conversion.' },
          { question: 'Travaillez-vous ailleurs qu’à Marrakech ?', answer: 'Oui. Nous sommes basés à Marrakech et accompagnons des clients dans tout le Maroc (Casablanca, Rabat, Agadir) ainsi qu’à distance pour les projets internationaux.' },
        ],
      },
    },
  },
  {
    slug: 'tourism-websites-morocco',
    primaryKeyword: 'tourism website design Morocco',
    keywords: ['tourism website design Morocco', 'hotel website Marrakech', 'travel website Morocco', 'site web tourisme Maroc'],
    relatedProjectIds: ['flying-tandem', 'kasbah-angour', 'morocco-atlas-guide', 'trust-drivers'],
    relatedPageSlugs: ['hotel-website-design', 'web-design-marrakech', 'seo-landing-pages'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
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
    relatedPageSlugs: ['agence-google-ads-maroc', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['seo-strategies-for-agencies', 'website-design-marrakech-business-guide'],
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
    slug: 'web-design-casablanca',
    primaryKeyword: 'agence web casablanca',
    keywords: ['agence web casablanca', 'création site web casablanca', 'création site internet casablanca', 'agence création site web casablanca', 'site vitrine casablanca', 'refonte site web casablanca'],
    relatedProjectIds: ['trust-drivers', 'by-marrakech', 'your-morocco'],
    relatedPageSlugs: ['web-design-rabat', 'web-design-marrakech', 'seo-landing-pages', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'website-design-marrakech-business-guide'],
    showPricing: true,
    modifiedAt: '2026-07-25',
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
          { question: 'How much does a website cost in Casablanca?', answer: 'The same transparent pricing applies across Morocco: a showcase website starts from 3,500 MAD and scales with pages, languages, and features. An e-commerce site starts from 6,000 MAD with front-end and back-end included. You get a precise, free quote within one business day.' },
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
          { question: 'Combien coûte un site web à Casablanca ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : un site vitrine démarre à partir de 3 500 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 6 000 DH, front et back inclus. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
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
    relatedPostSlugs: ['seo-strategies-for-agencies', 'tourism-hospitality-seo-morocco'],
    modifiedAt: '2026-07-30',
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
        proof: 'Our own studio projects rank for competitive Morocco travel and local terms. The same playbook — structure, speed, local signals, useful content — is what we apply to client sites.',
        cta: 'Request an SEO review',
        ctaNote: 'Share your website and goals. We reply within one business day.',
        faqs: [
          { question: 'How much does SEO cost in Morocco?', answer: 'It depends on your market and starting point. After a free review of your site we propose a scoped monthly plan or a one-off technical fix, each with clear deliverables — no vague retainers.' },
          { question: 'How long until SEO shows results?', answer: 'Technical fixes and local SEO often move within weeks. Competitive commercial keywords typically take three to six months of consistent work. We set expectations from the first review.' },
          { question: 'Do you also handle Google Business Profile?', answer: 'Yes. For local businesses in Marrakech and across Morocco, the map pack is often the fastest win, so we optimize your profile, categories, photos, and reviews alongside the website.' },
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
        proof: 'Nos propres projets studio se positionnent sur des requêtes concurrentielles du voyage et du local au Maroc. C’est la même méthode — structure, vitesse, signaux locaux, contenu utile — que nous appliquons aux sites clients.',
        cta: 'Demander un audit SEO',
        ctaNote: 'Partagez votre site et vos objectifs. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Combien coûte le SEO au Maroc ?', answer: 'Cela dépend de votre marché et de votre point de départ. Après une revue gratuite de votre site, nous proposons un plan mensuel cadré ou une intervention technique ponctuelle, avec des livrables clairs — pas de forfait flou.' },
          { question: 'En combien de temps le SEO donne-t-il des résultats ?', answer: 'Les corrections techniques et le SEO local bougent souvent en quelques semaines. Les mots-clés commerciaux concurrentiels demandent en général trois à six mois de travail régulier. Nous fixons les attentes dès la première revue.' },
          { question: 'Gérez-vous aussi la fiche Google Business ?', answer: 'Oui. Pour les entreprises locales à Marrakech et partout au Maroc, le pack local est souvent le gain le plus rapide : nous optimisons la fiche, les catégories, les photos et les avis en parallèle du site.' },
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
    modifiedAt: '2026-07-30',
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
          { question: 'How much does a website cost in Rabat?', answer: 'The same transparent pricing applies across Morocco: a showcase website starts from 3,500 MAD and scales with pages, languages, and features. E-commerce starts from 6,000 MAD. You get a precise, free quote within one business day.' },
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
          { question: 'Combien coûte un site web à Rabat ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : un site vitrine démarre à partir de 3 500 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 6 000 DH. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
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
    relatedPageSlugs: ['tourism-websites-morocco', 'hotel-website-design', 'web-design-marrakech', 'web-design-rabat'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-07-30',
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
          { question: 'Can the website reduce OTA commissions?', answer: 'A website cannot replace platforms overnight, but clear direct-booking paths, trust signals, and WhatsApp contact reliably shift a share of bookings to commission-free channels.' },
          { question: 'How much does a website cost in Agadir?', answer: 'The same transparent pricing applies across Morocco: showcase sites from 3,500 MAD, e-commerce from 6,000 MAD, and custom quotes for booking-focused hotel or activity websites — free and precise within one business day.' },
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
          { question: 'Un site peut-il réduire les commissions des plateformes ?', answer: 'Un site ne remplace pas les plateformes du jour au lendemain, mais des parcours de réservation directe clairs, des signaux de confiance et un contact WhatsApp déplacent durablement une partie des réservations vers des canaux sans commission.' },
          { question: 'Combien coûte un site web à Agadir ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : site vitrine dès 3 500 DH, e-commerce dès 6 000 DH, et devis sur mesure pour les sites hôteliers ou d’activités orientés réservation — gratuit et précis sous un jour ouvré.' },
        ],
      },
    },
  },
  {
    slug: 'hotel-website-design',
    primaryKeyword: 'hotel website design',
    keywords: ['hotel website design', 'riad website design', 'boutique hotel website design', 'hotel seo agency', 'travel agency website design', 'tour operator website design'],
    relatedProjectIds: ['kasbah-angour', 'flying-tandem', 'morocco-atlas-guide'],
    relatedPageSlugs: ['tourism-websites-morocco', 'agence-seo-marrakech', 'web-design-marrakech'],
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-07-30',
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
        proof: 'From an Atlas mountain hotel to adventure tourism and destination guides, our work is rooted in how travelers research Morocco — on a phone, between reviews, ready to message the property that feels clear and credible.',
        cta: 'Talk about your property',
        ctaNote: 'Tell us about your hotel, riad, or guesthouse. We reply within one business day.',
        faqs: [
          { question: 'Can the website take direct bookings?', answer: 'Yes. Depending on your operation we integrate a booking engine, a request-to-book flow, or a WhatsApp-first enquiry path — whichever converts best for your property size and team.' },
          { question: 'Do you also do SEO for hotels?', answer: 'Yes. Hotel SEO is one of our core services: property and area pages, schema markup, review signals, and content that ranks for the searches travelers make before booking.' },
          { question: 'How much does a hotel or riad website cost?', answer: 'Showcase property sites start from 3,500 MAD. Direct-booking builds are quoted on scope — engine integration, languages, and content volume — with a free, precise quote within one business day.' },
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
        proof: 'D’un hôtel de l’Atlas aux activités touristiques et guides de destination, notre travail suit la manière dont les voyageurs préparent le Maroc — sur mobile, entre deux avis, prêts à écrire à l’établissement qui paraît clair et crédible.',
        cta: 'Parler de votre établissement',
        ctaNote: 'Présentez votre hôtel, riad ou maison d’hôtes. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Le site peut-il prendre des réservations directes ?', answer: 'Oui. Selon votre organisation, nous intégrons un moteur de réservation, un parcours de demande de réservation ou un contact WhatsApp prioritaire — ce qui convertit le mieux pour votre taille d’établissement et votre équipe.' },
          { question: 'Faites-vous aussi le SEO pour les hôtels ?', answer: 'Oui. Le SEO hôtelier est un de nos services clés : pages établissement et région, données structurées, signaux d’avis et contenu qui se positionne sur les recherches des voyageurs avant réservation.' },
          { question: 'Combien coûte un site pour hôtel ou riad ?', answer: 'Un site vitrine d’établissement démarre à 3 500 DH. Les projets orientés réservation directe sont établis sur devis — moteur de réservation, langues et volume de contenu — avec un chiffrage gratuit et précis sous un jour ouvré.' },
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
    modifiedAt: '2026-07-30',
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
        proof: 'WeReact runs Google Ads for its own services and studio projects in Morocco. The tracking, attribution, and landing page playbook we sell is the one our own budget depends on.',
        cta: 'Plan a campaign review',
        ctaNote: 'Tell us your offer and budget. We reply within one business day.',
        faqs: [
          { question: 'What budget do I need for Google Ads in Morocco?', answer: 'Meaningful data usually starts around 3,000-5,000 MAD per month in ad spend for local services, more in competitive niches. We size the recommendation to your market before you commit.' },
          { question: 'Do you build the landing pages too?', answer: 'Yes, and we recommend it. Message-matched landing pages with proper conversion events routinely halve the cost per enquiry compared to sending ads to a generic page.' },
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
        proof: 'WeReact pilote Google Ads pour ses propres services et projets studio au Maroc. Le tracking, l’attribution et la méthode landing page que nous vendons sont ceux dont dépend notre propre budget.',
        cta: 'Planifier une revue de campagne',
        ctaNote: 'Présentez votre offre et votre budget. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Quel budget faut-il pour Google Ads au Maroc ?', answer: 'Des données significatives commencent généralement autour de 3 000 à 5 000 DH par mois de budget publicitaire pour des services locaux, davantage dans les niches concurrentielles. Nous dimensionnons la recommandation à votre marché avant tout engagement.' },
          { question: 'Créez-vous aussi les landing pages ?', answer: 'Oui, et nous le recommandons. Des landing pages alignées sur le message de l’annonce, avec de vrais événements de conversion, divisent régulièrement par deux le coût par demande par rapport à une page générique.' },
          { question: 'Comment présentez-vous les résultats ?', answer: 'Vous voyez le coût par demande, pas seulement les clics : formulaires qualifiés, conversations WhatsApp et appels suivis comme conversions, présentés en langage clair chaque mois.' },
        ],
      },
    },
  },
];

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}
