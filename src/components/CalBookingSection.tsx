import Image from 'next/image';
import { Clock, Globe, Video } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CalInline } from '@/components/CalEmbed';

type CalBookingSectionProps = {
  source: string;
  locale: string;
  heading?: string;
};

/**
 * "Let's talk" block: what the 30-minute call covers on the left, the inline
 * Cal.com calendar on the right. Server component — only the calendar hydrates.
 */
export function CalBookingSection({ source, locale, heading }: CalBookingSectionProps) {
  const isFr = locale === 'fr';

  if (!siteConfig.business.calLink) return null;

  const details = [
    { icon: Clock, label: isFr ? '30 min' : '30m' },
    { icon: Video, label: 'Google Meet' },
    { icon: Globe, label: isFr ? 'Français ou anglais' : 'French or English' },
  ];
  const agenda = isFr
    ? ['Présenter notre approche', 'Clarifier vos besoins et contraintes', 'Partager des projets pertinents et définir la prochaine étape']
    : ['Introduce our approach', 'Clarify your project’s needs and challenges', 'Share relevant work and define the next step'];

  return (
    <section className="border-t border-[rgba(58,90,64,0.16)] px-6 py-20 md:px-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.96] text-[var(--color-text-main)]">
          {heading ?? (isFr ? 'Parlons-en !' : 'Let’s talk!')}
        </h2>
        <div className="mt-12 overflow-hidden border border-[rgba(58,90,64,0.18)] bg-white lg:grid lg:grid-cols-[minmax(260px,0.32fr)_0.68fr]">
          <div className="border-b border-[rgba(58,90,64,0.16)] p-7 md:p-9 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <Image
                src="/wereact-avatar.png"
                alt=""
                width={36}
                height={36}
                className="rounded-full border border-[rgba(58,90,64,0.18)]"
              />
              <span className="text-mono text-[var(--color-primary)]">{siteConfig.shortName}</span>
            </div>
            <h3 className="mt-6 text-2xl font-bold leading-tight text-[var(--color-text-main)]">
              {isFr ? 'Appel de 30 minutes' : '30 Min Meeting'}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {isFr
                ? 'Un appel court pour évaluer vos objectifs et vérifier que nous sommes le bon partenaire.'
                : 'A short call to assess your goals and determine whether we are the right fit.'}
            </p>
            <p className="mt-5 text-sm font-semibold text-[var(--color-text-main)]">{isFr ? 'Au programme :' : 'We will:'}</p>
            <ul className="mt-2 space-y-2">
              {agenda.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  <span aria-hidden="true" className="text-[var(--color-accent-sage)]">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-8 space-y-3 border-t border-[rgba(58,90,64,0.16)] pt-6">
              {details.map((detail) => (
                <li key={detail.label} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <detail.icon size={15} aria-hidden="true" className="shrink-0 text-[var(--color-primary)]" />
                  {detail.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-2 md:p-4">
            <CalInline source={source} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
