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
  metrics: ProjectMetric[];
  caseStudy: {
    challenge: string;
    response: string;
    outcome: string[];
  };
};

export const projects: Project[] = [
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
