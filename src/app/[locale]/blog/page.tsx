import Image from 'next/image';
import Link from 'next/link';

const guides = [
  { slug: 'marrakech-airport-transfer-guide', title: 'The Marrakech airport transfer guide', image: '/images/luxury/airport.webp', copy: 'How a private airport welcome keeps the first hour of your Marrakech stay easy.' },
  { slug: 'marrakech-day-trips', title: 'The best private day trips from Marrakech', image: '/images/luxury/paradise-valley.jpg', copy: 'Atlas valleys, Agafay desert, and the Atlantic coast, each at your own pace.' },
  { slug: 'private-driver-marrakech', title: 'When to book a private driver in Marrakech', image: '/images/luxury/mercedes-e-class.webp', copy: 'A flexible way to keep a busy city day, special occasion, or road trip feeling relaxed.' },
];

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <div className="luxury-shell"><section className="luxury-page-hero"><div className="luxury-page-hero__media"><Image src="/images/luxury/marrakech-trip.jpg" alt="Marrakech travel guide" fill priority sizes="100vw" /></div><div className="luxury-container"><span className="luxury-kicker">Marrakech guides</span><h1>Useful notes for better journeys.</h1></div></section><section className="luxury-section"><div className="luxury-container"><div className="luxury-card-grid">{guides.map((guide) => <Link className="luxury-card" href={`/${locale}/blog/${guide.slug}`} key={guide.slug}><div className="luxury-card__image"><Image src={guide.image} alt={guide.title} fill sizes="(max-width: 720px) 50vw, 33vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">Travel guide</span><h3>{guide.title}</h3><p>{guide.copy}</p></div></Link>)}</div></div></section></div>;
}
