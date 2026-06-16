import Link from 'next/link';
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import { siteConfig } from '@/config/site';

const contactInfo = [
  { icon: MessageCircle, label: 'WhatsApp', value: siteConfig.business.phoneDisplay, href: siteConfig.business.whatsapp, external: true },
  { icon: Mail, label: 'Email', value: siteConfig.business.email, href: `mailto:${siteConfig.business.email}` },
  { icon: Phone, label: 'Phone', value: siteConfig.business.phoneDisplay, href: `tel:${siteConfig.business.phoneTel}` },
  { icon: MapPin, label: 'Location', value: siteConfig.business.addressDisplay, href: siteConfig.business.googleMapsUrl, external: true },
  { icon: Clock, label: 'Hours', value: siteConfig.business.hoursDisplay, href: siteConfig.business.googleMapsUrl, external: true },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[1fr_0.9fr]">
        <OpsPanel dark className="!bg-[var(--color-primary)] p-6 text-white md:p-10">
          <OpsBadge tone="dark">Deploy request</OpsBadge>
          <h1 className="mt-7 text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
            Tell us what your website needs to do.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/68">
            Share your business, current site, or launch idea. We will reply with a clear next step for strategy, design, build, or SEO foundations.
          </p>
          <Link
            href={siteConfig.business.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-[6px] bg-white px-7 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5"
          >
            Start on WhatsApp
            <ArrowUpRight size={16} />
          </Link>
        </OpsPanel>

        <OpsPanel className="p-6 md:p-8">
          <form className="grid gap-4">
            {[
              { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
              { id: 'company', label: 'Company', type: 'text', placeholder: 'Business or project name' },
            ].map((field) => (
              <label key={field.id} className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{field.label}</span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="min-h-12 rounded-[6px] border border-[var(--color-primary)]/16 bg-white px-4 text-sm font-bold text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:outline-none"
                />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Project brief</span>
              <textarea
                name="message"
                rows={6}
                placeholder="Tell us what you need: business website, redesign, tourism platform, SEO foundation..."
                className="rounded-[6px] border border-[var(--color-primary)]/16 bg-white px-4 py-3 text-sm font-bold text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>
            <button className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-7 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5">
              Send request
              <Send size={16} />
            </button>
          </form>
        </OpsPanel>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {contactInfo.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="group block h-full"
            >
              <OpsPanel className="h-full p-5">
                <item.icon size={22} />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{item.label}</p>
                <p className="mt-2 text-lg font-black leading-tight text-[var(--color-primary)]">{item.value}</p>
              </OpsPanel>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
