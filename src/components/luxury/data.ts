export type LuxuryLocale = 'en' | 'fr' | 'es' | 'it' | 'de';

export const navItems = [
  { label: 'Home', path: '' },
  { label: 'Transfers', path: '/transfers' },
  { label: 'Fleet', path: '/fleet' },
  { label: 'Excursions', path: '/excursions' },
  { label: 'Guides', path: '/blog' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const routes = [
  { slug: 'agadir-airport-to-tagahzout', title: 'Agadir Airport to Taghazout', short: 'Agadir Airport - Taghazout', distance: '45 min', image: '/images/luxury/airport.webp', description: 'A calm arrival along the Atlantic coast, with flight tracking and a private meet-and-greet.' },
  { slug: 'agadir-airport-to-agadir', title: 'Agadir Airport to Agadir', short: 'Agadir Airport - Agadir', distance: '30 min', image: '/images/luxury/hero.webp', description: 'Door-to-door service from the runway to your hotel, riad, or private residence in Agadir.' },
  { slug: 'agadir-to-marrakech', title: 'Agadir to Marrakech', short: 'Agadir - Marrakech', distance: '3 h', image: '/images/luxury/marrakech-trip.jpg', description: 'A comfortable private journey across the Atlas foothills with room for your luggage and plans.' },
  { slug: 'agadir-to-essaouira', title: 'Agadir to Essaouira', short: 'Agadir - Essaouira', distance: '3 h', image: '/images/luxury/essaouira-trip.jpg', description: 'Travel the coast in comfort, with flexible departure times and a driver who knows the route.' },
  { slug: 'agadir-to-taroudant', title: 'Agadir to Taroudant', short: 'Agadir - Taroudant', distance: '1 h 15', image: '/images/luxury/taroudant-trip.jpg', description: 'Private transport to the red-walled city, tailored around your hotel and itinerary.' },
  { slug: 'agadir-to-paradise-valley', title: 'Agadir to Paradise Valley', short: 'Agadir - Paradise Valley', distance: '1 h', image: '/images/luxury/paradise-valley.jpg', description: 'A scenic transfer into the foothills, perfect for a day trip or a longer private itinerary.' },
];

export const fleet = [
  { slug: 'mercedes-e-class', name: 'Mercedes E-Class', category: 'Executive sedan', capacity: '3 passengers', image: '/images/luxury/mercedes-e-class.webp', description: 'Quiet, refined, and made for business travel or a polished airport arrival.' },
  { slug: 'mercedes-vito', name: 'Mercedes Vito', category: 'Premium van', capacity: '7 passengers', image: '/images/luxury/mercedes-vito.webp', description: 'Spacious comfort for families, groups, and luggage-heavy journeys.' },
  { slug: 'skoda-superb', name: 'Skoda Superb', category: 'Business sedan', capacity: '3 passengers', image: '/images/luxury/skoda-superb.webp', description: 'A discreet, generous cabin for long-distance Morocco transfers.' },
  { slug: 'toyota-land-cruiser', name: 'Toyota Land Cruiser', category: 'Luxury 4x4', capacity: '4 passengers', image: '/images/luxury/land-cruiser.webp', description: 'Confident comfort for mountain roads, desert routes, and private excursions.' },
];

export const excursions = [
  { slug: 'paradise-valley', title: 'Paradise Valley', duration: 'Full day', image: '/images/luxury/paradise-valley.jpg', description: 'Palm-lined pools, mountain air, and a beautiful escape from the coast.' },
  { slug: 'desert-safari', title: 'Desert Safari', duration: 'Full day', image: '/images/luxury/desert-safari.jpg', description: 'A private day of dunes, wide skies, and the quieter side of Morocco.' },
  { slug: 'marrakech-day-trip', title: 'Marrakech Day Trip', duration: 'Full day', image: '/images/luxury/marrakech-trip.jpg', description: 'Discover the red city with a private vehicle and a schedule that suits you.' },
  { slug: 'essaouira-coast', title: 'Essaouira Coast', duration: 'Full day', image: '/images/luxury/essaouira-trip.jpg', description: 'Atlantic light, whitewashed streets, and a relaxed private coastal journey.' },
  { slug: 'taroudant-discovery', title: 'Taroudant Discovery', duration: 'Half day', image: '/images/luxury/taroudant-trip.jpg', description: 'A slower, more local look at the Souss Valley and its historic market town.' },
  { slug: 'quad-bike-adventure', title: 'Quad Bike Adventure', duration: 'Half day', image: '/images/luxury/quad-bike.jpg', description: 'An active coastal adventure with private transport from your accommodation.' },
];

export const faqs = [
  { question: 'How do I book a transfer?', answer: 'Use the booking form, send us a WhatsApp message, or email the team. We confirm your route, vehicle, and pickup details personally.' },
  { question: 'Do you track my flight?', answer: 'Yes. Flight tracking is included for airport pickups, so we can adjust for delays and be ready when you arrive.' },
  { question: 'Can I book a child seat?', answer: 'Yes. Tell us the ages of the children when you book and we will prepare the right seating for your journey.' },
  { question: 'Can I book a return transfer?', answer: 'Of course. Choose round trip in the booking form or include both directions in your message.' },
  { question: 'Do you accept hotel and riad pickups?', answer: 'Yes. We collect guests from hotels, riads, villas, residences, and meeting points across the destinations we serve.' },
];

export const testimonials = [
  { quote: 'The driver was early, discreet, and exceptionally kind. The whole airport arrival felt effortless.', author: 'Sophie M.', detail: 'Google review' },
  { quote: 'A beautifully maintained car and a very smooth drive from Agadir to Marrakech. We will book again.', author: 'Luca R.', detail: 'Google review' },
  { quote: 'Professional from the first WhatsApp message to the hotel door. Exactly the service we hoped for.', author: 'Elena P.', detail: 'Google review' },
];

export function getRoute(slug: string) { return routes.find((item) => item.slug === slug); }
export function getFleetItem(slug: string) { return fleet.find((item) => item.slug === slug); }
export function getExcursion(slug: string) { return excursions.find((item) => item.slug === slug); }
