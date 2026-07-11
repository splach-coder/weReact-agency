'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle, Mail, MapPin, MessageCircle, Paperclip, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { smoothEasing } from '@/lib/animations';
import { formatAttributionForEmail, trackContactIntent, trackLead } from '@/lib/analytics';

const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: smoothEasing } },
};
const maskUp = {
  hidden: { y: '112%' },
  visible: { y: '0%', transition: { duration: 0.92, ease: smoothEasing } },
};

export default function ContactPage() {
  const t = useTranslations('Contact');
  const sceneRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });

  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New project enquiry - ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Company: ${formData.company || '-'}\n\n` +
        `${formData.message}` +
        formatAttributionForEmail()
    );

    await trackLead('contact_form', {
      page: 'contact',
      has_company: Boolean(formData.company),
      has_message: Boolean(formData.message),
    });
    setSubmitted(true);
    window.location.href = `mailto:${siteConfig.business.email}?subject=${subject}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('labelEmail'),
      value: siteConfig.business.email,
      href: `mailto:${siteConfig.business.email}`,
      method: 'email',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: siteConfig.business.phoneDisplay,
      href: siteConfig.business.whatsapp,
      method: 'whatsapp',
    },
    {
      icon: MapPin,
      label: t('labelLocation'),
      value: siteConfig.business.addressDisplay,
      href: siteConfig.business.googleMapsUrl,
      method: 'maps',
    },
  ];

  const fieldClass =
    'w-full border-0 border-b border-[rgba(26,26,26,0.16)] bg-transparent px-0 py-3 text-[15px] text-[var(--color-text-main)] outline-none transition-colors placeholder:text-[rgba(26,26,26,0.34)] focus:border-[var(--color-primary)]';
  const labelClass = 'sr-only';

  return (
    <main className="bg-[var(--color-background-main)] text-[var(--color-text-main)]">
      <section
        ref={sceneRef}
        data-scene="contact"
        className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--color-background-main)]"
      >
        <motion.div
          data-depth="0"
          aria-hidden="true"
          style={reduceMotion ? undefined : { y: backgroundY }}
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_24%_18%,rgba(163,177,138,0.32),transparent_28%),linear-gradient(135deg,#F6F6F2_0%,#F6F6F2_48%,#FFFFFF_48.1%,#FFFFFF_100%)]"
        />

        <div className="grid min-h-[100svh] w-full bg-[var(--color-background-main)] lg:grid-cols-2">
          <motion.div
            data-depth="3"
            style={reduceMotion ? undefined : { y: visualY }}
            className="relative min-h-[520px] overflow-hidden bg-[var(--color-primary)] lg:min-h-[100svh]"
          >
            <motion.div
              data-depth="0"
              aria-hidden="true"
              style={reduceMotion ? undefined : { y: photoY }}
              className="absolute inset-0 scale-[1.08]"
            >
              <Image
                src="/images/menu/menu-contact.webp"
                alt="Studio table prepared for a client conversation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <div aria-hidden="true" className="absolute inset-0 bg-[rgba(58,90,64,0.22)] mix-blend-multiply" />
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_26%_14%,rgba(246,246,242,0.72),transparent_28%),linear-gradient(180deg,rgba(58,90,64,0.05),rgba(58,90,64,0.35))]" />

            <motion.div
              variants={wrap}
              initial="hidden"
              animate="visible"
              data-depth="4"
              className="relative z-10 flex min-h-[520px] flex-col justify-between px-6 pb-7 pt-24 sm:px-8 lg:min-h-[100svh] lg:px-14 lg:pb-12 lg:pt-28 xl:px-16"
            >
              <span aria-hidden="true" />

              <div className="relative py-10 lg:py-0">
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.h1
                    variants={maskUp}
                    className="relative z-20 text-[clamp(2.65rem,6.3vw,6.4rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_24px_rgba(26,26,26,0.22)]"
                  >
                    Don&apos;t be shy
                  </motion.h1>
                </span>


                <span className="mt-2 block overflow-hidden pb-[0.08em] sm:ml-[28%]">
                  <motion.p
                    variants={maskUp}
                    className="relative z-20 text-[clamp(2.65rem,6.3vw,6.4rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_24px_rgba(26,26,26,0.24)]"
                  >
                    Say hi
                  </motion.p>
                </span>
              </div>

              <motion.div variants={fade} className="flex flex-wrap items-end justify-between gap-4 text-white/90">
                <span className="text-mono">Marrakech / Online</span>
                <span className="max-w-[13rem] text-right text-sm leading-snug">
                  A focused start, then a clear path to launch.
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            data-depth="4"
            variants={wrap}
            initial="hidden"
            animate="visible"
            className="flex min-h-[620px] flex-col justify-center border-t border-[rgba(58,90,64,0.16)] bg-white px-6 py-12 sm:px-8 lg:min-h-[100svh] lg:border-l lg:border-t-0 lg:px-14 lg:py-28 xl:px-16"
          >
            <div>
              <motion.p variants={fade} className="max-w-md text-base font-semibold leading-snug text-[var(--color-text-main)] sm:text-lg">
                {t('subtitle')}
              </motion.p>

              <form onSubmit={handleSubmit} className="mt-9 space-y-3">
                <div>
                  <label htmlFor="name" className={labelClass}>{t('nameLabel')}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('namePlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>{t('emailLabel')}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('emailPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>{t('companyLabel')}</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('companyPlaceholder')}
                    className={fieldClass}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="message" className={labelClass}>{t('messageLabel')}</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('messagePlaceholder')}
                    className={`${fieldClass} resize-none pr-10`}
                  />
                  <Paperclip
                    size={17}
                    className="pointer-events-none absolute right-1 top-4 text-[rgba(26,26,26,0.42)]"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    className="group flex h-12 min-w-[132px] items-center justify-center rounded-[999px] border border-[rgba(26,26,26,0.35)] px-8 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    {t('send')}
                    <Send size={14} className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>

                {submitted && (
                  <p role="status" className="flex items-start gap-2 text-sm font-medium leading-relaxed text-[var(--color-primary)]">
                    <CheckCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {t('sent')}
                  </p>
                )}
              </form>
            </div>

            <motion.div variants={fade} className="mt-10 flex flex-col gap-5 border-t border-[rgba(26,26,26,0.12)] pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex gap-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={`${item.label}: ${item.value}`}
                    onClick={() => item.method !== 'maps' && trackContactIntent('contact_info_' + item.method, { method: item.method, page: 'contact', location: 'contact_info' })}
                    className="flex h-9 w-9 items-center justify-center border border-[rgba(26,26,26,0.16)] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <item.icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
              <p className="text-mono max-w-[18rem] text-left text-[10px] leading-relaxed text-[var(--color-text-muted)] sm:text-right">
                No pressure. One clear project note is enough to start.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
