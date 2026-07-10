'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Clock3, ShieldCheck, Star, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { faqs, excursions, fleet, routes, testimonials } from './data';
import { siteConfig } from '@/config/site';

function BookingWidget({ locale }: { locale: string }) {
  const [tab, setTab] = useState<'transfers' | 'excursions'>('transfers');
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="luxury-booking" onSubmit={submit}>
      <div className="luxury-booking__tabs">
        <button type="button" className={`luxury-booking__tab ${tab === 'transfers' ? 'is-active' : ''}`} onClick={() => setTab('transfers')}>Transfers</button>
        <button type="button" className={`luxury-booking__tab ${tab === 'excursions' ? 'is-active' : ''}`} onClick={() => setTab('excursions')}>Excursions</button>
      </div>
      <div className="luxury-booking__mode">
        <label><input type="radio" name="booking-type" defaultChecked /> {tab === 'transfers' ? 'Fixed route' : 'Private experience'}</label>
        {tab === 'transfers' && <label><input type="radio" name="booking-type" /> Custom route</label>}
      </div>
      <div className="luxury-booking__grid">
        <div className="luxury-booking__field luxury-booking__field--wide">
          <label htmlFor="pickup">Pickup</label>
          <input id="pickup" name="pickup" placeholder="Airport, hotel, or address" required />
        </div>
        <div className="luxury-booking__field luxury-booking__field--wide">
          <label htmlFor="destination">Destination</label>
          <input id="destination" name="destination" placeholder="Where are you going?" required />
        </div>
        <div className="luxury-booking__field"><label htmlFor="date">Date</label><input id="date" name="date" type="date" required /></div>
        <div className="luxury-booking__field"><label htmlFor="passengers">Passengers</label><select id="passengers" name="passengers" defaultValue="2"><option>1 passenger</option><option>2 passengers</option><option>3 passengers</option><option>4 passengers</option><option>5+ passengers</option></select></div>
      </div>
      <button className="luxury-button luxury-booking__submit" type="submit">Look for {tab}</button>
      <p className="luxury-booking__status" aria-live="polite">{submitted ? `Thank you. We will confirm your ${tab} shortly.` : `Flight tracking included for airport pickups.`}</p>
      <input type="hidden" name="locale" value={locale} />
    </form>
  );
}

function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="luxury-faq">
      {faqs.map((item, index) => (
        <div className="luxury-faq__item" key={item.question}>
          <button className="luxury-faq__question" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
            <span>{item.question}</span><ChevronDown size={20} style={{ transform: open === index ? 'rotate(180deg)' : undefined }} />
          </button>
          {open === index && <div className="luxury-faq__answer">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}

export default function LuxuryHome({ locale }: { locale: string }) {
  return (
    <div className="luxury-shell">
      <section className="luxury-hero">
        <div className="luxury-hero__media"><Image src="/images/luxury/hero.webp" alt="Luxury vehicle on a Moroccan road" fill priority sizes="100vw" /></div>
        <div className="luxury-hero__content">
          <span className="luxury-kicker">Private journeys across Morocco</span>
          <h1 className="luxury-display">Premium private transfers in Agadir.</h1>
          <p className="luxury-hero__intro">From runway to riad, we make every mile feel considered. Reliable airport transfers, discreet chauffeurs, and tailored excursions with flight tracking included.</p>
          <div className="luxury-hero__links">
            <Link className="luxury-button" href={`/${locale}/book`}>Book your journey <ArrowUpRight size={15} /></Link>
            <a className="luxury-button luxury-button--outline" href={siteConfig.business.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
        <div className="luxury-hero__booking"><BookingWidget locale={locale} /></div>
      </section>

      <div className="luxury-container">
        <div className="luxury-stats">
          <div className="luxury-stat"><strong>5.0</strong><span>Google rating from 177 reviews</span></div>
          <div className="luxury-stat"><strong>24/7</strong><span>Flight tracking and support included</span></div>
          <div className="luxury-stat"><strong>6+</strong><span>Destinations from Agadir</span></div>
          <div className="luxury-stat"><strong>100%</strong><span>Private, door-to-door journeys</span></div>
        </div>
      </div>

      <section className="luxury-section">
        <div className="luxury-container">
          <div className="luxury-section-heading"><div><span className="luxury-kicker">Choose your journey</span><h2>Every arrival has its own rhythm.</h2></div><p>Tell us where you are starting and where you want to be. We will take care of the road between.</p></div>
          <div className="luxury-route-grid">
            {routes.slice(0, 3).map((route, index) => <Link className="luxury-card luxury-card--short" href={`/${locale}/transfers/${route.slug}`} key={route.slug}><div className="luxury-card__image"><Image src={route.image} alt={route.title} fill sizes="(max-width: 720px) 50vw, 33vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">0{index + 1} / Private transfer</span><h3>{route.short}</h3><p>{route.description}</p><div className="luxury-card__meta"><span>{route.distance}</span><span>From Agadir</span></div></div><ArrowDownRight className="luxury-card__arrow" size={18} /></Link>)}
          </div>
        </div>
      </section>

      <section className="luxury-section luxury-section--tight">
        <div className="luxury-container luxury-split">
          <div className="luxury-split__media"><Image src="/images/luxury/airport.webp" alt="Airport transfer arrival" fill sizes="(max-width: 980px) 100vw, 50vw" /></div>
          <div className="luxury-split__copy"><span className="luxury-kicker">Agadir airport transfers</span><h2>Your holiday starts at the arrivals gate.</h2><p>There is no need to think about the road after a flight. Your driver is watching your arrival, waiting with your name, and ready to take you directly to the coast, the city, or your next Moroccan destination.</p><ul className="luxury-list"><li>Meet and greet at Agadir Al Massira Airport</li><li>Complimentary flight monitoring for every pickup</li><li>Private vehicles selected around your group and luggage</li></ul><Link className="luxury-button" href={`/${locale}/transfers`}>Explore transfers <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <div className="luxury-marquee"><div className="luxury-marquee__track"><span>Agadir</span><span>Taghazout</span><span>Marrakech</span><span>Essaouira</span><span>Taroudant</span><span>Paradise Valley</span><span>Agadir</span><span>Taghazout</span><span>Marrakech</span><span>Essaouira</span><span>Taroudant</span><span>Paradise Valley</span></div></div>

      <section className="luxury-section">
        <div className="luxury-container">
          <div className="luxury-section-heading"><div><span className="luxury-kicker">Elite fleet</span><h2>Quiet cabins. Thoughtful details.</h2></div><p>Choose a vehicle that fits the occasion, from an executive sedan to a spacious private van.</p></div>
          <div className="luxury-card-grid">{fleet.map((item) => <Link className="luxury-card luxury-card--short" href={`/${locale}/fleet/${item.slug}`} key={item.slug}><div className="luxury-card__image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 720px) 50vw, 25vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="luxury-card__meta"><span>{item.capacity}</span><span>View vehicle</span></div></div></Link>)}</div>
          <div style={{ marginTop: 28 }}><Link className="luxury-button luxury-button--outline" href={`/${locale}/fleet`}>See the full fleet <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <div className="luxury-marquee"><div className="luxury-marquee__track"><span>Trusted by leading travel partners</span><span>Hotels</span><span>Riads</span><span>Concierges</span><span>Tour operators</span><span>Travel planners</span><span>Trusted by leading travel partners</span><span>Hotels</span><span>Riads</span><span>Concierges</span><span>Tour operators</span><span>Travel planners</span></div></div>

      <section className="luxury-section">
        <div className="luxury-container">
          <div className="luxury-section-heading"><div><span className="luxury-kicker">Curated experiences</span><h2>See more of Morocco, at your pace.</h2></div><p>Private excursions with space to stop, explore, and make the day your own.</p></div>
          <div className="luxury-card-grid">{excursions.slice(0, 3).map((item, index) => <Link className="luxury-card" href={`/${locale}/excursions/${item.slug}`} key={item.slug}><div className="luxury-card__image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 720px) 50vw, 33vw" /></div><div className="luxury-card__body"><span className="luxury-kicker">0{index + 1} / Private excursion</span><h3>{item.title}</h3><p>{item.description}</p><div className="luxury-card__meta"><span>{item.duration}</span><span>Discover</span></div></div><ArrowDownRight className="luxury-card__arrow" size={18} /></Link>)}</div>
          <div style={{ marginTop: 28 }}><Link className="luxury-button luxury-button--outline" href={`/${locale}/excursions`}>All experiences <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <section className="luxury-quote"><div className="luxury-container"><span className="luxury-kicker">A word from the CEO</span><blockquote>&ldquo;Luxury is not only the vehicle. It is the feeling that someone has thought of everything before you arrive.&rdquo;</blockquote><cite>Just Luxury Transfers / Agadir, Morocco</cite></div></section>

      <section className="luxury-section">
        <div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">Why choose us</span><h2>Service that makes the road disappear.</h2></div><p>Small details make a big difference when you are travelling far from home.</p></div><div className="luxury-feature-grid"><div className="luxury-feature"><span className="luxury-feature__number">01</span><h3>Always on time</h3><p>We plan around your flight and keep an eye on the details that can change a travel day.</p></div><div className="luxury-feature"><span className="luxury-feature__number">02</span><h3>Local expertise</h3><p>Our drivers know the coast, the cities, and the quiet routes that make Morocco memorable.</p></div><div className="luxury-feature"><span className="luxury-feature__number">03</span><h3>Private by design</h3><p>No shared shuttles, no rushed stops. Your vehicle and your time are yours.</p></div><div className="luxury-feature"><span className="luxury-feature__number">04</span><h3>Clear communication</h3><p>From the first WhatsApp message to the final drop-off, you know who is looking after your journey.</p></div><div className="luxury-feature"><span className="luxury-feature__number">05</span><h3>Comfort first</h3><p>Clean vehicles, generous space, and a calm ride are part of every booking.</p></div><div className="luxury-feature"><span className="luxury-feature__number">06</span><h3>Travel partners</h3><p>Hotels, riads, and planners trust us to make their guests feel looked after.</p></div></div></div>
      </section>

      <section className="luxury-section luxury-section--tight"><div className="luxury-container luxury-split"><div className="luxury-split__copy"><span className="luxury-kicker">Frequently asked questions</span><h2>Good to know before you go.</h2><p>We keep the booking process simple, personal, and clear.</p><Link className="luxury-button luxury-button--outline" href={`/${locale}/contact`}>Ask us anything <ArrowUpRight size={15} /></Link></div><FaqList /></div></section>

      <section className="luxury-section luxury-section--tight"><div className="luxury-container"><div className="luxury-section-heading"><div><span className="luxury-kicker">What our clients say</span><h2>Arrivals worth remembering.</h2></div><a className="luxury-button luxury-button--outline" href={siteConfig.business.googleReviews} target="_blank" rel="noreferrer"><Star size={14} /> Read all reviews</a></div><div className="luxury-card-grid">{testimonials.map((item) => <article className="luxury-card luxury-card--short" key={item.author}><div className="luxury-card__body"><div style={{ color: 'var(--luxury-amber)', letterSpacing: '.18em' }}>*****</div><h3>&ldquo;{item.quote}&rdquo;</h3><div className="luxury-card__meta"><span>{item.author}</span><span>{item.detail}</span></div></div></article>)}</div></div></section>

      <section className="luxury-section"><div className="luxury-container"><div className="luxury-split"><div className="luxury-split__media"><Image src="/images/luxury/excursions.avif" alt="Moroccan excursion" fill sizes="(max-width: 980px) 100vw, 50vw" /></div><div className="luxury-split__copy"><span className="luxury-kicker">Ready to arrive?</span><h2>Let the journey be part of the memory.</h2><p>Tell us your route, your timing, and what matters to you. We will come back with the right vehicle and a calm plan.</p><div className="luxury-hero__links"><Link className="luxury-button" href={`/${locale}/book`}>Book your journey <ArrowUpRight size={15} /></Link><a className="luxury-button luxury-button--outline" href={`tel:${siteConfig.business.phoneTel}`}><Clock3 size={15} /> Call us</a></div></div></div></div></section>
    </div>
  );
}

export { BookingWidget };
