export type ProjectMetric = {
  label: string;
  value: string;
  detail: string;
};

export type Project = {
  id: string;
  title: string;
  domain: string;
  externalUrl: string;
  relationship: 'client-work' | 'studio-owned' | 'independent-project';
  category: string;
  categoryFr: string;
  summary: string;
  summaryFr: string;
  year: string;
  modifiedAt: string;
  status: 'live' | 'featured' | 'indexed';
  image: string;
  imageFull?: string;
  services: string[];
  /** The same tags in French, shown on the French pages. */
  servicesFr: string[];
  metrics: ProjectMetric[];
  caseStudy: {
    challenge: string;
    response: string;
    outcome: string[];
  };
};

export const projects: Project[] = [
  {
    // Facts checked on the live site on 2026-11-14 (footer: "Built by WeReact").
    id: 'the-roots-corner',
    title: 'The Roots Corner',
    domain: 'therootscorner.com',
    externalUrl: 'https://therootscorner.com/fr',
    relationship: 'client-work',
    category: 'E-commerce Website',
    categoryFr: 'Site e-commerce',
    summary: 'An online store in French and English for a Marrakech shop selling antique objects, craft pieces and Berber rugs, shipped from Marrakech to Morocco and abroad.',
    summaryFr: 'Une boutique en ligne en français et en anglais pour une maison marrakchie d\'objets anciens, de pièces artisanales et de tapis berbères, expédiés depuis Marrakech au Maroc et à l\'étranger.',
    year: '2026',
    modifiedAt: '2026-11-14',
    status: 'featured',
    image: '/images/projects/live/the-roots-corner-hero.webp',
    imageFull: '/images/projects/live/the-roots-corner-full.webp',
    services: ['E-commerce', 'Product catalogue', 'FR / EN'],

    servicesFr: ['E-commerce', 'Catalogue produits', 'FR / EN'],
    metrics: [
      { label: 'Store', value: 'Online', detail: 'Cart, checkout and order follow-up.' },
      { label: 'Catalogue', value: 'Rugs & objects', detail: 'Five collections and nine rug types.' },
    ],
    caseStudy: {
      challenge: 'Sell one-of-a-kind pieces and made-to-order rugs online to buyers in Morocco and abroad.',
      response: 'WeReact built a bilingual store with collections, rug types, product pages and a made-to-measure path, with delivery and returns answered before the purchase.',
      outcome: ['Bilingual product catalogue', 'Online checkout and orders', 'Made-to-measure rug requests'],
    },
  },
  {
    // Facts checked on the live site and its sitemap on 2026-11-15 (126 URLs, launched 2026-11-01).
    id: 'one-off-solutions',
    title: 'One Off Solutions',
    domain: 'oneoff.ma',
    externalUrl: 'https://oneoff.ma/',
    relationship: 'client-work',
    category: 'Recruitment Website',
    categoryFr: 'Site de recrutement',
    summary: 'The website of a Marrakech recruitment firm for hotels, riads, restaurants and spas: a page for every role, for employers and for candidates, in French and English, with each request sent to the team\'s private dashboard.',
    summaryFr: 'Le site d\'un cabinet de recrutement marrakchi pour les hôtels, riads, restaurants et spas : une page par métier, pour les recruteurs et pour les candidats, en français et en anglais, avec chaque demande envoyée dans l\'espace privé de l\'équipe.',
    year: '2026',
    modifiedAt: '2026-11-15',
    status: 'featured',
    image: '/images/projects/live/one-off-solutions-hero.webp',
    imageFull: '/images/projects/live/one-off-solutions-full.webp',
    services: ['Recruitment website', 'Private CRM', 'FR / EN'],

    servicesFr: ['Site de recrutement', 'CRM privé', 'FR / EN'],
    metrics: [
      { label: 'Pages', value: '126', detail: 'A page per role for employers and candidates, in two languages.' },
      { label: 'Roles', value: '23', detail: 'From receptionist to event coordinator.' },
    ],
    caseStudy: {
      challenge: 'Replace an old WordPress site with one that brings staff requests from hotels and restaurants and sign-ups from job seekers.',
      response: 'WeReact built a bilingual site with a page per role for each audience, two short forms and a private dashboard where the team follows every request.',
      outcome: ['126 pages in French and English', 'Staff request and candidate forms', 'Private dashboard with email alerts'],
    },
  },
  {
    // Facts checked on the live site on 2026-11-15 (one page, English).
    id: 'one-off-events',
    title: 'One-Off Events',
    domain: 'one-off-events.com',
    externalUrl: 'https://one-off-events.com/',
    relationship: 'client-work',
    category: 'Event House Website',
    categoryFr: 'Site de maison d\'événements',
    summary: 'A one-page website for a private event house in Marrakech that stays off social media: the brand\'s monogram drawn in code, a few short lines and a single email contact.',
    summaryFr: 'Un site d\'une page pour une maison d\'événements privés à Marrakech qui reste hors des réseaux sociaux : le monogramme de la marque dessiné en code, quelques phrases courtes et un seul contact par e-mail.',
    year: '2026',
    modifiedAt: '2026-11-15',
    status: 'featured',
    image: '/images/projects/live/one-off-events-hero.webp',
    imageFull: '/images/projects/live/one-off-events-full.webp',
    services: ['Brand website', 'Logo animation', 'One page'],

    servicesFr: ['Site de marque', 'Logo animé', 'Une page'],
    metrics: [
      { label: 'Format', value: 'One page', detail: 'Four short chapters and one contact.' },
      { label: 'Code', value: '< 30 KB', detail: 'Static HTML, CSS and JavaScript.' },
    ],
    caseStudy: {
      challenge: 'Give a private event house with no Instagram and no public portfolio a web presence as discreet as its service.',
      response: 'WeReact redrew the OOE monogram in SVG and built one page where the logo draws itself and four short chapters lead to a single email address.',
      outcome: ['Monogram drawn in code', 'Text revealed as you scroll', 'One email contact'],
    },
  },
  {
    id: 'flying-tandem',
    title: 'Flying Tandem',
    domain: 'flyingtandem.com',
    externalUrl: 'https://www.flyingtandem.com/',
    relationship: 'client-work',
    category: 'Adventure Tourism Website',
    categoryFr: 'Site tourisme d\'aventure',
    summary: 'Tandem paragliding over the Agafay Desert near Marrakech: price, flight itinerary, safety and pilots on one mobile-first site, with booking on WhatsApp.',
    summaryFr: 'Le parapente en biplace au-dessus du désert d\'Agafay, près de Marrakech : prix, déroulement du vol, sécurité et pilotes sur un site pensé pour le mobile, avec réservation sur WhatsApp.',
    year: '2025',
    modifiedAt: '2026-11-13',
    status: 'featured',
    image: '/images/projects/flying-tandem.webp',
    imageFull: '/images/projects/flying-tandem-full.webp',
    services: ['Booking flow', 'Performance', 'Mobile UX'],

    servicesFr: ['Parcours de réservation', 'Performance', 'UX mobile'],
    metrics: [
      { label: 'Experience', value: 'Mobile-first', detail: 'Built for visitors booking while traveling.' },
      { label: 'Sector', value: 'Tourism', detail: 'Adventure experience positioning.' },
    ],
    caseStudy: {
      challenge: 'Turn a high-adrenaline local activity into a trustworthy online booking experience.',
      response: 'WeReact structured the website around safety, clarity, visual confidence, and fast mobile paths.',
      outcome: ['Clear experience pages', 'Direct inquiry flow', 'Performance-minded build'],
    },
  },
  {
    id: 'kasbah-angour',
    title: 'Kasbah Angour',
    domain: 'kasbahangour.com',
    externalUrl: 'https://www.kasbahangour.com/en',
    relationship: 'client-work',
    category: 'Hospitality Website',
    categoryFr: 'Site hôtellerie',
    summary: 'A boutique hotel in the Atlas Mountains, about 30 minutes from Marrakech: rooms, place and directions presented so guests book direct.',
    summaryFr: 'Un hôtel de charme dans l\'Atlas, à environ 30 minutes de Marrakech : chambres, lieu et accès présentés pour que les clients réservent en direct.',
    year: '2025',
    modifiedAt: '2026-11-13',
    status: 'featured',
    image: '/images/projects/kasbah-angour.webp',
    imageFull: '/images/projects/kasbah-angour-full.webp',
    services: ['Hospitality UX', 'SEO structure', 'Direct inquiries'],

    servicesFr: ['UX hôtellerie', 'Structure SEO', 'Demandes directes'],
    metrics: [
      { label: 'Intent', value: 'Stay', detail: 'Rooms, location, and booking content aligned.' },
      { label: 'Market', value: 'Travel', detail: 'Built for international hospitality search.' },
    ],
    caseStudy: {
      challenge: 'Present a real place with enough detail and trust for travelers to inquire directly.',
      response: 'WeReact organized the experience around visual inspection, room discovery, and clear contact routes.',
      outcome: ['Place-led storytelling', 'Mobile-friendly browsing', 'Search-ready content structure'],
    },
  },
  {
    id: 'your-morocco',
    title: 'Your Morocco',
    domain: 'your-morocco.com',
    externalUrl: 'https://your-morocco.com/en',
    relationship: 'client-work',
    category: 'Travel Platform',
    categoryFr: 'Plateforme de voyage',
    summary: 'A Morocco tour site with separate catalogues of excursions and activities, one page per trip, and a short route to the enquiry.',
    summaryFr: 'Un site de circuits au Maroc avec des catalogues séparés d\'excursions et d\'activités, une page par voyage et une demande rapide.',
    year: '2025',
    modifiedAt: '2026-11-13',
    status: 'featured',
    image: '/images/projects/your-morocco.webp',
    imageFull: '/images/projects/your-morocco-full.webp',
    services: ['Travel UX', 'Multilingual structure', 'Tour discovery'],

    servicesFr: ['UX voyage', 'Structure multilingue', 'Découverte des circuits'],
    metrics: [
      { label: 'Content depth', value: 'Tour-led', detail: 'Experience pages designed for comparison.' },
      { label: 'Reach', value: 'Global', detail: 'Built for Morocco travel audiences.' },
    ],
    caseStudy: {
      challenge: 'Make Moroccan travel offers easy to scan, compare, and trust.',
      response: 'WeReact focused on structured tour discovery, readable content, and strong mobile performance.',
      outcome: ['Tour catalogue structure', 'Destination-led SEO', 'Clear inquiry routes'],
    },
  },
  {
    id: 'by-marrakech',
    title: 'By Marrakech',
    domain: 'by-marrakech.vercel.app',
    externalUrl: 'https://by-marrakech.vercel.app/en',
    relationship: 'client-work',
    category: 'Transfers & Tours',
    categoryFr: 'Transferts et circuits',
    summary: 'Private transfers from Marrakech Menara airport, Atlas day trips and Sahara tours, with fleet, driver and guide pages.',
    summaryFr: 'Transferts privés depuis l\'aéroport de Marrakech Ménara, excursions dans l\'Atlas et circuits dans le Sahara, avec des pages flotte, chauffeurs et guides.',
    year: '2025',
    modifiedAt: '2026-11-14',
    status: 'featured',
    image: '/images/projects/by-marrakech.webp',
    imageFull: '/images/projects/by-marrakech-full.webp',
    services: ['City guide UX', 'i18n', 'Content systems'],

    servicesFr: ['UX de guide', 'Multilingue', 'Système de contenu'],
    metrics: [
      { label: 'Location', value: 'Marrakech', detail: 'Built around city discovery.' },
      { label: 'Format', value: 'Guide', detail: 'Designed for browsing and exploration.' },
    ],
    caseStudy: {
      challenge: 'Create a digital guide that feels fast, local, and useful on the move.',
      response: 'WeReact designed a clean content system with strong categories and mobile-first reading.',
      outcome: ['Guide-style browsing', 'Marrakech location signals', 'Reusable content sections'],
    },
  },
  {
    id: 'trust-drivers',
    title: 'Trust Drivers Tours',
    domain: 'www.trustdrivers.tours',
    externalUrl: 'https://www.trustdrivers.tours/',
    relationship: 'client-work',
    category: 'Transport & Tours',
    categoryFr: 'Transport touristique',
    summary: 'Private tours and multi-day circuits from Marrakech (Merzouga, the south, the imperial cities), one page per circuit, booked on WhatsApp.',
    summaryFr: 'Circuits privés au départ de Marrakech (Merzouga, le Sud, les villes impériales), une page par circuit, réservation sur WhatsApp.',
    year: '2026',
    modifiedAt: '2026-11-14',
    status: 'indexed',
    image: '/images/projects/live/trust-drivers-hero-settled.webp',
    imageFull: '/images/projects/live/trust-drivers-full-settled.webp',
    services: ['Tour SEO', 'Conversion flow', 'Trust signals'],

    servicesFr: ['SEO des circuits', 'Parcours de conversion', 'Signaux de confiance'],
    metrics: [
      { label: 'Search intent', value: 'Tours', detail: 'Built for private driver and tour discovery.' },
      { label: 'Priority', value: 'Trust', detail: 'Contact, credibility, and service clarity first.' },
    ],
    caseStudy: {
      challenge: 'Help travelers quickly understand routes, trust, and inquiry options.',
      response: 'Use service panels, local landing content, and clear WhatsApp conversion paths.',
      outcome: ['Tour-service hierarchy', 'Local SEO signals', 'Fast contact path'],
    },
  },
  {
    id: 'yoo-marrakech',
    title: 'Yoo Marrakech',
    domain: 'www.yoomarrakech.com',
    externalUrl: 'https://www.yoomarrakech.com/',
    relationship: 'client-work',
    category: 'Travel Brand',
    categoryFr: 'Marque de voyage',
    summary: 'A Marrakech travel brand: tailor-made trips around Marrakech, the Agafay Desert and the Atlas, in English and French.',
    summaryFr: 'Une marque de voyage à Marrakech : voyages sur mesure autour de Marrakech, du désert d\'Agafay et de l\'Atlas, en anglais et en français.',
    year: '2026',
    modifiedAt: '2026-11-14',
    status: 'indexed',
    image: '/images/projects/live/yoo-marrakech-hero-settled.webp',
    imageFull: '/images/projects/live/yoo-marrakech-full-settled.webp',
    services: ['Local SEO', 'Brand website', 'Mobile UX'],

    servicesFr: ['SEO local', 'Site de marque', 'UX mobile'],
    metrics: [
      { label: 'Geo target', value: 'Marrakech', detail: 'Location-first content structure.' },
      { label: 'Experience', value: 'Mobile', detail: 'Designed for quick local discovery.' },
    ],
    caseStudy: {
      challenge: 'Create a professional local web presence that can compete in Marrakech search results.',
      response: 'Structure services, location signals, and clear brand messaging in a premium interface.',
      outcome: ['Local brand positioning', 'Search-friendly pages', 'Clear action paths'],
    },
  },
  {
    id: 'morocco-atlas-guide',
    title: 'Morocco Atlas Guide',
    domain: 'www.moroccoatlasguide.com',
    externalUrl: 'https://www.moroccoatlasguide.com/',
    relationship: 'client-work',
    category: 'Trekking & Tours',
    categoryFr: 'Trekking et circuits',
    summary: 'High Atlas mountain guides from Imlil: Toubkal treks, desert tours and imperial cities, in three languages.',
    summaryFr: 'Des guides de montagne du Haut Atlas basés à Imlil : Toubkal, désert et villes impériales, en trois langues.',
    year: '2026',
    modifiedAt: '2026-11-14',
    status: 'indexed',
    image: '/images/projects/live/morocco-atlas-guide-hero-settled.webp',
    imageFull: '/images/projects/live/morocco-atlas-guide-full-settled.webp',
    services: ['Destination SEO', 'Guide content', 'Travel UX'],

    servicesFr: ['SEO de destination', 'Contenu de guide', 'UX voyage'],
    metrics: [
      { label: 'Destination', value: 'Atlas', detail: 'Built around itinerary and guide intent.' },
      { label: 'Market', value: 'Travel', detail: 'Supports international trip planning.' },
    ],
    caseStudy: {
      challenge: 'Turn destination knowledge into an organized web experience for travelers.',
      response: 'Use guide-style content blocks, route cards, and local expertise signals.',
      outcome: ['Destination content model', 'Travel inquiry UX', 'Geo-rich page structure'],
    },
  },
];

export const featuredProjects = projects.filter((project) => project.status === 'featured');

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

/** Category and summary in the page language (French pages must not show the English copy). */
export function getProjectCopy(project: Project, language: 'en' | 'fr') {
  return language === 'fr'
    ? { category: project.categoryFr, summary: project.summaryFr }
    : { category: project.category.replace(/^Studio Project: /, ''), summary: project.summary };
}
