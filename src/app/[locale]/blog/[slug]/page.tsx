import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const guideCopy: Record<string, { title: string; image: string; paragraphs: string[] }> = {
  'marrakech-airport-transfer-guide': { title: 'The Marrakech airport transfer guide', image: '/images/luxury/airport.webp', paragraphs: ['Marrakech Menara Airport is the starting point for most city stays, Atlas escapes, and desert adventures. A private driver removes the waiting, negotiating, and uncertain first steps after a flight.', 'Share your flight number, accommodation, and passenger count before you travel. We monitor the flight, meet you at arrivals, and take you straight to your destination.'] },
  'marrakech-day-trips': { title: 'The best private day trips from Marrakech', image: '/images/luxury/paradise-valley.jpg', paragraphs: ['Marrakech is a generous starting point for the Atlas Mountains, the Agafay Desert, and the Atlantic coast. With a private vehicle, the schedule stays flexible when a view, a meal, or a market is worth a little more time.', 'Tell us what kind of day you want and we will help build the right route around it.'] },
  'private-driver-marrakech': { title: 'When to book a private driver in Marrakech', image: '/images/luxury/mercedes-e-class.webp', paragraphs: ['A private driver is a good fit when you need a calm, flexible day in a busy city or want to move between several places without managing each leg separately.', 'It works especially well for business visits, celebrations, shopping days, restaurants, and journeys that begin in Marrakech but do not end there.'] },
};

export default async function GuideDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const guide = guideCopy[slug] ?? guideCopy['marrakech-airport-transfer-guide'];
  return <div className="luxury-shell"><section className="luxury-page-hero"><div className="luxury-page-hero__media"><Image src={guide.image} alt={guide.title} fill priority sizes="100vw" /></div><div className="luxury-container"><span className="luxury-kicker">Marrakech guide</span><h1>{guide.title}</h1></div></section><section className="luxury-section"><article className="luxury-container luxury-split"><div className="luxury-split__copy">{guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link className="luxury-button" href={`/${locale}/book`}>Plan your journey <ArrowUpRight size={15} /></Link></div><div className="luxury-split__media"><Image src={guide.image} alt={guide.title} fill sizes="(max-width: 980px) 100vw, 50vw" /></div></article></section></div>;
}
