/**
 * Long-form case study copy, in both languages. Each /fr page must carry its
 * own French text: when the French and English pages showed the same English
 * body, Google treated them as duplicates and left one of each pair out of the
 * index (Search Console, November 2026).
 *
 * Facts about the live sites were checked on the sites themselves on
 * 2026-11-13 (titles, descriptions, navigation). Do not add results such as
 * traffic or bookings without the client's numbers.
 */

export type CaseStudyCopy = {
  category: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  results: readonly string[];
  /** Same order as the icons on the page: build, reach, mobile. */
  features: readonly { title: string; description: string }[];
  metrics: readonly { label: string; value: string; description: string }[];
};

export type CaseStudy = {
  id: string;
  title: string;
  year: string;
  tags: readonly string[];
  link: string;
  image: string;
  imageFull: string;
  imageFullHeight?: number;
  gradient: string;
  /** The service page this project illustrates, linked from the case study. */
  serviceSlug: string;
  serviceLabel: Record<'en' | 'fr', string>;
  copy: Record<'en' | 'fr', CaseStudyCopy>;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    id: 'flying-tandem',
    title: 'Flying Tandem',
    year: '2025',
    tags: ['Booking enquiries', 'Responsive', 'Mobile UX', 'i18n'],
    link: 'https://www.flyingtandem.com/',
    image: '/images/projects/flying-tandem.webp',
    imageFull: '/images/projects/flying-tandem-full.webp',
    gradient: 'from-[#3A5A40] to-[#2e4833]',
    serviceSlug: 'tourism-websites-morocco',
    serviceLabel: { en: 'Tourism websites in Morocco', fr: 'Sites web pour le tourisme au Maroc' },
    copy: {
      en: {
        category: 'Tourism Website',
        tagline: 'Tandem paragliding over the Agafay Desert, explained and bookable from a phone',
        description: 'The website of Fly Tandem, a tandem paragliding operator flying over the Agafay Desert near Marrakech. It shows the price per person, how the day runs, what is included, who can fly and the pilots, in English and French, with booking on WhatsApp.',
        challenge: 'A first paragliding flight is a big decision. Visitors need to understand the flight, see who flies them and feel safe before they send a request, usually from a phone while they are already travelling in Morocco.',
        solution: 'We organised the home page around the questions people ask before they book, in that order: the price, the flight itinerary from pickup in Marrakech to landing, what is included, the safety standards, who can fly, then the pilots with their experience. Other activities (horse riding, camel trekking, quad biking) have their own pages, and every section leads to a booking button or WhatsApp.',
        results: [
          'Price, itinerary and inclusions answered before the visitor has to ask',
          'A pilots section with each instructor’s role and years of experience',
          'Pages for the other activities: horse riding, camel trekking and quad biking',
          'English and French versions',
          'A frequently asked questions section and a direct WhatsApp contact',
          'Photo gallery of real flights',
        ],
        features: [
          { title: 'Booking enquiries', description: 'Direct request paths from every experience page' },
          { title: 'International visitors', description: 'Content written for travellers planning their stay' },
          { title: 'Mobile first', description: 'Built for tourists browsing on their phones' },
        ],
        metrics: [
          { label: 'Experience', value: 'Mobile-first', description: 'Built for travellers booking on the go' },
          { label: 'Sector', value: 'Adventure', description: 'Paragliding and outdoor activities' },
          { label: 'Launched', value: '2025', description: 'Live tourism website' },
        ],
      },
      fr: {
        category: 'Site de tourisme',
        tagline: 'Le parapente en biplace au-dessus du désert d’Agafay, expliqué et réservable depuis un téléphone',
        description: 'Le site de Fly Tandem, un opérateur de parapente en biplace qui vole au-dessus du désert d’Agafay, près de Marrakech. Il présente le prix par personne, le déroulement de la journée, ce qui est inclus, qui peut voler et l’équipe de pilotes, en anglais et en français, avec la réservation sur WhatsApp.',
        challenge: 'Un premier vol en parapente est une vraie décision. Le visiteur doit comprendre le vol, savoir qui le pilote et se sentir en sécurité avant d’envoyer une demande, le plus souvent depuis son téléphone, déjà en voyage au Maroc.',
        solution: 'Nous avons organisé la page d’accueil autour des questions posées avant de réserver, dans cet ordre : le prix, le déroulement du vol depuis la prise en charge à Marrakech, ce qui est inclus, les normes de sécurité, qui peut voler, puis les pilotes et leur expérience. Les autres activités (balade à cheval, à dos de dromadaire, quad) ont leurs propres pages, et chaque section mène à un bouton de réservation ou à WhatsApp.',
        results: [
          'Le prix, le déroulement et ce qui est inclus, avant même que le visiteur pose la question',
          'Une section pilotes avec le rôle et les années d’expérience de chaque moniteur',
          'Des pages pour les autres activités : cheval, dromadaire et quad',
          'Une version anglaise et une version française',
          'Une foire aux questions et un contact WhatsApp direct',
          'Une galerie de photos de vrais vols',
        ],
        features: [
          { title: 'Demandes de réservation', description: 'Une demande directe depuis chaque page d’expérience' },
          { title: 'Visiteurs étrangers', description: 'Un contenu écrit pour les voyageurs qui préparent leur séjour' },
          { title: 'Mobile d’abord', description: 'Conçu pour les touristes qui naviguent sur leur téléphone' },
        ],
        metrics: [
          { label: 'Expérience', value: 'Mobile', description: 'Conçu pour réserver en déplacement' },
          { label: 'Secteur', value: 'Aventure', description: 'Parapente et activités de plein air' },
          { label: 'Mise en ligne', value: '2025', description: 'Site de tourisme en ligne' },
        ],
      },
    },
  },
  {
    id: 'kasbah-angour',
    title: 'Kasbah Angour',
    year: '2025',
    tags: ['Next.js', 'Hospitality', 'SEO', 'Direct enquiries', 'Photography'],
    link: 'https://www.kasbahangour.com/en',
    image: '/images/projects/kasbah-angour.webp',
    imageFull: '/images/projects/kasbah-angour-full.webp',
    gradient: 'from-[#2e4833] to-[#1f3322]',
    serviceSlug: 'hotel-website-design',
    serviceLabel: { en: 'Hotel and riad website design', fr: 'Création de site pour hôtel et riad' },
    copy: {
      en: {
        category: 'Hotel Website',
        tagline: 'A boutique hotel in the Atlas Mountains, presented so guests book direct',
        description: 'The website of Kasbah Angour, a boutique hotel in the Atlas Mountains about 30 minutes from Marrakech: rooms, the place and its views, services, location and direct contact for reservations.',
        challenge: 'Travellers compare a hotel on booking platforms before they visit its own site. Kasbah Angour needed a site that shows the rooms, the setting and the route from Marrakech clearly enough that a guest writes to the hotel instead of going back to a platform.',
        solution: 'We built the site around what a guest inspects before booking: the rooms with their photos, the place and the views, how to get there from Marrakech, and a contact route that stays next to that content on every page.',
        results: [
          'Room pages with photo galleries',
          'The place, the views and the services presented with the hotel’s own photography',
          'Directions and distance from Marrakech for guests planning the trip',
          'Direct enquiry routes for reservations on every page',
          'Page structure ready for searches on Atlas hotels near Marrakech',
        ],
        features: [
          { title: 'Room showcase', description: 'Each room presented with its photo gallery' },
          { title: 'Search structure', description: 'Pages organised around what travellers search' },
          { title: 'Direct enquiries', description: 'Clear contact routes for reservations' },
        ],
        metrics: [
          { label: 'Focus', value: 'Direct', description: 'Enquiry-first reservation paths' },
          { label: 'Location', value: 'Atlas', description: 'About 30 minutes from Marrakech' },
          { label: 'Launched', value: '2025', description: 'Live hotel website' },
        ],
      },
      fr: {
        category: 'Site d’hôtel',
        tagline: 'Un hôtel de charme dans l’Atlas, présenté pour que les clients réservent en direct',
        description: 'Le site de Kasbah Angour, un hôtel de charme dans l’Atlas, à environ 30 minutes de Marrakech : les chambres, le lieu et ses vues, les services, l’accès et le contact direct pour réserver.',
        challenge: 'Les voyageurs comparent un hôtel sur les plateformes de réservation avant de visiter son propre site. Kasbah Angour avait besoin d’un site qui montre les chambres, le cadre et la route depuis Marrakech assez clairement pour que le client écrive à l’hôtel au lieu de retourner sur une plateforme.',
        solution: 'Nous avons construit le site autour de ce qu’un client vérifie avant de réserver : les chambres et leurs photos, le lieu et les vues, l’accès depuis Marrakech, et un moyen de contact qui reste à côté de ce contenu sur chaque page.',
        results: [
          'Des pages chambres avec galeries photos',
          'Le lieu, les vues et les services présentés avec les photos de l’hôtel',
          'L’accès et la distance depuis Marrakech pour préparer le trajet',
          'Une demande de réservation directe sur chaque page',
          'Une structure de pages prête pour les recherches d’hôtels dans l’Atlas près de Marrakech',
        ],
        features: [
          { title: 'Chambres', description: 'Chaque chambre présentée avec sa galerie photos' },
          { title: 'Structure SEO', description: 'Des pages organisées selon ce que cherchent les voyageurs' },
          { title: 'Réservation directe', description: 'Des moyens de contact clairs pour réserver' },
        ],
        metrics: [
          { label: 'Objectif', value: 'Direct', description: 'La demande de réservation en premier' },
          { label: 'Lieu', value: 'Atlas', description: 'À environ 30 minutes de Marrakech' },
          { label: 'Mise en ligne', value: '2025', description: 'Site d’hôtel en ligne' },
        ],
      },
    },
  },
  {
    id: 'your-morocco',
    title: 'Your Morocco',
    year: '2025',
    tags: ['Next.js', 'Travel', 'Tour catalogue', 'Multilingual', 'SEO'],
    link: 'https://your-morocco.com/en',
    image: '/images/projects/your-morocco.webp',
    imageFull: '/images/projects/your-morocco-full.webp',
    gradient: 'from-[#3A5A40] to-[#2e4833]',
    serviceSlug: 'site-web-agence-de-voyage',
    serviceLabel: { en: 'Travel agency websites', fr: 'Site web pour agence de voyage' },
    copy: {
      en: {
        category: 'Travel Platform',
        tagline: 'Excursions and activities across Morocco, each with its own page',
        description: 'A travel site for tours in Morocco: a catalogue of excursions and a catalogue of activities, a page for each one, plus a gallery, a blog and a contact page for travellers who want to book.',
        challenge: 'A tour operator sells many trips that look alike from far away. Travellers need to scan the offer, compare a few trips and understand exactly what each one includes before they ask for a date.',
        solution: 'We split the offer into excursions and activities, gave every trip its own page with its programme and inclusions, and kept a short route from each page to the enquiry.',
        results: [
          'Separate catalogues for excursions and activities',
          'One page per trip, with its programme and what is included',
          'Gallery and blog pages to show the trips and answer travellers’ questions',
          'Pages structured for destination searches',
          'A short enquiry route from every trip page',
        ],
        features: [
          { title: 'Tour catalogue', description: 'Excursions and activities, each on its own page' },
          { title: 'Multilingual', description: 'Structured for international travellers' },
          { title: 'Enquiry flow', description: 'Clear routes from trip pages to contact' },
        ],
        metrics: [
          { label: 'Content', value: 'Tour pages', description: 'One page per excursion or activity' },
          { label: 'Reach', value: 'Global', description: 'Built for travellers planning Morocco' },
          { label: 'Launched', value: '2025', description: 'Live travel site' },
        ],
      },
      fr: {
        category: 'Plateforme de voyage',
        tagline: 'Des excursions et des activités partout au Maroc, chacune sur sa page',
        description: 'Un site de circuits au Maroc : un catalogue d’excursions et un catalogue d’activités, une page pour chacune, avec une galerie, un blog et une page contact pour les voyageurs qui veulent réserver.',
        challenge: 'Un organisateur de circuits vend beaucoup de voyages qui se ressemblent vus de loin. Le voyageur doit parcourir l’offre, comparer quelques circuits et comprendre ce que chacun comprend avant de demander une date.',
        solution: 'Nous avons séparé l’offre en excursions et activités, donné à chaque voyage sa page avec son programme et ce qui est inclus, et gardé un chemin court entre chaque page et la demande.',
        results: [
          'Des catalogues séparés pour les excursions et les activités',
          'Une page par voyage, avec son programme et ce qui est inclus',
          'Une galerie et un blog pour montrer les voyages et répondre aux questions',
          'Des pages structurées pour les recherches par destination',
          'Une demande rapide depuis chaque page de voyage',
        ],
        features: [
          { title: 'Catalogue de circuits', description: 'Excursions et activités, chacune sur sa page' },
          { title: 'Multilingue', description: 'Pensé pour les voyageurs étrangers' },
          { title: 'Demande simple', description: 'Un chemin clair de chaque voyage vers le contact' },
        ],
        metrics: [
          { label: 'Contenu', value: 'Circuits', description: 'Une page par excursion ou activité' },
          { label: 'Public', value: 'International', description: 'Pour les voyageurs qui préparent le Maroc' },
          { label: 'Mise en ligne', value: '2025', description: 'Site de voyage en ligne' },
        ],
      },
    },
  },
  {
    id: 'by-marrakech',
    title: 'By Marrakech',
    year: '2025',
    tags: ['Next.js', 'Transfers', 'i18n', 'Mobile UX', 'SEO'],
    link: 'https://by-marrakech.vercel.app/en',
    image: '/images/projects/by-marrakech.webp',
    imageFull: '/images/projects/by-marrakech-full.webp',
    gradient: 'from-[#2e4833] to-[#1f3322]',
    serviceSlug: 'web-design-marrakech',
    serviceLabel: { en: 'Website design in Marrakech', fr: 'Création de site web à Marrakech' },
    copy: {
      en: {
        category: 'Transfers & Tours',
        tagline: 'Private transfers, day trips and local guides in Marrakech',
        description: 'A Marrakech site for private transport and tours: transfers from Marrakech Menara airport, Atlas day trips and Sahara tours, with pages for the fleet, the drivers and local guides.',
        challenge: 'Visitors arriving in Marrakech want a fixed price, a vehicle they can picture and a driver they can trust, often before their flight lands. The site had to answer those three questions quickly on a phone.',
        solution: 'We organised the site by what the visitor needs: transfers, tours and experiences, then the fleet, the drivers and the guides behind them, with contact available from every page.',
        results: [
          'Separate pages for transfers, tours and experiences',
          'Fleet, driver and guide pages that show who does the job',
          'Explore and gallery pages about Marrakech and its surroundings',
          'Content structure in several languages',
          'Mobile-first pages for visitors on the move',
        ],
        features: [
          { title: 'Service pages', description: 'Transfers, tours and experiences, each with its own page' },
          { title: 'Multilingual', description: 'Content structured for international visitors' },
          { title: 'Mobile first', description: 'Designed for booking from a phone' },
        ],
        metrics: [
          { label: 'Location', value: 'Marrakech', description: 'Airport, city, Atlas and Sahara' },
          { label: 'Format', value: 'Transport', description: 'Transfers, tours and guides' },
          { label: 'Launched', value: '2025', description: 'Live website' },
        ],
      },
      fr: {
        category: 'Transferts et circuits',
        tagline: 'Transferts privés, excursions et guides locaux à Marrakech',
        description: 'Un site marrakchi de transport privé et de circuits : transferts depuis l’aéroport de Marrakech Ménara, excursions d’une journée dans l’Atlas et circuits dans le Sahara, avec des pages pour la flotte, les chauffeurs et les guides.',
        challenge: 'Le visiteur qui arrive à Marrakech veut un prix fixe, un véhicule qu’il peut imaginer et un chauffeur de confiance, souvent avant même l’atterrissage. Le site devait répondre vite à ces trois questions sur un téléphone.',
        solution: 'Nous avons organisé le site selon le besoin du visiteur : transferts, circuits et expériences, puis la flotte, les chauffeurs et les guides qui les assurent, avec un contact accessible depuis chaque page.',
        results: [
          'Des pages séparées pour les transferts, les circuits et les expériences',
          'Des pages flotte, chauffeurs et guides qui montrent qui fait le travail',
          'Des pages découverte et galerie sur Marrakech et ses environs',
          'Une structure de contenu en plusieurs langues',
          'Des pages pensées pour le mobile, pour les visiteurs en déplacement',
        ],
        features: [
          { title: 'Pages de services', description: 'Transferts, circuits et expériences, chacun sur sa page' },
          { title: 'Multilingue', description: 'Un contenu structuré pour les visiteurs étrangers' },
          { title: 'Mobile d’abord', description: 'Conçu pour réserver depuis un téléphone' },
        ],
        metrics: [
          { label: 'Lieu', value: 'Marrakech', description: 'Aéroport, ville, Atlas et Sahara' },
          { label: 'Format', value: 'Transport', description: 'Transferts, circuits et guides' },
          { label: 'Mise en ligne', value: '2025', description: 'Site en ligne' },
        ],
      },
    },
  },
  {
    id: 'trust-drivers',
    title: 'Trust Drivers Tours',
    year: '2026',
    tags: ['Tour SEO', 'Conversion flow', 'Trust signals', 'Mobile UX'],
    link: 'https://www.trustdrivers.tours/',
    image: '/images/projects/live/trust-drivers-hero-settled.webp',
    imageFull: '/images/projects/live/trust-drivers-full-settled.webp',
    imageFullHeight: 6671,
    gradient: 'from-[#3A5A40] to-[#2e4833]',
    serviceSlug: 'site-web-agence-de-voyage',
    serviceLabel: { en: 'Travel agency websites', fr: 'Site web pour agence de voyage' },
    copy: {
      en: {
        category: 'Studio Project · Transport & Tours',
        tagline: 'Private tours and multi-day circuits from Marrakech, built and run by our studio',
        description: 'A tour and private driver website owned and run by WeReact. It sells private tours from Marrakech, including multi-day circuits to Merzouga, the south and the imperial cities, and we use it to test page structures and local search signals on real searches.',
        challenge: 'Travellers comparing private drivers need to understand the routes, the duration and who will drive them, then reach someone fast. The site had to earn that trust without reviews from a big platform.',
        solution: 'We structured the site around tour services and circuits, with a page for each circuit (3 days to Merzouga, 5 days in the south, 8 days through the imperial cities), clear service details and WhatsApp-style contact paths.',
        results: [
          'A page for each multi-day circuit, with its route and duration',
          'Service pages for private transport and tours',
          'Local search signals for Morocco travel searches',
          'A fast contact path for travellers ready to book',
        ],
        features: [
          { title: 'Service structure', description: 'Clear transport and tour categories' },
          { title: 'Local search', description: 'Morocco travel searches and route signals' },
          { title: 'Fast enquiry', description: 'Mobile-first contact and quote paths' },
        ],
        metrics: [
          { label: 'Search intent', value: 'Tours', description: 'Private driver and circuit searches' },
          { label: 'Circuits', value: '3 to 8 days', description: 'Merzouga, the south, imperial cities' },
          { label: 'Owner', value: 'Studio', description: 'Built and run by WeReact' },
        ],
      },
      fr: {
        category: 'Projet du studio · Transport et circuits',
        tagline: 'Circuits privés au départ de Marrakech, conçus et gérés par notre studio',
        description: 'Un site de circuits et de chauffeurs privés qui appartient à WeReact et que nous gérons. Il propose des circuits privés au départ de Marrakech, dont des circuits de plusieurs jours vers Merzouga, le Sud et les villes impériales, et nous sert à tester des structures de pages et des signaux locaux sur de vraies recherches.',
        challenge: 'Le voyageur qui compare des chauffeurs privés veut comprendre l’itinéraire, la durée et qui le conduira, puis joindre quelqu’un vite. Le site devait gagner cette confiance sans les avis d’une grande plateforme.',
        solution: 'Nous avons structuré le site autour des services et des circuits, avec une page par circuit (3 jours vers Merzouga, 5 jours dans le Sud, 8 jours par les villes impériales), des détails de service clairs et un contact de type WhatsApp.',
        results: [
          'Une page par circuit de plusieurs jours, avec son itinéraire et sa durée',
          'Des pages de services pour le transport privé et les circuits',
          'Des signaux locaux pour les recherches de voyage au Maroc',
          'Un contact rapide pour les voyageurs prêts à réserver',
        ],
        features: [
          { title: 'Structure des services', description: 'Des catégories claires de transport et de circuits' },
          { title: 'Recherche locale', description: 'Recherches de voyage au Maroc et itinéraires' },
          { title: 'Demande rapide', description: 'Contact et devis pensés pour le mobile' },
        ],
        metrics: [
          { label: 'Intention', value: 'Circuits', description: 'Recherches de chauffeur et de circuit privé' },
          { label: 'Circuits', value: '3 à 8 jours', description: 'Merzouga, le Sud, les villes impériales' },
          { label: 'Propriétaire', value: 'Studio', description: 'Conçu et géré par WeReact' },
        ],
      },
    },
  },
  {
    id: 'yoo-marrakech',
    title: 'Yoo Marrakech',
    year: '2026',
    tags: ['Local SEO', 'Brand website', 'Mobile UX', 'Marrakech'],
    link: 'https://www.yoomarrakech.com/',
    image: '/images/projects/live/yoo-marrakech-hero-settled.webp',
    imageFull: '/images/projects/live/yoo-marrakech-full-settled.webp',
    imageFullHeight: 8195,
    gradient: 'from-[#2e4833] to-[#1f3322]',
    serviceSlug: 'web-design-marrakech',
    serviceLabel: { en: 'Website design in Marrakech', fr: 'Création de site web à Marrakech' },
    copy: {
      en: {
        category: 'Studio Project · Travel Brand',
        tagline: 'Tailor-made trips from Marrakech, to the Agafay Desert and the Atlas Mountains',
        description: 'A Marrakech travel brand website owned and run by WeReact: tailor-made trips, tours and packages around Marrakech, the Agafay Desert and the Atlas Mountains, in English and French, with a date and traveller search on the home page.',
        challenge: 'A new travel brand starts with no reviews and no rankings. The site had to show where it takes people and how to book in a few seconds, and give Google clear signals about the place and the offer.',
        solution: 'We organised the site around destinations (Marrakech, the Agafay Desert, the Atlas Mountains), each leading to its tours or packages, put a date and traveller search at the top, and kept one clear next step on every page.',
        results: [
          'Destination blocks that lead straight to the matching tours and packages',
          'A date and traveller search on the home page',
          'English and French versions',
          'Responsive layout for phones and desktops',
        ],
        features: [
          { title: 'Destinations', description: 'Marrakech, Agafay and the Atlas, each with its tours' },
          { title: 'Location signals', description: 'Marrakech-first content structure' },
          { title: 'Mobile UX', description: 'Quick trip search on small screens' },
        ],
        metrics: [
          { label: 'Target', value: 'Marrakech', description: 'Location-first content structure' },
          { label: 'Experience', value: 'Mobile', description: 'Designed for quick local browsing' },
          { label: 'Owner', value: 'Studio', description: 'Built and run by WeReact' },
        ],
      },
      fr: {
        category: 'Projet du studio · Marque de voyage',
        tagline: 'Des voyages sur mesure depuis Marrakech, vers le désert d’Agafay et l’Atlas',
        description: 'Le site d’une marque de voyage marrakchie qui appartient à WeReact et que nous gérons : voyages sur mesure, circuits et forfaits autour de Marrakech, du désert d’Agafay et de l’Atlas, en anglais et en français, avec une recherche par date et nombre de voyageurs dès la page d’accueil.',
        challenge: 'Une nouvelle marque de voyage démarre sans avis ni positions. Le site devait montrer en quelques secondes où elle emmène les voyageurs et comment réserver, et donner à Google des signaux clairs sur le lieu et l’offre.',
        solution: 'Nous avons organisé le site par destination (Marrakech, le désert d’Agafay, l’Atlas), chacune menant à ses circuits ou forfaits, placé une recherche par date et voyageurs en haut de page, et gardé une seule prochaine étape claire sur chaque page.',
        results: [
          'Des blocs de destination qui mènent directement aux circuits et forfaits',
          'Une recherche par date et nombre de voyageurs sur la page d’accueil',
          'Une version anglaise et une version française',
          'Une mise en page adaptée au téléphone comme à l’ordinateur',
        ],
        features: [
          { title: 'Destinations', description: 'Marrakech, Agafay et l’Atlas, chacune avec ses circuits' },
          { title: 'Signaux locaux', description: 'Une structure de contenu centrée sur Marrakech' },
          { title: 'Mobile', description: 'Une recherche de voyage rapide sur petit écran' },
        ],
        metrics: [
          { label: 'Cible', value: 'Marrakech', description: 'Contenu organisé autour du lieu' },
          { label: 'Expérience', value: 'Mobile', description: 'Pensé pour une navigation locale rapide' },
          { label: 'Propriétaire', value: 'Studio', description: 'Conçu et géré par WeReact' },
        ],
      },
    },
  },
  {
    id: 'morocco-atlas-guide',
    title: 'Morocco Atlas Guide',
    year: '2026',
    tags: ['Destination SEO', 'Guide content', 'Travel UX', 'Atlas'],
    link: 'https://www.moroccoatlasguide.com/',
    image: '/images/projects/live/morocco-atlas-guide-hero-settled.webp',
    imageFull: '/images/projects/live/morocco-atlas-guide-full-settled.webp',
    imageFullHeight: 14145,
    gradient: 'from-[#3A5A40] to-[#2e4833]',
    serviceSlug: 'tourism-websites-morocco',
    serviceLabel: { en: 'Tourism websites in Morocco', fr: 'Sites web pour le tourisme au Maroc' },
    copy: {
      en: {
        category: 'Studio Project · Trekking & Tours',
        tagline: 'Toubkal treks and Sahara tours with mountain guides from Imlil',
        description: 'A trekking and tour website owned and run by WeReact for a team of High Atlas mountain guides from Imlil: Toubkal treks, desert tours, imperial cities and day excursions, in English, Spanish and French, with booking on WhatsApp.',
        challenge: 'Trekkers choose a guide on trust: certifications, local roots and a clear programme. The site had to show the guides’ credentials and the tours in a way travellers can check before they write.',
        solution: 'We organised the tours into four categories (Toubkal treks, desert tours, imperial cities, excursions), gave each tour its own page, and put the guides, their certifications and their team (drivers, muleteers, cooks) next to a WhatsApp booking button.',
        results: [
          'Tours sorted into Toubkal treks, desert tours, imperial cities and excursions',
          'A page for each tour, such as the two-day Toubkal trek or three days to Merzouga',
          'Guide credentials and team presented before the booking',
          'English, Spanish and French versions',
        ],
        features: [
          { title: 'Guide content', description: 'Readable destination and route sections' },
          { title: 'Destination SEO', description: 'Atlas and Morocco travel searches' },
          { title: 'Trip planning', description: 'Mobile-friendly itinerary discovery' },
        ],
        metrics: [
          { label: 'Destination', value: 'Atlas', description: 'Built around itinerary searches' },
          { label: 'Market', value: 'Travel', description: 'International trip planning' },
          { label: 'Owner', value: 'Studio', description: 'Built and run by WeReact' },
        ],
      },
      fr: {
        category: 'Projet du studio · Trekking et circuits',
        tagline: 'Treks au Toubkal et circuits dans le Sahara avec des guides de montagne d’Imlil',
        description: 'Un site de trekking et de circuits qui appartient à WeReact et que nous gérons pour une équipe de guides de montagne du Haut Atlas, basée à Imlil : treks au Toubkal, circuits dans le désert, villes impériales et excursions, en anglais, espagnol et français, avec la réservation sur WhatsApp.',
        challenge: 'Le randonneur choisit son guide sur la confiance : diplômes, ancrage local et programme clair. Le site devait montrer les qualifications des guides et les circuits de façon vérifiable avant le premier message.',
        solution: 'Nous avons classé les circuits en quatre catégories (treks au Toubkal, désert, villes impériales, excursions), donné à chacun sa page, et placé les guides, leurs certifications et leur équipe (chauffeurs, muletiers, cuisiniers) à côté d’un bouton de réservation WhatsApp.',
        results: [
          'Des circuits classés en treks au Toubkal, désert, villes impériales et excursions',
          'Une page par circuit, comme le trek du Toubkal en deux jours ou Merzouga en trois jours',
          'Les qualifications des guides et l’équipe présentées avant la réservation',
          'Une version anglaise, espagnole et française',
        ],
        features: [
          { title: 'Contenu de guide', description: 'Des sections lisibles sur les lieux et itinéraires' },
          { title: 'SEO de destination', description: 'Recherches de voyage dans l’Atlas et au Maroc' },
          { title: 'Préparer le voyage', description: 'Des itinéraires faciles à consulter sur mobile' },
        ],
        metrics: [
          { label: 'Destination', value: 'Atlas', description: 'Construit autour des recherches d’itinéraires' },
          { label: 'Marché', value: 'Voyage', description: 'Préparation de voyages internationaux' },
          { label: 'Propriétaire', value: 'Studio', description: 'Conçu et géré par WeReact' },
        ],
      },
    },
  },
];

export function getCaseStudy(id: string) {
  return caseStudies.find((study) => study.id === id);
}
