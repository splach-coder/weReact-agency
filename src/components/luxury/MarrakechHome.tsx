import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Clock3, Star } from 'lucide-react';
import { BookingWidget } from './LuxuryHome';
import { fleet, faqs, testimonials } from './data';
import { siteConfig } from '@/config/site';

const journeys = [
  { title: 'Marrakech Menara Airport - Medina', distance: '20 min', image: '/images/luxury/airport.webp', copy: 'A calm airport welcome and a direct ride to your riad, hotel, or private address.' },
  { title: 'Marrakech - Ourika Valley', distance: '1 h 15', image: '/images/luxury/paradise-valley.jpg', copy: 'A private route into the Atlas foothills, paced around the day you want to have.' },
  { title: 'Marrakech - Agafay Desert', distance: '45 min', image: '/images/luxury/desert-safari.jpg', copy: 'A comfortable start to sunset dinners, desert camps, and wide-open evenings.' },
];

const experiences = [
  { title: 'Atlas Mountains and Ourika', duration: 'Full day', image: '/images/luxury/paradise-valley.jpg', copy: 'Mountain light, village lunches, and a day that moves at your pace.' },
  { title: 'Agafay Desert Escape', duration: 'Half day', image: '/images/luxury/desert-safari.jpg', copy: 'Private transport for desert dinners, rides, or simply a beautiful sunset.' },
  { title: 'Essaouira Coast', duration: 'Full day', image: '/images/luxury/essaouira-trip.jpg', copy: 'A slower Atlantic day, shaped around its light, food, and whitewashed lanes.' },
];

export default function MarrakechHome({ locale }: { locale: string }) {
  return (
    <div className="luxury-shell">
      <section className="luxury-hero">
        <div className="luxury-hero__media"><Image src="/images/luxury/hero.webp" alt="Luxury vehicle travelling through Morocco" fill priority sizes="100vw" /></div>
        <div className="luxury-hero__content">
          <span className="luxury-kicker">Based in Marrakech / Private journeys across Morocco</span>
          <h1 className="luxury-display">Marrakech private transfers, beautifully handled.</h1>
          <p className="luxury-hero__intro">From Marrakech Menara Airport to the Atlas, Agafay, Essaouira, and beyond, we make each mile feel composed, private, and completely yours.</p>
          <div className="luxury-hero__links">
            <Link className="luxury-button" href={`/${locale}/book`}>Book your journey <ArrowUpRight size={15} /></Link>
            <a className="luxury-button luxury-button--outline" href={siteConfig.business.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
        <div className="luxury-hero__booking"><BookingWidget locale={locale} /></div>
      </section>

      <div className="luxury-container"><div className="luxury-stats"><div className="luxury-stat"><strong>5.0</strong><span>Google rating from 177 reviews</span></div><div className="luxury-stat"><strong>24/7</strong><span>Flight tracking and support included</span></div><div className="luxury-stat"><strong>Marrakech</strong><span>Our base for journeys across Morocco</span></div><div className="luxury-stat"><strong>100%</strong><span>Private, door-to-door service</span></div></div></div>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">Choose your journey</span><h2>From Marrakech, the country opens up.</h2></div><p>Airport arrivals, private day trips, and point-to-point routes designed around your timing, not a shared schedule.</p></div><div className="luxury-route-grid">{journeys.map((journey, index) => <Link className="luxury-card luxury-card--short" href={`/${locale}/book`} key={journey.title}><div className="luxury-card__image"><Image src={journey.image} alt={journey.title} fill sizes="(max-width: 720px) 50vw, 33vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">0{index + 1} / Private transfer</span><h3>{journey.title}</h3><p>{journey.copy}</p><div className="luxury-card__meta"><span>{journey.distance}</span><span>From Marrakech</span></div></div><ArrowDownRight className="luxury-card__arrow" size={18} /></Link>)}</div></div></section>

      <section className="luxury-section luxury-section--tight"><div className="luxury-container luxury-split"><div className="luxury-split__media"><Image src="/images/luxury/airport.webp" alt="Marrakech airport arrival" fill sizes="(max-width: 980px) 100vw, 50vw" /></div><div className="luxury-split__copy"><span className="luxury-kicker">Marrakech Menara Airport</span><h2>Your Marrakech stay starts at arrivals.</h2><p>Land, collect your luggage, and walk into a journey already organised. Your driver follows your flight, meets you at the airport, and takes you directly to your riad, hotel, villa, or onward destination.</p><ul className="luxury-list"><li>Private meet and greet at Marrakech Menara Airport</li><li>Flight monitoring for every airport pickup</li><li>Vehicles selected around your group and luggage</li></ul><Link className="luxury-button" href={`/${locale}/transfers`}>Explore transfers <ArrowUpRight size={15} /></Link></div></div></section>

      <div className="luxury-marquee"><div className="luxury-marquee__track"><span>Marrakech</span><span>Ourika Valley</span><span>Agafay Desert</span><span>Essaouira</span><span>Atlas Mountains</span><span>Casablanca</span><span>Marrakech</span><span>Ourika Valley</span><span>Agafay Desert</span><span>Essaouira</span><span>Atlas Mountains</span><span>Casablanca</span></div></div>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">Elite fleet</span><h2>Quiet cabins for Marrakech, and every road after.</h2></div><p>From an airport welcome to a long-distance drive, choose the space and comfort your day deserves.</p></div><div className="luxury-card-grid">{fleet.map((item) => <Link className="luxury-card luxury-card--short" href={`/${locale}/fleet/${item.slug}`} key={item.slug}><div className="luxury-card__image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 720px) 50vw, 25vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="luxury-card__meta"><span>{item.capacity}</span><span>View vehicle</span></div></div></Link>)}</div></div></section>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">Curated experiences</span><h2>Use Marrakech as your starting point.</h2></div><p>Private excursions that give you time for the road, the scenery, and the moments you did not plan for.</p></div><div className="luxury-card-grid">{experiences.map((experience, index) => <Link className="luxury-card" href={`/${locale}/excursions`} key={experience.title}><div className="luxury-card__image"><Image src={experience.image} alt={experience.title} fill sizes="(max-width: 720px) 50vw, 33vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">0{index + 1} / Private excursion</span><h3>{experience.title}</h3><p>{experience.copy}</p><div className="luxury-card__meta"><span>{experience.duration}</span><span>Discover</span></div></div><ArrowDownRight className="luxury-card__arrow" size={18} /></Link>)}</div></div></section>

      <section className="luxury-quote"><div className="luxury-container"><span className="luxury-kicker">A word from the team</span><blockquote>&ldquo;A great transfer does not rush the story. It gives every journey the room to begin well.&rdquo;</blockquote><cite>Just Luxury Transfers / Marrakech, Morocco</cite></div></section>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">Why choose us</span><h2>From Marrakech, with the details handled.</h2></div><p>Small decisions make travel feel effortless: a driver who is ready, a vehicle that fits, and clear communication throughout.</p></div><div className="luxury-feature-grid"><div className="luxury-feature"><span className="luxury-feature__number">01</span><h3>Airport ready</h3><p>We follow your flight and make the first step in Marrakech feel easy.</p></div><div className="luxury-feature"><span className="luxury-feature__number">02</span><h3>Local routes</h3><p>Our drivers know the city, the Atlas roads, and the better way between places.</p></div><div className="luxury-feature"><span className="luxury-feature__number">03</span><h3>Private by design</h3><p>Your vehicle, your group, and a schedule that remains yours.</p></div><div className="luxury-feature"><span className="luxury-feature__number">04</span><h3>Clear communication</h3><p>One attentive team from the first message to the final drop-off.</p></div><div className="luxury-feature"><span className="luxury-feature__number">05</span><h3>Comfort first</h3><p>Clean vehicles, generous room, and a calm way to travel.</p></div><div className="luxury-feature"><span className="luxury-feature__number">06</span><h3>Built for Marrakech</h3><p>From Menara Airport to the medina, we begin exactly where you arrive.</p></div></div></div></section>

      <section className="luxury-section luxury-section--tight"><div className="luxury-container luxury-split"><div className="luxury-split__copy"><span className="luxury-kicker">Frequently asked questions</span><h2>Good to know before you arrive.</h2><p>From flight tracking to child seats, we keep the important parts simple.</p><Link className="luxury-button luxury-button--outline" href={`/${locale}/contact`}>Ask us anything <ArrowUpRight size={15} /></Link></div><div className="luxury-faq">{faqs.map((faq, index) => <details className="luxury-faq__item" key={faq.question} open={index === 0}><summary className="luxury-faq__question"><span>{faq.question}</span><span>+</span></summary><div className="luxury-faq__answer">{faq.answer}</div></details>)}</div></div></section>

      <section className="luxury-section luxury-section--tight"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">What our clients say</span><h2>Arrivals worth remembering.</h2></div><a className="luxury-button luxury-button--outline" href={siteConfig.business.googleReviews} target="_blank" rel="noreferrer"><Star size={14} /> Read all reviews</a></div><div className="luxury-card-grid">{testimonials.map((item) => <article className="luxury-card luxury-card--short" key={item.author}><div className="luxury-card__body"><div style={{ color: 'var(--luxury-amber)', letterSpacing: '.18em' }}>*****</div><h3>&ldquo;{item.quote.replace('Agadir to Marrakech', 'Marrakech to the Atlas')}&rdquo;</h3><div className="luxury-card__meta"><span>{item.author}</span><span>{item.detail}</span></div></div></article>)}</div></div></section>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-split"><div className="luxury-split__media"><Image src="/images/luxury/excursions.avif" alt="Moroccan private excursion" fill sizes="(max-width: 980px) 100vw, 50vw" /></div><div className="luxury-split__copy"><span className="luxury-kicker">Ready to arrive?</span><h2>Start from Marrakech. Go wherever the day takes you.</h2><p>Share your route, your timing, and what matters most. We will come back with the right vehicle and a plan that feels easy from the first kilometre.</p><div className="luxury-hero__links"><Link className="luxury-button" href={`/${locale}/book`}>Book your journey <ArrowUpRight size={15} /></Link><a className="luxury-button luxury-button--outline" href={`tel:${siteConfig.business.phoneTel}`}><Clock3 size={15} /> Call us</a></div></div></div></div></section>
    </div>
  );
}
