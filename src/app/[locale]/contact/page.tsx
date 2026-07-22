'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle, Mail, MapPin, Phone, Send, X } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/SocialIcons';
import { siteConfig } from '@/config/site';
import { smoothEasing } from '@/lib/animations';
import { createLeadTransactionId, getStoredAttribution, trackContactIntent, trackLead, trackWhatsAppLead } from '@/lib/analytics';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  TIMELINES,
  getContactFieldErrors,
  isRequiredContactField,
  type BudgetRange,
  type ContactField,
  type ContactFieldErrors,
  type ProjectTimeline,
  type ProjectType,
} from '@/lib/contact';
import { getAllowedSourcePage } from '@/lib/leads';

const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: smoothEasing } },
};
const maskUp = {
  hidden: { y: '112%' },
  visible: { y: '0%', transition: { duration: 0.92, ease: smoothEasing } },
};

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  projectType: ProjectType | '';
  budget: BudgetRange | '';
  timeline: ProjectTimeline | '';
  message: string;
  website: string;
};

const EMPTY_CONTACT_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  website: '',
};

export default function ContactPage() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const whatsappHref = buildWhatsAppLink(locale, locale === 'fr' ? 'Page contact' : 'Contact page');
  const sceneRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [submittedWithWhatsApp, setSubmittedWithWhatsApp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_CONTACT_FORM);

  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = getContactFieldErrors(formData, locale);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFormError(t('reviewFields'));
      return;
    }

    setSubmitting(true);
    setFormError('');
    setFieldErrors({});

    // One id per lead: dedupes the Ads conversion and is stored with the
    // lead so offline conversion uploads can match it later.
    const transactionId = createLeadTransactionId();

    try {
      const sourcePage = getAllowedSourcePage(new URLSearchParams(window.location.search).get('from'));
      const storedAttribution = getStoredAttribution() ?? {};
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
          attribution: {
            ...storedAttribution,
            ...(sourcePage ? { source_page: sourcePage } : {}),
            transaction_id: transactionId,
          },
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || t('sendFailed'));

      await trackLead(
        'contact_form',
        {
          page: 'contact',
          has_company: Boolean(formData.company),
          has_phone: Boolean(formData.phone),
          has_whatsapp: Boolean(formData.whatsapp),
          has_message: Boolean(formData.message),
          project_type: formData.projectType || undefined,
          budget_range: formData.budget || undefined,
          timeline: formData.timeline || undefined,
        },
        { email: formData.email, phone: formData.whatsapp || formData.phone },
        transactionId
      );
      setSubmittedWithWhatsApp(Boolean(formData.whatsapp.trim()));
      setSubmitted(true);
      setFormData(EMPTY_CONTACT_FORM);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : t('sendFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as ContactField;
    setFormData((current) => ({ ...current, [field]: e.target.value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (formError) setFormError('');
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
      icon: Phone,
      label: t('labelPhone'),
      value: siteConfig.business.phoneDisplay,
      href: `tel:${siteConfig.business.phoneTel.replace(/[^\d+]/g, '')}`,
      method: 'phone',
    },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: siteConfig.business.phoneDisplay,
      href: whatsappHref,
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

  const handleContactInfoClick = (method: string) => {
    if (method === 'whatsapp') {
      trackWhatsAppLead('contact_info_whatsapp', { page: 'contact', location: 'contact_info' });
    } else if (method !== 'maps') {
      trackContactIntent('contact_info_' + method, { method, page: 'contact', location: 'contact_info' });
    }
  };

  const fieldClass = (field: ContactField) =>
    `w-full border-0 border-b bg-transparent px-0 py-3 text-[15px] text-[var(--color-text-main)] outline-none transition-colors placeholder:text-[rgba(26,26,26,0.34)] focus:border-[var(--color-primary)] ${fieldErrors[field] ? 'border-[#a94442]' : 'border-[rgba(26,26,26,0.16)]'}`;
  const labelClass = 'mb-1.5 block text-mono text-[10px] uppercase text-[var(--color-text-muted)]';
  const renderFieldStatus = (field: ContactField) => isRequiredContactField(field) ? (
    <>
      <span aria-hidden="true" className="ml-1 text-[12px] font-black text-[var(--color-primary)]">*</span>
      <span className="sr-only"> required</span>
    </>
  ) : (
    <span className="ml-1.5 text-[8px] font-normal tracking-[0.08em] text-[rgba(26,26,26,0.42)]">({t('optional')})</span>
  );

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
          {/* Mobile: keep the visual panel compact so the form is reachable
              within the first screen for paid clicks. */}
          <motion.div
            data-depth="3"
            style={reduceMotion ? undefined : { y: visualY }}
            className="relative z-0 min-h-[46svh] overflow-hidden bg-[var(--color-primary)] lg:min-h-[100svh]"
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
              className="relative z-10 flex min-h-[46svh] flex-col justify-between px-6 pb-6 pt-20 sm:px-8 lg:min-h-[100svh] lg:px-14 lg:pb-12 lg:pt-28 xl:px-16"
            >
              <span aria-hidden="true" />

              <div className="relative py-6 lg:py-0">
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.h1
                    variants={maskUp}
                    className="relative z-20 text-[clamp(2.4rem,6.3vw,6.4rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_24px_rgba(26,26,26,0.22)]"
                  >
                    {t('heroLine1')}
                  </motion.h1>
                </span>


                <span className="mt-2 block overflow-hidden pb-[0.08em] sm:ml-[28%]">
                  <motion.p
                    variants={maskUp}
                    className="relative z-20 text-[clamp(2.4rem,6.3vw,6.4rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_24px_rgba(26,26,26,0.24)]"
                  >
                    {t('heroLine2')}
                  </motion.p>
                </span>
              </div>

              <motion.div variants={fade} className="hidden flex-wrap items-end justify-between gap-4 text-white/90 lg:flex">
                <span className="text-mono">{t('heroLocation')}</span>
                <span className="max-w-[13rem] text-right text-sm leading-snug">
                  {t('heroTagline')}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* No mount animation on the form column: paid clicks must see a
              usable form immediately, even before hydration finishes. */}
          <motion.div
            data-depth="4"
            variants={wrap}
            initial={false}
            animate="visible"
            className="relative z-10 flex min-h-[620px] flex-col justify-center border-t border-[rgba(58,90,64,0.16)] bg-white px-6 py-10 sm:px-8 lg:min-h-[100svh] lg:border-l lg:border-t-0 lg:px-14 lg:py-28 xl:px-16"
          >
            <div>
              <motion.p variants={fade} className="max-w-md text-base font-semibold leading-snug text-[var(--color-text-main)] sm:text-lg">
                {t('subtitle')}
              </motion.p>

              {/* WhatsApp-first CTA: the dominant contact channel in Morocco
                  deserves more than a small icon below the fold. */}
              <motion.div variants={fade} className="mt-6">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppLead('contact_primary_whatsapp', { page: 'contact', location: 'above_form' })}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-[#25D366] bg-[#25D366]/10 px-6 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-primary-dark)] transition-colors hover:bg-[#25D366]/20 sm:w-auto"
                >
                  <WhatsAppIcon size={16} aria-hidden="true" className="text-[#128C7E]" />
                  {t('whatsappCta')}
                </a>
                <p className="mt-4 text-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  {t('orSendNote')}
                </p>
              </motion.div>

              <form noValidate onSubmit={handleSubmit} className="mt-7">
                <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>{t('nameLabel')}{renderFieldStatus('name')}</label>
                    <input id="name" name="name" type="text" required aria-required="true" autoComplete="name" value={formData.name} onChange={handleChange} placeholder={t('namePlaceholder')} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'name-error' : undefined} className={fieldClass('name')} />
                    {fieldErrors.name && <p id="name-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>{t('emailLabel')}{renderFieldStatus('email')}</label>
                    <input id="email" name="email" type="email" required aria-required="true" autoComplete="email" value={formData.email} onChange={handleChange} placeholder={t('emailPlaceholder')} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'email-error' : undefined} className={fieldClass('email')} />
                    {fieldErrors.email && <p id="email-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>{t('phoneLabel')}{renderFieldStatus('phone')}</label>
                    <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} placeholder="+212 600 000 000" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'phone-error' : undefined} className={fieldClass('phone')} />
                    {fieldErrors.phone && <p id="phone-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className={labelClass}>{t('whatsappLabel')}{renderFieldStatus('whatsapp')}</label>
                    <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" value={formData.whatsapp} onChange={handleChange} placeholder="+212 611 000 000" aria-invalid={Boolean(fieldErrors.whatsapp)} aria-describedby={fieldErrors.whatsapp ? 'whatsapp-error' : undefined} className={fieldClass('whatsapp')} />
                    {fieldErrors.whatsapp && <p id="whatsapp-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.whatsapp}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className={labelClass}>{t('companyLabel')}{renderFieldStatus('company')}</label>
                    <input id="company" name="company" type="text" autoComplete="organization" value={formData.company} onChange={handleChange} placeholder={t('companyPlaceholder')} aria-invalid={Boolean(fieldErrors.company)} aria-describedby={fieldErrors.company ? 'company-error' : undefined} className={fieldClass('company')} />
                    {fieldErrors.company && <p id="company-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.company}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="projectType" className={labelClass}>{t('projectTypeLabel')}{renderFieldStatus('projectType')}</label>
                    <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} aria-invalid={Boolean(fieldErrors.projectType)} aria-describedby={fieldErrors.projectType ? 'projectType-error' : undefined} className={fieldClass('projectType')}>
                      <option value="">{t('projectTypePlaceholder')}</option>
                      {PROJECT_TYPES.map((value) => <option key={value} value={value}>{t(`projectTypeOptions.${value}`)}</option>)}
                    </select>
                    {fieldErrors.projectType && <p id="projectType-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.projectType}</p>}
                  </div>
                  <div>
                    <label htmlFor="budget" className={labelClass}>{t('budgetLabel')}{renderFieldStatus('budget')}</label>
                    <select id="budget" name="budget" value={formData.budget} onChange={handleChange} aria-invalid={Boolean(fieldErrors.budget)} aria-describedby={fieldErrors.budget ? 'budget-error' : undefined} className={fieldClass('budget')}>
                      <option value="">{t('budgetPlaceholder')}</option>
                      {BUDGET_RANGES.map((value) => <option key={value} value={value}>{t(`budgetOptions.${value}`)}</option>)}
                    </select>
                    {fieldErrors.budget && <p id="budget-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.budget}</p>}
                  </div>
                  <div>
                    <label htmlFor="timeline" className={labelClass}>{t('timelineLabel')}{renderFieldStatus('timeline')}</label>
                    <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} aria-invalid={Boolean(fieldErrors.timeline)} aria-describedby={fieldErrors.timeline ? 'timeline-error' : undefined} className={fieldClass('timeline')}>
                      <option value="">{t('timelinePlaceholder')}</option>
                      {TIMELINES.map((value) => <option key={value} value={value}>{t(`timelineOptions.${value}`)}</option>)}
                    </select>
                    {fieldErrors.timeline && <p id="timeline-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.timeline}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className={labelClass}>{t('messageLabel')}{renderFieldStatus('message')}</label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} placeholder={t('messagePlaceholder')} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'message-error' : undefined} className={`${fieldClass('message')} resize-none`} />
                    {fieldErrors.message && <p id="message-error" className="mt-1.5 text-xs text-[#a94442]">{fieldErrors.message}</p>}
                  </div>
                </div>

                {formError && <p role="alert" className="mt-5 text-sm font-medium text-[#a94442]">{formError}</p>}

                <div className="flex justify-end pt-7">
                  <button type="submit" disabled={submitting} className="group flex h-12 min-w-[156px] items-center justify-center border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-transparent hover:text-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60">
                    {submitting ? t('sending') : t('send')}
                    <Send size={14} className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
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
                    onClick={() => handleContactInfoClick(item.method)}
                    className="flex h-9 w-9 items-center justify-center border border-[rgba(26,26,26,0.16)] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <item.icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
              <p className="text-mono max-w-[18rem] text-left text-[10px] leading-relaxed text-[var(--color-text-muted)] sm:text-right">
                {t('microReassurance')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="fixed inset-0 z-[90] grid place-items-center bg-[rgba(26,26,26,0.32)] px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.99 }} transition={{ duration: 0.22, ease: smoothEasing }} className="relative w-full max-w-md border border-[rgba(58,90,64,0.22)] bg-[#F6F6F2] p-7 shadow-[0_24px_70px_rgba(26,26,26,0.2)] sm:p-9">
              <button type="button" onClick={() => setSubmitted(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-[rgba(26,26,26,0.14)] text-[var(--color-text-main)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]" aria-label={t('closeConfirmation')}>
                <X size={16} aria-hidden="true" />
              </button>
              <CheckCircle size={30} className="text-[var(--color-primary)]" aria-hidden="true" />
              <p className="mt-6 text-mono text-[10px] uppercase text-[var(--color-primary)]">{t('successKicker')}</p>
              <h2 id="contact-success-title" className="mt-3 font-serif text-3xl leading-tight text-[var(--color-text-main)]">{t('successTitle')}</h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-muted)]">{submittedWithWhatsApp ? t('successBodyWhatsApp') : t('successBody')}</p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppLead('success_modal_whatsapp', { page: 'contact', location: 'success_modal' })}
                  className="inline-flex min-h-11 items-center gap-2 bg-[var(--color-primary)] px-5 text-mono text-[10px] uppercase text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                >
                  <WhatsAppIcon size={14} aria-hidden="true" />
                  {t('successWhatsApp')}
                </a>
                <button type="button" onClick={() => setSubmitted(false)} className="border-b border-[var(--color-primary)] pb-1 text-mono text-[10px] uppercase text-[var(--color-primary)]">{t('successBack')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
