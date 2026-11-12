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
    | 'web-design-casablanca'
    | 'agence-seo-marrakech'
    | 'web-design-rabat'
    | 'web-design-agadir'
    | 'hotel-website-design'
    | 'agence-google-ads-maroc'
    | 'site-web-agence-de-voyage'
    | 'creation-site-e-commerce-maroc'
    | 'web-design-tanger'
    | 'agence-marketing-digital-marrakech';
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
    relatedPageSlugs: ['site-web-agence-de-voyage', 'hotel-website-design', 'agence-seo-marrakech', 'agence-marketing-digital-marrakech', 'creation-site-e-commerce-maroc', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['etude-sites-agences-web-marrakech', 'combien-coute-site-web-maroc', 'website-design-marrakech-business-guide'],
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
        insights: {
          title: 'What we measured in Marrakech',
          lead: 'In November 2026 we checked the 66 agency and freelancer websites ranking on Google for Marrakech. Here is what a buyer finds on them, and why we publish our prices below.',
          items: [
            { figure: '21 of 66', label: 'publish a price for their own services. Ours are on this page.', source: { label: 'WeReact study, Nov 2026', href: '/en/blog/etude-sites-agences-web-marrakech' } },
            { figure: '18 of 66', label: 'give a delivery time with a number. Ours: 2 to 3 days for a defined-scope showcase site.', source: { label: 'WeReact study, Nov 2026', href: '/en/blog/etude-sites-agences-web-marrakech' } },
            { figure: '17 of 34', label: 'of the sites showing reviews link to where those reviews come from.', source: { label: 'WeReact study, Nov 2026', href: '/en/blog/etude-sites-agences-web-marrakech' } },
          ],
          note: 'Agency and freelancer sites in Google’s top 20 (Morocco, French) for three Marrakech searches on November 10, 2026. [Full method and figures](/en/blog/etude-sites-agences-web-marrakech).',
        },
        faqs: [
          { question: 'How much does a website cost in Marrakech?', answer: 'As an honest starting point: a showcase website starts from 2,000 MAD and scales with pages, languages, and features. An e-commerce site starts from 3,500 MAD, with front-end and back-end included. Larger projects, like a riad direct-booking site or an advanced multilingual build, get a custom quote based on scope. We send a precise, free quote within one business day. What moves a quote up or down is in our [website pricing guide for Morocco](/en/blog/combien-coute-site-web-maroc).' },
          { question: 'How long does it take to build a website?', answer: 'Plan for 2 to 3 days for most defined-scope builds: a simple showcase site moves fastest, while booking or [e-commerce](/en/creation-site-e-commerce-maroc) features need more preparation. We agree on a clear timeline with the quote.' },
          { question: 'What types of businesses do you work with in Marrakech?', answer: 'We work with [hotels and riads](/en/hotel-website-design), [travel agencies and activity operators](/en/site-web-agence-de-voyage), local services, restaurants, lifestyle brands, and teams that need a credible website with a clear route to enquiry.' },
          { question: 'Can you build a website in English and French?', answer: 'Yes. We plan language structure, navigation, metadata, and conversion paths for English and French audiences from the beginning.' },
          { question: 'Is SEO included in a new website?', answer: 'Every build includes practical SEO foundations: clean page structure, metadata, performance-minded implementation, sitemap support, and conversion-ready content structure. For ongoing rankings and your Google Business Profile, see our [SEO agency in Marrakech](/en/agence-seo-marrakech); to run the website, Google search, Maps and Ads together, our [digital marketing agency in Marrakech](/en/agence-marketing-digital-marrakech).' },
          { question: 'Do you work outside Marrakech?', answer: 'Yes. We are based in Marrakech and work with clients across Morocco ([Casablanca](/en/web-design-casablanca), [Rabat](/en/web-design-rabat), [Tangier](/en/web-design-tanger), [Agadir](/en/web-design-agadir)) as well as remotely for [international projects](/en/international-web-design-agency).' },
        ],
      },
      fr: {
        title: 'Agence web à Marrakech : création de site web',
        description: 'Agence web à Marrakech : sites rapides, bilingues et prêts pour le SEO pour riads, tourisme et entreprises locales. Prix affichés, devis gratuit sous un jour.',
        eyebrow: 'Agence web à Marrakech',
        heading: 'Agence web à Marrakech : des sites qui inspirent confiance et amènent des demandes.',
        lead: 'Création de site web pour les riads, les hôtels, les excursions et activités, et les entreprises locales : rapide sur mobile, pensé en français et en anglais, prêt pour Google, avec des tarifs de départ affichés et un devis gratuit.',
        outcomesTitle: 'Ce que votre site doit accomplir',
        outcomes: ['Présenter votre offre clairement sur mobile, même avec une connexion moyenne.', 'Montrer votre crédibilité locale avant de demander un contact.', 'Rendre WhatsApp, les demandes de devis et les contacts faciles à trouver.', 'Servir vos visiteurs en français et en anglais, avec des versions pensées dès le départ et non traduites après coup.', 'Donner à Google une structure claire à explorer et comprendre.'],
        proofTitle: 'Conçu avec une vraie connaissance de Marrakech',
        proof: 'Notre portfolio comprend [un opérateur de parapente près de Marrakech](/fr/work/flying-tandem), [un guide de la ville](/fr/work/by-marrakech) et [un concept de marque locale](/fr/work/yoo-marrakech) créé par le studio. Sur chacun, la découverte sur mobile, la confiance et les demandes directes décident si le site est rentable.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Décrivez votre projet en quelques lignes. Nous répondons sous un jour ouvré.',
        insights: {
          title: 'Ce que nous avons mesuré à Marrakech',
          lead: 'En novembre 2026, nous avons examiné les 66 sites d’agences et de freelances classés sur Google pour Marrakech. Voici ce qu’y trouve un client, et pourquoi nous affichons nos prix plus bas.',
          items: [
            { figure: '21 sur 66', label: 'affichent un prix pour leurs propres services. Les nôtres sont sur cette page.', source: { label: 'Étude WeReact, nov. 2026', href: '/fr/blog/etude-sites-agences-web-marrakech' } },
            { figure: '18 sur 66', label: 'donnent un délai de livraison chiffré. Le nôtre : 2 à 3 jours pour un site vitrine à périmètre défini.', source: { label: 'Étude WeReact, nov. 2026', href: '/fr/blog/etude-sites-agences-web-marrakech' } },
            { figure: '17 sur 34', label: 'des sites qui affichent des avis renvoient vers leur source.', source: { label: 'Étude WeReact, nov. 2026', href: '/fr/blog/etude-sites-agences-web-marrakech' } },
          ],
          note: 'Sites d’agences et de freelances du top 20 Google (Maroc, français) pour trois recherches à Marrakech, le 10 novembre 2026. [Méthode et chiffres complets](/fr/blog/etude-sites-agences-web-marrakech).',
        },
        faqs: [
          { question: 'Combien coûte un site web à Marrakech ?', answer: 'En clair : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un site e-commerce démarre à partir de 3 500 DH, front et back inclus. Les projets plus importants, comme un site de réservation directe pour riad ou une structure multilingue avancée, sont établis sur devis selon le périmètre. Nous envoyons un devis gratuit et précis sous un jour ouvré. Ce qui fait varier un devis est détaillé dans notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc).' },
          { question: 'Combien de temps pour créer un site ?', answer: 'Comptez 2 à 3 jours pour la plupart des sites à périmètre défini : un site vitrine simple avance plus vite, tandis qu’une réservation ou une [boutique en ligne](/fr/creation-site-e-commerce-maroc) demande plus de préparation. Nous fixons un calendrier clair dès le devis.' },
          { question: 'Avec quelles entreprises travaillez-vous à Marrakech ?', answer: 'Nous accompagnons [les hôtels et riads](/fr/hotel-website-design), [les agences de voyage et les activités](/fr/site-web-agence-de-voyage), les services locaux, les restaurants, les marques lifestyle et les équipes qui ont besoin d’un site crédible avec un parcours de contact simple.' },
          { question: 'Pouvez-vous créer un site en français et en anglais ?', answer: 'Oui. Nous prévoyons la structure des langues, la navigation, les métadonnées et les parcours de conversion pour les audiences françaises et anglaises dès le départ.' },
          { question: 'Le SEO est-il inclus dans la création du site ?', answer: 'Chaque projet intègre des fondations SEO concrètes : structure de page propre, métadonnées, performance, sitemap et contenu pensé pour la conversion. Pour le positionnement dans la durée et la fiche Google, voir notre [agence SEO à Marrakech](/fr/agence-seo-marrakech) ; pour piloter ensemble le site, la recherche Google, Maps et Ads, notre [agence marketing digital à Marrakech](/fr/agence-marketing-digital-marrakech).' },
          { question: 'Travaillez-vous ailleurs qu’à Marrakech ?', answer: 'Oui. Nous sommes basés à Marrakech et accompagnons des clients dans tout le Maroc ([Casablanca](/fr/web-design-casablanca), [Rabat](/fr/web-design-rabat), [Tanger](/fr/web-design-tanger), [Agadir](/fr/web-design-agadir)) ainsi qu’à distance pour les [projets internationaux](/fr/international-web-design-agency).' },
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
    relatedPostSlugs: ['tourism-hospitality-seo-morocco', 'commission-getyourguide-viator-booking-maroc', 'combien-coute-site-web-maroc'],
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
    slug: 'web-design-casablanca',
    primaryKeyword: 'agence web casablanca',
    keywords: ['agence web casablanca', 'création site web casablanca', 'creation site web casablanca', 'agence création site web casablanca', 'développeur web casablanca', 'agence seo casablanca', 'site vitrine casablanca'],
    relatedProjectIds: ['kasbah-angour', 'yoo-marrakech', 'trust-drivers'],
    relatedPageSlugs: ['website-design-moroccan-businesses', 'agence-seo-marrakech', 'creation-site-e-commerce-maroc', 'web-design-rabat'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'etude-sites-agences-web-marrakech', 'fiche-google-business-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Web Agency in Casablanca: Website Design',
        description: 'Web agency for Casablanca businesses: fast bilingual websites, Google search foundations, prices from 2,000 MAD and a free quote within one business day.',
        eyebrow: 'Web agency for Casablanca',
        heading: 'A web agency for Casablanca businesses that get compared before they get called.',
        lead: 'In Casablanca, a potential client opens three or four websites before picking up the phone. Yours has to say in seconds what you do, for whom, from what price, and how to reach you. We build it in French and English, with its [Google search foundations](/en/agence-seo-marrakech) from day one.',
        outcomesTitle: 'What a Casablanca business website has to do',
        outcomes: [
          'Say what you do and where from the first screen: the district or city you serve, not just “Morocco”.',
          'Show proof a buyer can check: references, real projects, and reviews linked to their source.',
          'Qualify the request: a short quote form that asks for the need, the timing and the budget, plus WhatsApp and phone.',
          'Serve clients in French, and in English if you work with foreign partners or clients.',
          'Load fast on a phone, where most comparisons start.',
        ],
        proofTitle: 'Our work',
        proof: 'Our published sites are mostly in tourism and local brands in Morocco, such as [Kasbah Angour](/en/work/kasbah-angour) and the [Yoo Marrakech](/en/work/yoo-marrakech) studio concept. The method is the same for a Casablanca business: a clear offer, proof that can be checked, and a direct route to contact.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your business and what the site should bring in. We reply within one business day.',
        sections: [
          {
            heading: 'Two kinds of search in Casablanca',
            paragraphs: [
              'Local searches, for a practice, a clinic, a restaurant or a shop, are decided on Google’s map: your [Google Business Profile](/en/blog/fiche-google-business-maroc) counts as much as your website, and your address and district must read the same everywhere.',
              'Supplier searches, in B2B or for a service sold on quote, are decided on the website: the buyer compares references, seriousness and how clear the offer is. For those, one page per service works better than a homepage that tries to say everything.',
            ],
          },
          {
            heading: 'A published price changes the conversation',
            paragraphs: [
              'When we studied the agency websites ranking in Marrakech, only 21 of 66 published a price ([the study](/en/blog/etude-sites-agences-web-marrakech)). We publish ours: a showcase website from 2,000 MAD, an [e-commerce website](/en/creation-site-e-commerce-maroc) from 3,500 MAD, and a precise quote within one business day.',
              'For a Casablanca business, that removes a first meeting held only to find out whether the budget is realistic. Our [pricing guide](/en/blog/combien-coute-site-web-maroc) explains what moves a quote.',
            ],
          },
          {
            heading: 'Working with an agency based in Marrakech',
            paragraphs: [
              'We are based in Marrakech. A Casablanca project runs like our other projects: calls, WhatsApp and shared previews, so you see the site take shape and approve it before it goes live.',
              'For a larger project, we can come to Casablanca for the kickoff meeting. The prices and the method are the same everywhere in [Morocco](/en/website-design-moroccan-businesses).',
            ],
          },
        ],
        faqs: [
          { question: 'Do you work with Casablanca businesses from Marrakech?', answer: 'Yes. Projects run remotely through calls, WhatsApp and shared previews, and we can come to Casablanca for the kickoff of a larger project.' },
          { question: 'How much does a website cost in Casablanca?', answer: 'The same published prices apply across Morocco: a showcase website starts from 2,000 MAD and scales with pages, languages and features. An [e-commerce site](/en/creation-site-e-commerce-maroc) starts from 3,500 MAD with front-end and back-end included. You get a precise, free quote within one business day.' },
          { question: 'Do you also do SEO in Casablanca?', answer: 'Yes. Every website includes its SEO foundations, and our [SEO work](/en/agence-seo-marrakech) then covers local search, your Google Business Profile and service pages, for Casablanca as for the rest of Morocco.' },
          { question: 'How long does it take to build the website?', answer: 'Plan for 2 to 3 days for a defined-scope showcase website. Larger builds get a precise timeline with the quote.' },
          { question: 'Can you redesign our existing website?', answer: 'Yes. We start by reviewing your current structure, speed, content gaps and contact paths, then recommend either a focused improvement or a full rebuild, whichever gets you results faster.' },
        ],
      },
      fr: {
        title: 'Agence web à Casablanca : création de site web',
        description: 'Agence web pour les entreprises de Casablanca : sites rapides et bilingues, fondations SEO, prix à partir de 2 000 MAD et devis gratuit sous un jour ouvré.',
        eyebrow: 'Agence web pour Casablanca',
        heading: 'Une agence web pour les entreprises de Casablanca, comparées avant d’être appelées.',
        lead: 'À Casablanca, un client potentiel ouvre trois ou quatre sites avant de décrocher son téléphone. Le vôtre doit dire en quelques secondes ce que vous faites, pour qui, à partir de quel prix et comment vous joindre. Nous le créons en français et en anglais, avec ses [fondations de référencement Google](/fr/agence-seo-marrakech) dès le départ.',
        outcomesTitle: 'Ce qu’un site d’entreprise à Casablanca doit faire',
        outcomes: [
          'Dire votre métier et votre zone dès le premier écran : le quartier ou la ville que vous servez, pas seulement « Maroc ».',
          'Montrer des preuves qu’un acheteur peut vérifier : références, vraies réalisations, avis reliés à leur source.',
          'Qualifier la demande : un formulaire de devis court qui demande le besoin, le délai et le budget, plus WhatsApp et le téléphone.',
          'Servir vos clients en français, et en anglais si vous travaillez avec des partenaires ou des clients étrangers.',
          'Se charger vite sur un téléphone, là où commencent la plupart des comparaisons.',
        ],
        proofTitle: 'Nos réalisations',
        proof: 'Nos sites publiés sont surtout dans le tourisme et les marques locales au Maroc, comme [Kasbah Angour](/fr/work/kasbah-angour) ou le concept studio [Yoo Marrakech](/fr/work/yoo-marrakech). La méthode est la même pour une entreprise de Casablanca : une offre claire, des preuves vérifiables et un contact sans détour.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Présentez votre activité et ce que le site doit vous apporter. Nous répondons sous un jour ouvré.',
        sections: [
          {
            heading: 'Deux types de recherche à Casablanca',
            paragraphs: [
              'Les recherches de proximité, pour un cabinet, une clinique, un restaurant ou un commerce, se jouent sur la carte de Google : votre [fiche Google Business](/fr/blog/fiche-google-business-maroc) compte autant que votre site, et votre adresse et votre quartier doivent être écrits de la même façon partout.',
              'Les recherches de prestataires, en B2B ou pour un service sur devis, se jouent sur le site : l’acheteur compare les références, le sérieux et la clarté de l’offre. Pour celles-ci, une page par service vaut mieux qu’une page d’accueil qui veut tout dire.',
            ],
          },
          {
            heading: 'Un prix affiché change la conversation',
            paragraphs: [
              'Quand nous avons étudié les sites d’agences classés à Marrakech, seuls 21 sur 66 affichaient un prix ([l’étude](/fr/blog/etude-sites-agences-web-marrakech)). Nous affichons les nôtres : un site vitrine à partir de 2 000 MAD, un [site e-commerce](/fr/creation-site-e-commerce-maroc) à partir de 3 500 MAD, et un devis précis sous un jour ouvré.',
              'Pour une entreprise de Casablanca, cela évite un premier rendez-vous uniquement pour savoir si le budget est réaliste. Notre [guide des prix](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier un devis.',
            ],
          },
          {
            heading: 'Travailler avec une agence basée à Marrakech',
            paragraphs: [
              'Nous sommes basés à Marrakech. Un projet à Casablanca se mène comme nos autres projets : appels, WhatsApp et aperçus partagés, pour que vous voyiez le site avancer et le validiez avant sa mise en ligne.',
              'Pour un projet important, nous pouvons venir à Casablanca pour la réunion de lancement. Les prix et la méthode sont les mêmes partout au [Maroc](/fr/website-design-moroccan-businesses).',
            ],
          },
        ],
        faqs: [
          { question: 'Travaillez-vous avec des entreprises de Casablanca depuis Marrakech ?', answer: 'Oui. Le projet se mène à distance par appels, WhatsApp et aperçus partagés, et nous pouvons venir à Casablanca pour la réunion de lancement d’un projet important.' },
          { question: 'Combien coûte un site web à Casablanca ?', answer: 'Les mêmes prix affichés s’appliquent partout au Maroc : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un [site e-commerce](/fr/creation-site-e-commerce-maroc) démarre à partir de 3 500 DH, front et back inclus. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
          { question: 'Faites-vous aussi le référencement (SEO) à Casablanca ?', answer: 'Oui. Chaque site inclut ses fondations SEO, et notre [accompagnement SEO](/fr/agence-seo-marrakech) couvre ensuite le référencement local, la fiche Google et les pages de services, pour Casablanca comme pour le reste du Maroc.' },
          { question: 'Combien de temps pour créer le site ?', answer: 'Comptez 2 à 3 jours pour un site vitrine à périmètre défini. Les projets plus importants reçoivent un calendrier précis avec le devis.' },
          { question: 'Pouvez-vous refaire notre site existant ?', answer: 'Oui. Nous commençons par analyser votre structure actuelle, la vitesse, les manques de contenu et les parcours de contact, puis nous recommandons soit une amélioration ciblée, soit une refonte complète, selon ce qui donne des résultats le plus vite.' },
        ],
      },
    },
  },
  {
    slug: 'agence-seo-marrakech',
    primaryKeyword: 'agence seo marrakech',
    keywords: ['agence seo marrakech', 'agence seo maroc', 'référencement naturel maroc', 'consultant seo maroc', 'seo prix maroc', 'référencement naturel marrakech'],
    relatedProjectIds: ['trust-drivers', 'morocco-atlas-guide', 'kasbah-angour'],
    relatedPageSlugs: ['web-design-marrakech', 'agence-google-ads-maroc', 'agence-marketing-digital-marrakech', 'website-design-moroccan-businesses'],
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
          { question: 'How much does SEO cost in Morocco?', answer: 'It depends on your market and starting point. After a free review of your site we propose a scoped monthly plan or a one-off technical fix, each with clear deliverables — no vague retainers. If you need enquiries while SEO builds up, [Google Ads](/en/agence-google-ads-maroc) can run alongside it, and our [digital marketing offer](/en/agence-marketing-digital-marrakech) runs both with the website and the Google listing.' },
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
          { question: 'Combien coûte le SEO au Maroc ?', answer: 'Cela dépend de votre marché et de votre point de départ. Après une revue gratuite de votre site, nous proposons un plan mensuel cadré ou une intervention technique ponctuelle, avec des livrables clairs — pas de forfait flou. Si vous avez besoin de demandes pendant que le SEO progresse, [Google Ads](/fr/agence-google-ads-maroc) peut tourner en parallèle, et notre [offre de marketing digital](/fr/agence-marketing-digital-marrakech) pilote les deux avec le site et la fiche Google.' },
          { question: 'En combien de temps le SEO donne-t-il des résultats ?', answer: 'Les corrections techniques et le SEO local bougent souvent en quelques semaines. Les mots-clés commerciaux concurrentiels demandent en général trois à six mois de travail régulier. Nous fixons les attentes dès la première revue.' },
          { question: 'Gérez-vous aussi la fiche Google Business ?', answer: 'Oui. Pour les entreprises locales à Marrakech et partout au Maroc, le pack local est souvent le gain le plus rapide : nous optimisons la fiche, les catégories, les photos et les avis en parallèle du site. Notre [guide de la fiche Google Business au Maroc](/fr/blog/fiche-google-business-maroc) explique la méthode.' },
        ],
      },
    },
  },
  {
    slug: 'web-design-rabat',
    primaryKeyword: 'agence web rabat',
    keywords: ['agence web rabat', 'création site web rabat', 'agence digitale rabat', 'agence marketing digital rabat', 'agence seo rabat', 'création site internet rabat', 'site vitrine rabat', 'website design Rabat'],
    relatedProjectIds: ['trust-drivers', 'your-morocco', 'yoo-marrakech'],
    relatedPageSlugs: ['web-design-casablanca', 'web-design-tanger', 'agence-seo-marrakech', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'fiche-google-business-maroc', 'website-design-marrakech-business-guide'],
    showPricing: true,
    modifiedAt: '2026-11-12',
    copy: {
      en: {
        title: 'Web Agency in Rabat: Website Design',
        description: 'Web agency for Rabat practices, firms and services: fast French and English websites, one page per service, Google listing. From 2,000 MAD, quote in one day.',
        eyebrow: 'Websites for Rabat',
        heading: 'Websites for Rabat businesses that look as serious as you are.',
        lead: 'In Rabat, people search for a professional: a dentist, a lawyer, a sworn translator, an architect, with the city name. Your website has to show competence in seconds, in French and English, answer the question that brought them, and make contact effortless.',
        outcomesTitle: 'What a Rabat business website needs',
        outcomes: [
          'One page per service or specialty, so each search finds the page that answers it.',
          'The practical details people check before calling: neighbourhood and address, hours, languages spoken, how appointments work.',
          'French and English planned together for clients, partners and the international community of the capital; Arabic when your public needs it.',
          'Fast, accessible pages, with phone, WhatsApp and a short form on every page.',
        ],
        proofTitle: 'Built remotely, managed closely',
        proof: 'We are based in Marrakech and work with clients across Morocco. Projects run on calls, WhatsApp and shared previews: you see the site take shape before it goes live. The page structure we use is tested on our own sites, such as [Trust Drivers Tours](/en/work/trust-drivers), before we use it for clients.',
        cta: 'Request a free quote',
        ctaNote: 'Describe your practice or business in a few lines. We reply within one business day.',
        insights: {
          title: 'What people search for in Rabat',
          lead: 'Average monthly searches in Morocco, in French, and the bid range to appear at the top of the page, from the Google Ads Keyword Planner on November 12, 2026. Each one is a specialty plus the city: the search a dedicated page can answer.',
          items: [
            { figure: '4,400', label: '“dentiste rabat” searches a month. A top-of-page click costs 2.57 to 6.52 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '4,400', label: '“ophtalmologue rabat” (eye doctor). A click costs 2.11 to 6.09 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '3,600', label: '“gynécologue rabat”. Bids range from 0.69 to 40.13 MAD, the widest spread in our list.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '1,000', label: '“avocat rabat” (lawyer). A click costs 1.29 to 3.89 MAD, with almost no advertisers.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '720', label: '“architecte rabat”. A click costs 3.72 to 18.86 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '590', label: '“traducteur assermenté rabat” (sworn translator), plus 320 for “traduction rabat”.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
          ],
          note: 'Where almost nobody advertises, as for lawyers, the organic results and the map listing take nearly all the clicks: a clear page per service and a complete Google listing are what get you seen.',
        },
        sections: [
          {
            heading: 'In Rabat, people search for a professional, not a brand',
            paragraphs: [
              'The searches above share one shape: a specialty and the city. A practice or firm with a page for each service, stating the neighbourhood (Agdal, Hassan, Hay Riad, Souissi), the hours and how to book, can appear on each of them. A one-page site that lists everything in a paragraph rarely does.',
              'The map results matter as much as the website for these searches. A complete Google Business Profile, with the right category, real photos and reviews, links to the matching page of your site. Our [Google Business Profile guide for Morocco](/en/blog/fiche-google-business-maroc) has the steps, and our [SEO agency](/en/agence-seo-marrakech) can do it for you.',
            ],
          },
          {
            heading: 'French, English, and Arabic when it counts',
            paragraphs: [
              'Rabat is the capital: embassies, international organisations, foreign residents and partners. For a lawyer, a translator, a clinic or a consultancy, an English version written for those clients, not machine-translated, brings enquiries the French version cannot.',
              'Arabic makes sense when your public uses it first, for example for services aimed at families or administrations. We plan the languages at the start, with their own pages and metadata, so each one can be found on Google.',
            ],
          },
        ],
        faqs: [
          { question: 'Do you work with clients in Rabat from Marrakech?', answer: 'Yes. Most projects run remotely through calls, WhatsApp and shared previews, so distance changes nothing. For larger projects we can travel to Rabat for a kick-off meeting.' },
          { question: 'How much does a website cost in Rabat?', answer: 'The same transparent pricing applies across Morocco: a showcase website starts from 2,000 MAD and scales with pages, languages and features. [E-commerce](/en/creation-site-e-commerce-maroc) starts from 3,500 MAD. You get a precise, free quote within one business day.' },
          { question: 'Do I need a page for each service?', answer: 'If people search for each service separately, yes. A dentist who does implants and orthodontics, or a law firm that handles business and family law, gets found on more searches with one clear page per service than with a single list.' },
          { question: 'Are you a communication agency?', answer: 'No. We build websites and make them found on Google: search, the map listing and Google Ads. We do not manage social media or brand campaigns. Our [digital marketing offer](/en/agence-marketing-digital-marrakech) explains what we cover.' },
          { question: 'Can you build a bilingual or trilingual website?', answer: 'Yes. French and English are planned from the start: structure, navigation, metadata and contact paths. Arabic can be added when your audience needs it.' },
        ],
      },
      fr: {
        title: 'Agence web à Rabat : création de site web',
        description: 'Agence web pour cabinets, entreprises et services à Rabat : sites rapides en français et anglais, une page par service, fiche Google. Dès 2 000 DH, devis en un jour.',
        eyebrow: 'Sites web à Rabat',
        heading: 'Création de site web à Rabat, aussi sérieuse que votre activité.',
        lead: 'À Rabat, on cherche un professionnel : un dentiste, un avocat, un traducteur assermenté, un architecte, avec le nom de la ville. Votre site doit montrer votre compétence en quelques secondes, en français et en anglais, répondre à la question qui amène le visiteur et rendre le contact évident.',
        outcomesTitle: 'Ce que votre site à Rabat doit accomplir',
        outcomes: [
          'Une page par service ou par spécialité, pour que chaque recherche trouve la page qui y répond.',
          'Les informations vérifiées avant d’appeler : quartier et adresse, horaires, langues parlées, prise de rendez-vous.',
          'Le français et l’anglais pensés ensemble pour les clients, les partenaires et la communauté internationale de la capitale ; l’arabe quand votre public en a besoin.',
          'Des pages rapides et accessibles, avec téléphone, WhatsApp et un formulaire court sur chaque page.',
        ],
        proofTitle: 'À distance, mais suivi de près',
        proof: 'Nous sommes basés à Marrakech et travaillons avec des clients dans tout le Maroc. Les projets se pilotent par appels, WhatsApp et aperçus partagés : vous voyez le site avancer avant sa mise en ligne. La structure de pages que nous utilisons est testée sur nos propres sites, comme [Trust Drivers Tours](/fr/work/trust-drivers), avant de servir à nos clients.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Présentez votre cabinet ou votre activité en quelques lignes. Nous répondons sous un jour ouvré.',
        insights: {
          title: 'Ce que l’on cherche à Rabat',
          lead: 'Recherches mensuelles moyennes au Maroc, en français, et fourchette d’enchère pour apparaître en haut de page, d’après le Planificateur de mots-clés Google Ads, relevé le 12 novembre 2026. Chaque fois, une spécialité et la ville : la recherche à laquelle une page dédiée peut répondre.',
          items: [
            { figure: '4 400', label: 'recherches « dentiste rabat » par mois. Le clic en haut de page coûte de 2,57 à 6,52 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '4 400', label: '« ophtalmologue rabat ». Le clic coûte de 2,11 à 6,09 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '3 600', label: '« gynécologue rabat ». Les enchères vont de 0,69 à 40,13 DH, l’écart le plus large de notre liste.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '1 000', label: '« avocat rabat ». Le clic coûte de 1,29 à 3,89 DH, avec presque aucun annonceur.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '720', label: '« architecte rabat ». Le clic coûte de 3,72 à 18,86 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '590', label: '« traducteur assermenté rabat », plus 320 pour « traduction rabat ».', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
          ],
          note: 'Là où presque personne n’achète de publicité, comme pour les avocats, les résultats naturels et la carte prennent presque tous les clics : une page claire par service et une fiche Google complète suffisent à être vu.',
        },
        sections: [
          {
            heading: 'À Rabat, on cherche un professionnel, pas une marque',
            paragraphs: [
              'Les recherches ci-dessus ont la même forme : une spécialité et la ville. Un cabinet qui a une page par service, avec le quartier (Agdal, Hassan, Hay Riad, Souissi), les horaires et la prise de rendez-vous, peut apparaître sur chacune. Un site d’une seule page qui liste tout en un paragraphe y parvient rarement.',
              'Sur ces recherches, la carte compte autant que le site. Une fiche Google Business complète, avec la bonne catégorie, de vraies photos et des avis, renvoie vers la page correspondante de votre site. Notre [guide de la fiche Google Business au Maroc](/fr/blog/fiche-google-business-maroc) donne les étapes, et notre [agence SEO](/fr/agence-seo-marrakech) peut s’en charger.',
            ],
          },
          {
            heading: 'Français, anglais, et arabe quand il le faut',
            paragraphs: [
              'Rabat est la capitale : ambassades, organisations internationales, résidents et partenaires étrangers. Pour un avocat, un traducteur, une clinique ou un cabinet de conseil, une version anglaise écrite pour ces clients, et non traduite automatiquement, apporte des demandes que la version française n’apporte pas.',
              'L’arabe s’impose quand votre public le lit d’abord, par exemple pour des services destinés aux familles ou aux administrations. Nous prévoyons les langues dès le départ, avec leurs propres pages et métadonnées, pour que chacune soit trouvée sur Google.',
            ],
          },
        ],
        faqs: [
          { question: 'Travaillez-vous avec des clients à Rabat depuis Marrakech ?', answer: 'Oui. La plupart des projets se pilotent à distance par appels, WhatsApp et aperçus partagés : la distance ne change rien. Pour les projets importants, nous pouvons nous déplacer à Rabat pour une réunion de lancement.' },
          { question: 'Combien coûte un site web à Rabat ?', answer: 'Les mêmes tarifs transparents s’appliquent partout au Maroc : un site vitrine démarre à partir de 2 000 DH et évolue selon les pages, les langues et les fonctionnalités. Un [site e-commerce](/fr/creation-site-e-commerce-maroc) démarre à partir de 3 500 DH. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
          { question: 'Faut-il une page par service ?', answer: 'Si l’on vous cherche service par service, oui. Un dentiste qui fait de l’implantologie et de l’orthodontie, ou un cabinet d’avocats en droit des affaires et droit de la famille, est trouvé sur plus de recherches avec une page claire par service qu’avec une seule liste.' },
          { question: 'Êtes-vous une agence de communication ?', answer: 'Non. Nous créons des sites et les rendons visibles sur Google : recherche, fiche sur la carte et Google Ads. Nous ne gérons ni les réseaux sociaux ni les campagnes de marque. Notre [offre de marketing digital](/fr/agence-marketing-digital-marrakech) détaille ce que nous couvrons.' },
          { question: 'Pouvez-vous créer un site bilingue ou trilingue ?', answer: 'Oui. Le français et l’anglais sont prévus dès le départ : structure, navigation, métadonnées et parcours de contact. L’arabe peut être ajouté si votre audience en a besoin.' },
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
          { question: 'Can the website reduce OTA commissions?', answer: 'A website cannot replace platforms overnight, but clear direct-booking paths, trust signals, and WhatsApp contact can shift a share of bookings to commission-free channels. See how we build [websites for travel agencies, tours and activities](/en/site-web-agence-de-voyage), and [what each platform charges](/en/blog/commission-getyourguide-viator-booking-maroc).' },
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
          { question: 'Un site peut-il réduire les commissions des plateformes ?', answer: 'Un site ne remplace pas les plateformes du jour au lendemain, mais des parcours de réservation directe clairs, des signaux de confiance et un contact WhatsApp peuvent déplacer une partie des réservations vers des canaux sans commission. Voir notre approche des [sites pour agences de voyage, excursions et activités](/fr/site-web-agence-de-voyage), et [ce que prend chaque plateforme](/fr/blog/commission-getyourguide-viator-booking-maroc).' },
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
    relatedPostSlugs: ['commission-getyourguide-viator-booking-maroc', 'tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Hotel & Riad Website Design',
        description: 'Website design for hotels, riads, and boutique stays: direct-booking focus, hotel SEO, and mobile-first pages that turn lookers into direct enquiries.',
        eyebrow: 'Hotels, riads & boutique stays',
        heading: 'Hotel and riad websites designed to win the direct booking.',
        lead: 'Every guest who books direct instead of through a platform saves you its commission: 15.5% for most Airbnb hosts, and 15–17% reported for Moroccan hotels on Booking.com. That is what your website is for: showing the property honestly, answering the questions guests actually have, and making direct contact the easy path.',
        outcomesTitle: 'Designed around how guests decide',
        outcomes: ['Room and suite pages built for comparison: photos, details, and rates without a maze.', 'Trust answered up front: location, airport access, food, safety, and what is included.', 'Direct booking and WhatsApp enquiry paths placed where decision moments happen.', 'Hotel SEO foundations: schema, speed, and content that ranks for your property and area.'],
        proofTitle: 'We build for Moroccan hospitality',
        proof: 'From [an Atlas mountain hotel](/en/work/kasbah-angour) to adventure tourism and destination guides, our work is rooted in how travelers research Morocco — on a phone, between reviews, ready to message the property that feels clear and credible.',
        cta: 'Talk about your property',
        ctaNote: 'Tell us about your hotel, riad, or guesthouse. We reply within one business day.',
        insights: {
          title: 'What a platform booking costs',
          items: [
            { figure: '15.5%', label: 'Airbnb’s host-only fee for most hosts, mandatory for traditional hospitality listings such as hotels.', source: { label: 'Airbnb service fees', href: 'https://www.airbnb.com/help/article/1857' } },
            { figure: '15–17%', label: 'Booking.com commission reported for classified hotels in Morocco (2023). Booking.com does not publish its rate.', source: { label: 'Hespress, August 2023', href: 'https://fr.hespress.com/326262-le-bras-de-fer-continue-entre-la-fnih-et-booking.html' } },
            { figure: '13 nights', label: 'At 1,000 MAD a night and 15.5%, a showcase website from 2,000 MAD costs the same as the Airbnb fees on about 13 nights.' },
          ],
          note: 'Read on November 10, 2026. Your real rate is the one in your contract. [Sources for every platform](/en/blog/commission-getyourguide-viator-booking-maroc).',
        },
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
        lead: 'Chaque client qui réserve en direct plutôt que via une plateforme vous évite sa commission : 15,5 % pour la plupart des hôtes Airbnb, et 15 à 17 % rapportés pour les hôtels marocains sur Booking.com. C’est le rôle de votre site : montrer le lieu honnêtement, répondre aux vraies questions des voyageurs et faire du contact direct le chemin le plus simple.',
        outcomesTitle: 'Pensé selon la décision du voyageur',
        outcomes: ['Des pages chambres et suites faites pour comparer : photos, détails et tarifs sans labyrinthe.', 'La confiance traitée d’emblée : localisation, accès aéroport, restauration, sécurité et inclusions.', 'Réservation directe et WhatsApp placés aux moments de décision.', 'Des fondations SEO hôtelières : données structurées, vitesse et contenu qui positionne votre établissement et sa région.'],
        proofTitle: 'Nous construisons pour l’hôtellerie marocaine',
        proof: 'D’[un hôtel de l’Atlas](/fr/work/kasbah-angour) aux activités touristiques et guides de destination, notre travail suit la manière dont les voyageurs préparent le Maroc — sur mobile, entre deux avis, prêts à écrire à l’établissement qui paraît clair et crédible.',
        cta: 'Parler de votre établissement',
        ctaNote: 'Présentez votre hôtel, riad ou maison d’hôtes. Nous répondons sous un jour ouvré.',
        insights: {
          title: 'Ce que coûte une réservation via une plateforme',
          items: [
            { figure: '15,5 %', label: 'Frais d’hôte Airbnb pour la plupart des hôtes, obligatoires pour les établissements hôteliers traditionnels.', source: { label: 'Frais de service Airbnb', href: 'https://www.airbnb.com/help/article/1857' } },
            { figure: '15–17 %', label: 'Commission Booking.com rapportée pour les hôtels classés au Maroc (2023). Booking.com ne publie pas son taux.', source: { label: 'Hespress, août 2023', href: 'https://fr.hespress.com/326262-le-bras-de-fer-continue-entre-la-fnih-et-booking.html' } },
            { figure: '13 nuits', label: 'À 1 000 MAD la nuit et 15,5 %, un site vitrine à partir de 2 000 MAD coûte autant que les frais Airbnb d’environ 13 nuits.' },
          ],
          note: 'Lu le 10 novembre 2026. Votre taux réel est celui de votre contrat. [Les sources de chaque plateforme](/fr/blog/commission-getyourguide-viator-booking-maroc).',
        },
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
    keywords: ['agence google ads maroc', 'landing page maroc', 'landing page google ads', 'agence google ads marrakech', 'campagne google ads maroc', 'agence sea maroc', 'publicité google maroc'],
    relatedProjectIds: ['trust-drivers', 'yoo-marrakech', 'by-marrakech'],
    relatedPageSlugs: ['agence-seo-marrakech', 'agence-marketing-digital-marrakech', 'web-design-marrakech', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['seo-strategies-for-agencies', 'combien-coute-site-web-maroc'],
    modifiedAt: '2026-11-12',
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
        proof: 'We built the conversion tracking on our own Google Ads account: form leads, WhatsApp clicks, and attribution of every enquiry. That method, with the landing pages that go with it, is what we apply to your campaigns.',
        cta: 'Plan a campaign review',
        ctaNote: 'Tell us your offer and budget. We reply within one business day.',
        faqs: [
          { question: 'What budget do I need for Google Ads in Morocco?', answer: 'Meaningful data usually starts around 3,000-5,000 MAD per month in ad spend for local services, more in competitive niches. We size the recommendation to your market before you commit.' },
          { question: 'Do you build the landing pages too?', answer: 'Yes, and we recommend it. A message-matched landing page with proper conversion events stops you paying for clicks that land on a generic page that does not answer the search.' },
          { question: 'How do you report performance?', answer: 'You see cost per enquiry, not just clicks: qualified form submissions, WhatsApp conversations, and calls tracked as conversions, reported in plain language every month. When Ads runs alongside SEO and your Google listing, one report covers all three: see our [digital marketing agency in Marrakech](/en/agence-marketing-digital-marrakech).' },
          { question: 'Can a landing page rank in Google too?', answer: 'It can support organic visibility when it answers a real search need and has enough useful content, but paid-campaign pages should not be overloaded with irrelevant keywords. For organic rankings, see our [SEO agency in Marrakech](/en/agence-seo-marrakech).' },
          { question: 'Will you help measure leads?', answer: 'Yes. We set up the events that measure qualified form submissions, WhatsApp clicks and calls in Google Ads and Google Analytics.' },
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
        proof: 'Nous avons construit le suivi des conversions de notre propre compte Google Ads : formulaires, clics WhatsApp et attribution de chaque demande. C’est cette méthode, avec les landing pages qui vont avec, que nous appliquons à vos campagnes.',
        cta: 'Planifier une revue de campagne',
        ctaNote: 'Présentez votre offre et votre budget. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Quel budget faut-il pour Google Ads au Maroc ?', answer: 'Des données significatives commencent généralement autour de 3 000 à 5 000 DH par mois de budget publicitaire pour des services locaux, davantage dans les niches concurrentielles. Nous dimensionnons la recommandation à votre marché avant tout engagement.' },
          { question: 'Créez-vous aussi les landing pages ?', answer: 'Oui, et nous le recommandons. Une landing page alignée sur le message de l’annonce, avec de vrais événements de conversion, évite de payer des clics envoyés vers une page générique qui ne répond pas à la recherche.' },
          { question: 'Comment présentez-vous les résultats ?', answer: 'Vous voyez le coût par demande, pas seulement les clics : formulaires qualifiés, conversations WhatsApp et appels suivis comme conversions, présentés en langage clair chaque mois. Quand Ads tourne avec le SEO et votre fiche Google, un seul rapport couvre les trois : voir notre [agence marketing digital à Marrakech](/fr/agence-marketing-digital-marrakech).' },
          { question: 'Une landing page peut-elle aussi se positionner sur Google ?', answer: 'Oui, lorsqu’elle répond à une vraie intention de recherche et contient assez de contenu utile. Une page de campagne ne doit toutefois pas être surchargée de mots-clés inutiles. Pour le référencement naturel, voir notre [agence SEO à Marrakech](/fr/agence-seo-marrakech).' },
          { question: 'Pouvez-vous aider à mesurer les demandes ?', answer: 'Oui. Nous mettons en place les événements qui mesurent les formulaires qualifiés, les clics WhatsApp et les appels dans Google Ads et Google Analytics.' },
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
    relatedPostSlugs: ['commission-getyourguide-viator-booking-maroc', 'tourism-hospitality-seo-morocco', 'combien-coute-site-web-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Websites for Tour Operators in Morocco',
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
        insights: {
          title: 'What the platforms take',
          lead: 'Figures from the platforms’ own supplier and host pages, read on November 10, 2026. Viator and Booking.com publish no percentage; your rate is in your contract.',
          items: [
            { figure: '20–30%', label: 'GetYourGuide’s commission by country of activity, as published until 2025. The live page no longer shows a figure.', source: { label: 'GetYourGuide, January 2025 copy', href: 'https://web.archive.org/web/20250118094756/https://www.getyourguide.supply/join/how-much-does-getyourguide-charge' } },
            { figure: '20%', label: 'Airbnb’s typical service fee on experiences.', source: { label: 'Airbnb service fees', href: 'https://www.airbnb.com/help/article/1857' } },
            { figure: 'US$29', label: 'Viator’s one-time listing fee per product. Its commission percentage is not published.', source: { label: 'Viator operator site, June 2026 copy', href: 'https://web.archive.org/web/20260608142229/http://operatorresources.viator.com/' } },
          ],
          note: 'At 20–30% on a 500 MAD activity, a showcase website from 2,000 MAD costs the same as the commission on 14 to 20 bookings. [All sources and the full calculation](/en/blog/commission-getyourguide-viator-booking-maroc).',
        },
        sections: [
          {
            heading: 'Platforms and a direct website do different jobs',
            paragraphs: [
              'Marketplaces such as GetYourGuide and Viator bring travelers who have never heard of you, and they take a commission on each booking they deliver ([what each platform charges](/en/blog/commission-getyourguide-viator-booking-maroc)). A direct website does not replace that discovery.',
              'Its job is the travelers who already know you: repeat guests, recommendations, people who search your name or find your Google Business Profile, and visitors from Instagram. Each of them who books on your site instead of on a platform is a booking without commission.',
            ],
          },
          {
            heading: 'Three ways to take bookings',
            paragraphs: [
              'A booking request form with manual confirmation suits most small operators: the traveler picks a date and group size, you confirm availability and price.',
              'WhatsApp first is how most enquiries arrive in Morocco. The button sits next to the price and the itinerary, and the message is pre-filled with the activity and date so you can answer fast. You can make such a link yourself, with its QR code, in our free [WhatsApp link generator](/en/outils/generateur-lien-whatsapp).',
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
        title: 'Site web agence de voyage et excursions au Maroc',
        description: 'Site web pour agences de voyage, excursions et activités au Maroc : une page par activité, prix affichés, réservation et WhatsApp. À partir de 2 000 MAD.',
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
        insights: {
          title: 'Ce que prennent les plateformes',
          lead: 'Chiffres tirés des pages fournisseurs et hôtes des plateformes elles-mêmes, lues le 10 novembre 2026. Viator et Booking.com ne publient aucun pourcentage : votre taux est dans votre contrat.',
          items: [
            { figure: '20–30 %', label: 'Commission GetYourGuide selon le pays de l’activité, publiée jusqu’en 2025. La page actuelle n’affiche plus de chiffre.', source: { label: 'GetYourGuide, copie de janvier 2025', href: 'https://web.archive.org/web/20250118094756/https://www.getyourguide.supply/join/how-much-does-getyourguide-charge' } },
            { figure: '20 %', label: 'Frais de service habituels d’Airbnb sur les expériences.', source: { label: 'Frais de service Airbnb', href: 'https://www.airbnb.com/help/article/1857' } },
            { figure: '29 $', label: 'Frais d’inscription uniques par produit sur Viator. Son pourcentage de commission n’est pas publié.', source: { label: 'Site opérateurs Viator, copie de juin 2026', href: 'https://web.archive.org/web/20260608142229/http://operatorresources.viator.com/' } },
          ],
          note: 'À 20–30 % sur une activité à 500 MAD, un site vitrine à partir de 2 000 MAD coûte autant que la commission de 14 à 20 réservations. [Toutes les sources et le calcul complet](/fr/blog/commission-getyourguide-viator-booking-maroc).',
        },
        sections: [
          {
            heading: 'Plateformes et site direct ne font pas le même travail',
            paragraphs: [
              'Les places de marché comme GetYourGuide et Viator amènent des voyageurs qui ne vous connaissent pas encore, et prennent une commission sur chaque réservation qu’elles apportent ([ce que prend chaque plateforme](/fr/blog/commission-getyourguide-viator-booking-maroc)). Un site direct ne remplace pas cette visibilité.',
              'Son rôle, ce sont les voyageurs qui vous connaissent déjà : clients qui reviennent, recommandations, personnes qui cherchent votre nom ou trouvent votre fiche Google, visiteurs venus d’Instagram. Chacun d’eux qui réserve sur votre site plutôt que sur une plateforme, c’est une réservation sans commission.',
            ],
          },
          {
            heading: 'Trois façons de prendre les réservations',
            paragraphs: [
              'Un formulaire de demande avec confirmation manuelle convient à la plupart des petits prestataires : le voyageur choisit une date et le nombre de personnes, vous confirmez la disponibilité et le prix.',
              'WhatsApp d’abord, parce que c’est par là qu’arrivent la plupart des demandes au Maroc. Le bouton est placé à côté du prix et de l’itinéraire, et le message est pré-rempli avec l’activité et la date pour que vous répondiez vite. Vous pouvez créer ce lien vous-même, avec son QR code, dans notre [générateur de lien WhatsApp](/fr/outils/generateur-lien-whatsapp) gratuit.',
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
    relatedPageSlugs: ['web-design-marrakech', 'website-design-moroccan-businesses', 'agence-google-ads-maroc', 'agence-seo-marrakech'],
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
  {
    slug: 'web-design-tanger',
    primaryKeyword: 'création site web tanger',
    keywords: ['création site web tanger', 'agence web tanger', 'agence seo tanger', 'site web tanger', 'création site internet tanger', 'website design Tangier'],
    relatedProjectIds: ['kasbah-angour', 'flying-tandem', 'your-morocco'],
    relatedPageSlugs: ['web-design-casablanca', 'web-design-rabat', 'agence-seo-marrakech', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['combien-coute-site-web-maroc', 'fiche-google-business-maroc'],
    showPricing: true,
    modifiedAt: '2026-11-10',
    copy: {
      en: {
        title: 'Website Design in Tangier: Web and SEO Agency',
        description: 'Website design in Tangier for businesses, hotels and services: fast French and English sites, Google search foundations, from 2,000 MAD, quote within a day.',
        eyebrow: 'Websites for Tangier',
        heading: 'Website design in Tangier, for a city that faces Europe as much as Morocco.',
        lead: 'Between the port, the industrial zones, tourism and the city’s shops and services, a Tangier business does not serve customers who all speak the same language. Your website has to be clear to each of them, fast on mobile and easy to find on Google. We build it in French and English, with its [search foundations](/en/agence-seo-marrakech) from the start.',
        outcomesTitle: 'What a Tangier website has to do',
        outcomes: [
          'Present your business clearly to Moroccan, European and international customers.',
          'Plan the languages from the start: French and English, and a third language such as Spanish or Arabic when your customers need it.',
          'Be found on Google in Tangier: one page per service, a consistent Google Business Profile, accurate local details.',
          'Make the request simple: quote, WhatsApp and phone from every page.',
        ],
        proofTitle: 'Our work',
        proof: 'Our published work is mostly in Marrakech and the Atlas, such as [Kasbah Angour](/en/work/kasbah-angour) and [Flying Tandem](/en/work/flying-tandem). It shows the method we bring to a Tangier business: a clear offer, fast pages and a direct route to contact.',
        cta: 'Request a free quote',
        ctaNote: 'Tell us about your business and your customers. We reply within one business day.',
        sections: [
          {
            heading: 'Website and SEO in Tangier',
            paragraphs: [
              'In Tangier, businesses search for an SEO agency almost as often as for a web agency. A new website starts with its search foundations: one page per service, titles and descriptions written for search, speed, and a sitemap.',
              'To go further, our [SEO work](/en/agence-seo-marrakech) covers local search and your [Google Business Profile](/en/blog/fiche-google-business-maroc), which decides whether you appear on the map when someone in Tangier searches for your service.',
            ],
          },
          {
            heading: 'Hotels, riads and tourism in the North',
            paragraphs: [
              'Tangier, Asilah, Chefchaouen and Tetouan welcome travelers who compare on their phone before they book. For a property or a tourist activity, see our pages on [hotel and riad websites](/en/hotel-website-design) and [websites for travel agencies and activities](/en/site-web-agence-de-voyage).',
            ],
          },
          {
            heading: 'Working remotely with an agency in Marrakech',
            paragraphs: [
              'We are based in Marrakech. A Tangier project runs on calls, WhatsApp and shared previews, so you see the site take shape and approve it before it goes live. The prices and the method are the same everywhere in [Morocco](/en/website-design-moroccan-businesses).',
            ],
          },
        ],
        faqs: [
          { question: 'How much does a website cost in Tangier?', answer: 'The same published prices apply across Morocco: a showcase website starts from 2,000 MAD and an [e-commerce website](/en/creation-site-e-commerce-maroc) from 3,500 MAD, front-end and back-end included. You get a precise, free quote within one business day.' },
          { question: 'Do you also do SEO in Tangier?', answer: 'Yes. Every website includes its SEO foundations, and our [SEO work](/en/agence-seo-marrakech) covers local search and the Google Business Profile for Tangier businesses.' },
          { question: 'Can the website be in Spanish?', answer: 'French and English are planned from the start. A third language such as Spanish or Arabic can be added; we price it in the quote according to the amount of content.' },
          { question: 'Do you work with Tangier businesses from Marrakech?', answer: 'Yes. Projects run remotely through calls, WhatsApp and shared previews.' },
        ],
      },
      fr: {
        title: 'Création de site web à Tanger, agence SEO',
        description: 'Création de site web à Tanger pour entreprises, hôtels et services : sites rapides FR/EN, référencement Google, à partir de 2 000 MAD, devis sous un jour.',
        eyebrow: 'Sites web pour Tanger',
        heading: 'Création de site web à Tanger, pour une ville tournée vers l’Europe autant que vers le Maroc.',
        lead: 'Entre le port, les zones industrielles, le tourisme et les commerces et services de la ville, une entreprise de Tanger ne s’adresse pas à des clients qui parlent tous la même langue. Votre site doit être clair pour chacun d’eux, rapide sur mobile et facile à trouver sur Google. Nous le créons en français et en anglais, avec ses [fondations de référencement](/fr/agence-seo-marrakech) dès le départ.',
        outcomesTitle: 'Ce qu’un site à Tanger doit faire',
        outcomes: [
          'Présenter clairement votre activité à des clients marocains, européens et internationaux.',
          'Prévoir les langues dès le départ : français et anglais, et une troisième langue comme l’espagnol ou l’arabe si vos clients en ont besoin.',
          'Être trouvé sur Google à Tanger : une page par service, une fiche Google Business cohérente, des informations locales exactes.',
          'Rendre la demande simple : devis, WhatsApp et téléphone depuis chaque page.',
        ],
        proofTitle: 'Nos réalisations',
        proof: 'Nos réalisations publiées sont surtout à Marrakech et dans l’Atlas, comme [Kasbah Angour](/fr/work/kasbah-angour) et [Flying Tandem](/fr/work/flying-tandem). Elles montrent la méthode que nous apportons à une entreprise de Tanger : une offre claire, des pages rapides et un contact direct.',
        cta: 'Demander un devis gratuit',
        ctaNote: 'Présentez votre activité et vos clients. Nous répondons sous un jour ouvré.',
        sections: [
          {
            heading: 'Site web et SEO à Tanger',
            paragraphs: [
              'À Tanger, les entreprises cherchent une agence SEO presque aussi souvent qu’une agence web. Un nouveau site part avec ses fondations de référencement : une page par service, des titres et descriptions écrits pour la recherche, la vitesse et un plan du site.',
              'Pour aller plus loin, notre [accompagnement SEO](/fr/agence-seo-marrakech) couvre le référencement local et votre [fiche Google Business](/fr/blog/fiche-google-business-maroc), qui décide si vous apparaissez sur la carte quand quelqu’un cherche votre service à Tanger.',
            ],
          },
          {
            heading: 'Hôtels, riads et tourisme dans le Nord',
            paragraphs: [
              'Tanger, Asilah, Chefchaouen et Tétouan accueillent des voyageurs qui comparent sur leur téléphone avant de réserver. Pour un établissement ou une activité touristique, voir nos pages [site web pour hôtel et riad](/fr/hotel-website-design) et [site web pour agence de voyage et activités](/fr/site-web-agence-de-voyage).',
            ],
          },
          {
            heading: 'Travailler à distance avec une agence de Marrakech',
            paragraphs: [
              'Nous sommes basés à Marrakech. Un projet à Tanger se mène par appels, WhatsApp et aperçus partagés : vous voyez le site avancer et le validez avant sa mise en ligne. Les prix et la méthode sont les mêmes partout au [Maroc](/fr/website-design-moroccan-businesses).',
            ],
          },
        ],
        faqs: [
          { question: 'Combien coûte un site web à Tanger ?', answer: 'Les mêmes prix affichés s’appliquent partout au Maroc : un site vitrine démarre à partir de 2 000 DH et un [site e-commerce](/fr/creation-site-e-commerce-maroc) à partir de 3 500 DH, front et back inclus. Vous recevez un devis gratuit et précis sous un jour ouvré.' },
          { question: 'Faites-vous aussi le référencement (SEO) à Tanger ?', answer: 'Oui. Chaque site inclut ses fondations SEO, et notre [accompagnement SEO](/fr/agence-seo-marrakech) couvre le référencement local et la fiche Google Business pour les entreprises de Tanger.' },
          { question: 'Le site peut-il être en espagnol ?', answer: 'Le français et l’anglais sont prévus dès le départ. Une troisième langue comme l’espagnol ou l’arabe peut s’ajouter : nous la chiffrons au devis selon le volume de contenu.' },
          { question: 'Travaillez-vous avec des entreprises de Tanger depuis Marrakech ?', answer: 'Oui. Les projets se mènent à distance par appels, WhatsApp et aperçus partagés.' },
        ],
      },
    },
  },
  {
    slug: 'agence-marketing-digital-marrakech',
    primaryKeyword: 'agence marketing digital marrakech',
    keywords: ['agence marketing digital marrakech', 'agence marketing marrakech', 'agence digitale marrakech', 'agence de marketing digital marrakech', 'agence marketing digital maroc', 'agence digitale maroc', 'marketing digital marrakech', 'digital marketing agency Marrakech'],
    relatedProjectIds: ['flying-tandem', 'trust-drivers', 'kasbah-angour'],
    relatedPageSlugs: ['agence-seo-marrakech', 'agence-google-ads-maroc', 'web-design-marrakech', 'website-design-moroccan-businesses'],
    relatedPostSlugs: ['fiche-google-business-maroc', 'combien-coute-site-web-maroc', 'etude-sites-agences-web-marrakech'],
    showPricing: true,
    modifiedAt: '2026-11-12',
    copy: {
      en: {
        title: 'Digital Marketing Agency in Marrakech',
        description: 'Digital marketing agency in Marrakech: website, Google search, Google Maps listing and Google Ads run together and measured in customer enquiries.',
        eyebrow: 'Measurable digital marketing',
        heading: 'A digital marketing agency in Marrakech that counts enquiries, not likes.',
        lead: 'For a local business, digital marketing comes down to four channels: a [fast website](/en/web-design-marrakech), [Google search rankings](/en/agence-seo-marrakech), the Google Maps listing and [Google Ads](/en/agence-google-ads-maroc). We build and run them together, with one number in mind: how many enquiries each channel brings you.',
        outcomesTitle: 'What we take care of',
        outcomes: [
          'The website, the base for everything else: fast on mobile, in French and English, with WhatsApp and a short form.',
          'Search engine optimisation: pages that answer what your customers actually type, measured in Search Console.',
          'The Google Business Profile: categories, services, photos, reviews and posts, so you show on the map.',
          'Google Ads when you need enquiries fast, with conversion tracking on forms, WhatsApp and calls.',
          'A plain-language monthly report: enquiries received, cost per enquiry, rankings. No impressions or likes.',
        ],
        proofTitle: 'Tested on our own sites first',
        proof: 'We built the websites of [Flying Tandem](/en/work/flying-tandem), a paragliding operator near Marrakech, and [Kasbah Angour](/en/work/kasbah-angour), a hotel in the Atlas. We also run test sites such as [Trust Drivers Tours](/en/work/trust-drivers), where we try page structures, local signals and tracking on real searches before we use them for clients.',
        cta: 'Ask for a free review',
        ctaNote: 'Share your website or your Google listing. We reply within one business day.',
        insights: {
          title: 'What your customers search in Marrakech, and what a click costs',
          lead: 'Average monthly searches in Morocco, in French, and the bid range to appear at the top of the page, from the Google Ads Keyword Planner on November 12, 2026. Searches made from abroad, such as tourists planning a trip, are not counted.',
          items: [
            { figure: '27,100', label: '“restaurant marrakech” searches a month. A top-of-page click costs 0.43 to 6.11 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '12,100', label: '“hammam marrakech”. A click costs 2.26 to 8.76 MAD, and competition is rated high.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '6,600', label: '“location voiture marrakech” (car rental). A click costs 3.44 to 14.35 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '4,400', label: '“dentiste marrakech”. A click costs 4.06 to 8.39 MAD.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '2,400', label: '“montgolfière marrakech” (hot-air balloon). Up to 25.30 MAD a click, the most expensive in our list.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '1,600', label: '“avocat marrakech” (lawyer). A click costs 2.01 to 10.92 MAD, with almost no advertisers.', source: { label: 'Google Ads Keyword Planner', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
          ],
          note: 'Example: a dentist paying 8 MAD a click, with one visitor in ten asking for an appointment, pays about 80 MAD per request. Organic rankings and the Google listing lower that cost over time; Google Ads brings requests from the first week. [How we run campaigns](/en/agence-google-ads-maroc).',
        },
        sections: [
          {
            heading: 'Where to start, depending on where you are',
            paragraphs: [
              'No website and no Google listing yet: we start with both. The Google Business Profile is free and shows on the map once it is verified; the website gives Google and your customers a page to read. Our [Google Business Profile guide](/en/blog/fiche-google-business-maroc) has the steps.',
              'A website that brings nothing: we measure first. Search Console shows which searches you appear for and at what position. Most often the site is slow, has one page for every service, or never names the city.',
              'You need enquiries this month: Google Ads on a dedicated landing page, while organic rankings build up. The budget is sized from the price of a click in your sector, as in the figures above.',
            ],
          },
          {
            heading: 'Social media, and what we do not do',
            paragraphs: [
              'Instagram and Facebook are useful to show your work and stay in touch. We do not sell their management. We connect your profiles to the website, to the right WhatsApp link and to your Google listing, so people who discover you there can contact you or book.',
              'If you are looking for a communication agency for posts, videos or brand campaigns, we are not the right fit. If you want Google to send you customers, we are.',
            ],
          },
          {
            heading: 'What you see every month',
            paragraphs: [
              'A short report: enquiries by channel (form, WhatsApp, call), cost per enquiry on Google Ads, searches and rankings moving in Search Console, what was done and what comes next. The Google accounts (Search Console, Analytics, Ads, the Business Profile) are in your name, so you keep everything if you stop working with us.',
            ],
          },
        ],
        faqs: [
          { question: 'How much does a digital marketing agency in Marrakech cost?', answer: 'Websites start from 2,000 MAD for a showcase site and from 3,500 MAD for an e-commerce site. SEO and Google Ads management are proposed after a free review, as a scoped monthly plan or a one-off job, with written deliverables. The Google Ads ad budget comes on top of our fees. Our [website pricing guide](/en/blog/combien-coute-site-web-maroc) explains what moves a quote.' },
          { question: 'Do you manage Instagram and Facebook?', answer: 'No. We focus on the channels that can be measured in enquiries: the website, Google search, Google Maps and Google Ads. We link your social profiles to them so no contact is lost.' },
          { question: 'How fast will I see results?', answer: 'Google Ads: from the first week of running. The Google listing: a few weeks after verification and the first reviews. Organic rankings: usually three to six months on competitive commercial searches.' },
          { question: 'Do you work outside Marrakech?', answer: 'Yes, across Morocco, remotely and in French or English. See our pages for [Casablanca](/en/web-design-casablanca), [Rabat](/en/web-design-rabat) and [Tangier](/en/web-design-tanger), or [website design across Morocco](/en/website-design-moroccan-businesses).' },
        ],
      },
      fr: {
        title: 'Agence marketing digital à Marrakech',
        description: 'Agence marketing digital à Marrakech : site web, référencement Google, fiche Google Maps et Google Ads pilotés ensemble, mesurés en demandes clients.',
        eyebrow: 'Marketing digital mesurable',
        heading: 'Une agence marketing digital à Marrakech qui compte les demandes clients, pas les likes.',
        lead: 'Pour une entreprise locale, le marketing digital tient en quatre canaux : un [site web rapide](/fr/web-design-marrakech), le [référencement sur Google](/fr/agence-seo-marrakech), la fiche Google Maps et [Google Ads](/fr/agence-google-ads-maroc). Nous les construisons et les pilotons ensemble, avec un seul chiffre en tête : combien de demandes chaque canal vous apporte.',
        outcomesTitle: 'Ce que nous prenons en charge',
        outcomes: [
          'Le site, la base de tout le reste : rapide sur mobile, en français et en anglais, avec WhatsApp et un formulaire court.',
          'Le référencement naturel : des pages qui répondent à ce que vos clients tapent vraiment, mesurées dans Search Console.',
          'La fiche Google Business : catégories, services, photos, avis et publications, pour apparaître sur la carte.',
          'Google Ads quand il faut des demandes vite, avec le suivi des conversions sur les formulaires, WhatsApp et les appels.',
          'Un rapport mensuel en langage clair : demandes reçues, coût par demande, positions. Pas d’impressions ni de likes.',
        ],
        proofTitle: 'Testé d’abord sur nos propres sites',
        proof: 'Nous avons créé les sites de [Flying Tandem](/fr/work/flying-tandem), un opérateur de parapente près de Marrakech, et de [Kasbah Angour](/fr/work/kasbah-angour), un hôtel dans l’Atlas. Nous gérons aussi des sites d’essai comme [Trust Drivers Tours](/fr/work/trust-drivers), où nous testons structures de pages, signaux locaux et suivi des conversions sur de vraies recherches avant de les utiliser pour nos clients.',
        cta: 'Demander une revue gratuite',
        ctaNote: 'Partagez votre site ou votre fiche Google. Nous répondons sous un jour ouvré.',
        insights: {
          title: 'Ce que vos clients cherchent à Marrakech, et le prix d’un clic',
          lead: 'Recherches mensuelles moyennes au Maroc, en français, et fourchette d’enchère pour apparaître en haut de page, d’après le Planificateur de mots-clés Google Ads, relevé le 12 novembre 2026. Les recherches faites depuis l’étranger, comme celles des touristes qui préparent leur voyage, ne sont pas comptées.',
          items: [
            { figure: '27 100', label: 'recherches « restaurant marrakech » par mois. Le clic en haut de page coûte de 0,43 à 6,11 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '12 100', label: '« hammam marrakech ». Le clic coûte de 2,26 à 8,76 DH, et la concurrence est jugée forte.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '6 600', label: '« location voiture marrakech ». Le clic coûte de 3,44 à 14,35 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '4 400', label: '« dentiste marrakech ». Le clic coûte de 4,06 à 8,39 DH.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '2 400', label: '« montgolfière marrakech ». Jusqu’à 25,30 DH le clic, le plus cher de notre liste.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
            { figure: '1 600', label: '« avocat marrakech ». Le clic coûte de 2,01 à 10,92 DH, avec presque aucun annonceur.', source: { label: 'Planificateur de mots-clés Google Ads', href: 'https://ads.google.com/home/tools/keyword-planner/' } },
          ],
          note: 'Exemple : un dentiste qui paie 8 DH le clic, avec un visiteur sur dix qui demande un rendez-vous, paie environ 80 DH par demande. Le référencement naturel et la fiche Google font baisser ce coût avec le temps ; Google Ads apporte des demandes dès la première semaine. [Comment nous gérons les campagnes](/fr/agence-google-ads-maroc).',
        },
        sections: [
          {
            heading: 'Par quoi commencer, selon votre situation',
            paragraphs: [
              'Pas encore de site ni de fiche Google : on commence par les deux. La fiche Google Business est gratuite et apparaît sur la carte une fois validée ; le site donne à Google et à vos clients une page à lire. Notre [guide de la fiche Google Business](/fr/blog/fiche-google-business-maroc) détaille les étapes.',
              'Un site existe mais n’apporte rien : on mesure d’abord. Search Console montre sur quelles recherches vous apparaissez et à quelle position. Le plus souvent, le site est lent, n’a qu’une page pour tous les services, ou ne cite jamais la ville.',
              'Il vous faut des demandes ce mois-ci : Google Ads sur une landing page dédiée, pendant que le référencement progresse. Le budget se dimensionne à partir du prix du clic dans votre secteur, comme dans les chiffres ci-dessus.',
            ],
          },
          {
            heading: 'Les réseaux sociaux, et ce que nous n’en faisons pas',
            paragraphs: [
              'Instagram et Facebook restent utiles pour montrer votre travail et garder le contact. Nous ne vendons pas leur gestion. Nous relions vos profils au site, au bon lien WhatsApp et à votre fiche Google, pour que les personnes qui vous découvrent là-bas puissent vous contacter ou réserver.',
              'Si vous cherchez une agence de communication pour des publications, des vidéos ou des campagnes de marque, nous ne sommes pas la bonne adresse. Si vous voulez que Google vous envoie des clients, si.',
            ],
          },
          {
            heading: 'Ce que vous voyez chaque mois',
            paragraphs: [
              'Un rapport court : demandes par canal (formulaire, WhatsApp, appel), coût par demande sur Google Ads, recherches et positions qui progressent dans Search Console, ce qui a été fait et ce qui vient ensuite. Les comptes Google (Search Console, Analytics, Ads, fiche Business) sont à votre nom : vous gardez tout si vous arrêtez de travailler avec nous.',
            ],
          },
        ],
        faqs: [
          { question: 'Combien coûte une agence marketing digital à Marrakech ?', answer: 'Les sites démarrent à partir de 2 000 DH pour un site vitrine et de 3 500 DH pour un site e-commerce. Le référencement et la gestion Google Ads sont proposés après une revue gratuite, en plan mensuel cadré ou en intervention ponctuelle, avec des livrables écrits. Le budget publicitaire Google Ads s’ajoute à nos honoraires. Notre [guide des prix d’un site web au Maroc](/fr/blog/combien-coute-site-web-maroc) explique ce qui fait varier un devis.' },
          { question: 'Gérez-vous Instagram et Facebook ?', answer: 'Non. Nous nous concentrons sur les canaux qui se mesurent en demandes : le site, la recherche Google, Google Maps et Google Ads. Nous y relions vos profils sociaux pour qu’aucun contact ne se perde.' },
          { question: 'En combien de temps voit-on des résultats ?', answer: 'Google Ads : dès la première semaine de diffusion. La fiche Google : quelques semaines après la validation et les premiers avis. Le référencement naturel : en général trois à six mois sur les recherches commerciales concurrentielles.' },
          { question: 'Travaillez-vous hors de Marrakech ?', answer: 'Oui, partout au Maroc, à distance, en français ou en anglais. Voir nos pages [Casablanca](/fr/web-design-casablanca), [Rabat](/fr/web-design-rabat) et [Tanger](/fr/web-design-tanger), ou la [création de site web au Maroc](/fr/website-design-moroccan-businesses).' },
        ],
      },
    },
  },
];

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}
