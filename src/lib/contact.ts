import type { LeadAttribution } from '@/lib/leads';
import { siteConfig } from '@/config/site';

export type ContactLocale = 'en' | 'fr';

export const PROJECT_TYPES = ['tourism', 'local-business', 'international', 'ecommerce', 'landing-page', 'other'] as const;
export const BUDGET_RANGES = ['under-5000', '5000-10000', '10000-25000', '25000-plus', 'not-sure'] as const;
export const TIMELINES = ['asap', 'within-month', 'one-three-months', 'flexible'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];
export type ProjectTimeline = (typeof TIMELINES)[number];

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  message?: string;
  projectType?: ProjectType | '';
  budget?: BudgetRange | '';
  timeline?: ProjectTimeline | '';
  website?: string;
  locale?: ContactLocale;
  attribution?: LeadAttribution | null;
};

type ValidationResult = { valid: true } | { valid: false; message: string };
export type ContactField = 'name' | 'email' | 'phone' | 'whatsapp' | 'company' | 'message' | 'projectType' | 'budget' | 'timeline';
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

const requiredContactFields = new Set<ContactField>(['name', 'email']);

export function isRequiredContactField(field: ContactField) {
  return requiredContactFields.has(field);
}

function isPhoneNumber(value: string) {
  return /^\+?[0-9().\s-]{7,40}$/.test(value);
}

// Shared client/server validation copy — the FR ad landing page must never
// show English errors at the conversion moment.
const VALIDATION_MESSAGES = {
  en: {
    nameMissing: 'Please add your name.',
    nameTooLong: 'Please use a shorter name.',
    emailMissing: 'Please add your email address.',
    emailInvalid: 'Please enter a valid email address.',
    emailTooLong: 'Please use a shorter email address.',
    phoneInvalid: 'Please enter a valid phone number.',
    phoneTooLong: 'Please use a shorter phone number.',
    whatsappInvalid: 'Please enter a valid WhatsApp number.',
    whatsappTooLong: 'Please use a shorter WhatsApp number.',
    companyTooLong: 'Please use a shorter company name.',
    messageTooLong: 'Please shorten your message and try again.',
    projectTypeInvalid: 'Please choose a valid project type.',
    budgetInvalid: 'Please choose a valid budget range.',
    timelineInvalid: 'Please choose a valid timeline.',
  },
  fr: {
    nameMissing: 'Merci d’ajouter votre nom.',
    nameTooLong: 'Merci d’utiliser un nom plus court.',
    emailMissing: 'Merci d’ajouter votre adresse e-mail.',
    emailInvalid: 'Merci de saisir une adresse e-mail valide.',
    emailTooLong: 'Merci d’utiliser une adresse e-mail plus courte.',
    phoneInvalid: 'Merci de saisir un numéro de téléphone valide.',
    phoneTooLong: 'Merci d’utiliser un numéro de téléphone plus court.',
    whatsappInvalid: 'Merci de saisir un numéro WhatsApp valide.',
    whatsappTooLong: 'Merci d’utiliser un numéro WhatsApp plus court.',
    companyTooLong: 'Merci d’utiliser un nom d’entreprise plus court.',
    messageTooLong: 'Merci de raccourcir votre message et de réessayer.',
    projectTypeInvalid: 'Merci de choisir un type de projet valide.',
    budgetInvalid: 'Merci de choisir une fourchette de budget valide.',
    timelineInvalid: 'Merci de choisir un délai valide.',
  },
} as const;

function contactLocale(locale?: string): ContactLocale {
  return locale === 'fr' ? 'fr' : 'en';
}

export function getContactFieldErrors(input: ContactSubmission, locale?: string): ContactFieldErrors {
  const copy = VALIDATION_MESSAGES[contactLocale(locale ?? input.locale)];
  const errors: ContactFieldErrors = {};
  const name = input.name?.trim() ?? '';
  const email = input.email?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';
  const whatsapp = input.whatsapp?.trim() ?? '';
  const company = input.company?.trim() ?? '';
  const message = input.message?.trim() ?? '';
  const projectType = input.projectType ?? '';
  const budget = input.budget ?? '';
  const timeline = input.timeline ?? '';

  if (!name) errors.name = copy.nameMissing;
  else if (name.length > 120) errors.name = copy.nameTooLong;

  if (!email) errors.email = copy.emailMissing;
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = copy.emailInvalid;
  else if (email.length > 254) errors.email = copy.emailTooLong;

  if (phone && !isPhoneNumber(phone)) errors.phone = copy.phoneInvalid;
  else if (phone.length > 40) errors.phone = copy.phoneTooLong;

  if (whatsapp && !isPhoneNumber(whatsapp)) errors.whatsapp = copy.whatsappInvalid;
  else if (whatsapp.length > 40) errors.whatsapp = copy.whatsappTooLong;

  if (company.length > 160) errors.company = copy.companyTooLong;

  if (message.length > 5000) errors.message = copy.messageTooLong;

  if (projectType && !(PROJECT_TYPES as readonly string[]).includes(projectType)) errors.projectType = copy.projectTypeInvalid;
  if (budget && !(BUDGET_RANGES as readonly string[]).includes(budget)) errors.budget = copy.budgetInvalid;
  if (timeline && !(TIMELINES as readonly string[]).includes(timeline)) errors.timeline = copy.timelineInvalid;

  return errors;
}

export function validateContactSubmission(input: ContactSubmission): ValidationResult {
  const errors = getContactFieldErrors(input);
  const firstError = Object.values(errors)[0];
  return firstError ? { valid: false, message: firstError } : { valid: true };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

// Attribution values arrive from the visitor's URL — escape them like every
// other user-controlled field before they touch email HTML.
function buildAttributionHtml(attribution: ContactSubmission['attribution']) {
  if (!attribution || typeof attribution !== 'object') return '';

  const rows = Object.entries(attribution)
    .filter(([, value]) => typeof value === 'string' && value.length > 0)
    .map(([key, value]) => `<p style="margin:2px 0;"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</p>`);

  if (!rows.length) return '';

  return `
      <hr />
      <p><strong>Campaign attribution</strong></p>
      ${rows.join('\n      ')}
  `;
}

export function buildContactEmail(input: ContactSubmission) {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone?.trim() || 'Not provided';
  const whatsapp = input.whatsapp?.trim() || 'Not provided';
  const company = input.company?.trim() || 'Not provided';
  const message = input.message?.trim() || '(No message provided)';

  return {
    subject: `New project enquiry - ${name}`,
    replyTo: email,
    html: `
      <h2>New project enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      ${buildAttributionHtml(input.attribution)}
    `,
  };
}

const CONFIRMATION_COPY = {
  en: {
    subject: 'We received your note',
    preheader: 'Your WeReact project enquiry is safely with us.',
    kicker: 'Project enquiry received',
    heading: (name: string) => `Thanks for getting in touch, ${name}.`,
    body: 'Your note is safely with our studio. We will review it carefully and come back with the next useful step for your project.',
    followUpWhatsApp:
      'We will reach you on WhatsApp as soon as possible. You can also reply directly to this email if that is easier.',
    followUpEmail:
      'We will reply by email within one business day. If you prefer WhatsApp, you can start the conversation using the button below.',
    replyByEmail: 'Reply by email',
    chatOnWhatsApp: 'Chat on WhatsApp',
    footerLine: 'Web design, SEO foundations, and conversion-focused digital experiences.',
    footerLocation: 'Marrakech, Morocco &middot; English and French',
    lang: 'en',
  },
  fr: {
    subject: 'Nous avons bien reçu votre message',
    preheader: 'Votre demande de projet est bien arrivée chez WeReact.',
    kicker: 'Demande de projet reçue',
    heading: (name: string) => `Merci de nous avoir écrit, ${name}.`,
    body: 'Votre message est bien arrivé au studio. Nous l’étudions avec attention et revenons vers vous avec la prochaine étape utile pour votre projet.',
    followUpWhatsApp:
      'Nous vous répondrons sur WhatsApp au plus vite. Vous pouvez aussi répondre directement à cet e-mail si c’est plus simple.',
    followUpEmail:
      'Nous vous répondrons par e-mail sous un jour ouvré. Si vous préférez WhatsApp, vous pouvez lancer la conversation avec le bouton ci-dessous.',
    replyByEmail: 'Répondre par e-mail',
    chatOnWhatsApp: 'Discuter sur WhatsApp',
    footerLine: 'Création de sites web, fondations SEO et expériences digitales orientées conversion.',
    footerLocation: 'Marrakech, Maroc &middot; Français et anglais',
    lang: 'fr',
  },
} as const;

export function buildContactConfirmationEmail(input: ContactSubmission) {
  const copy = CONFIRMATION_COPY[contactLocale(input.locale)];
  const name = input.name.trim();
  const email = siteConfig.business.email;
  const phone = siteConfig.business.phoneInternational;
  const whatsapp = siteConfig.business.whatsapp;
  const website = siteConfig.url;
  const followUp = input.whatsapp?.trim() ? copy.followUpWhatsApp : copy.followUpEmail;

  return {
    subject: copy.subject,
    replyTo: email,
    html: `
      <!doctype html>
      <html lang="${copy.lang}">
        <body style="margin:0;padding:0;background:#f6f6f2;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
          <span style="display:none!important;font-size:1px;color:#f6f6f2;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${copy.preheader}</span>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f2;">
            <tr>
              <td align="center" style="padding:32px 16px 42px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;">
                  <tr>
                    <td style="padding:0 0 26px;border-bottom:1px solid #cbd5c0;">
                      <a href="${website}" style="color:#2e4833;font-size:25px;font-weight:800;letter-spacing:-1.3px;text-decoration:none;">&middot;wereact&middot;</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px 0 28px;">
                      <p style="margin:0 0 15px;color:#3a5a40;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${copy.kicker}</p>
                      <h1 style="margin:0;color:#1a1a1a;font-size:31px;line-height:1.16;font-weight:700;">${copy.heading(escapeHtml(name))}</h1>
                      <p style="margin:23px 0 0;color:#4f4f4f;font-size:17px;line-height:1.65;">${copy.body}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:23px 25px;background:#e7ece2;border-left:4px solid #3a5a40;">
                      <p style="margin:0;color:#2e4833;font-size:15px;line-height:1.6;">${followUp}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 0 36px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background:#3a5a40;">
                            <a href="mailto:${email}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:.7px;text-decoration:none;text-transform:uppercase;">${copy.replyByEmail}</a>
                          </td>
                          <td width="12" style="width:12px;">&nbsp;</td>
                          <td style="border:1px solid #3a5a40;">
                            <a href="${whatsapp}" style="display:inline-block;padding:13px 19px;color:#3a5a40;font-size:12px;font-weight:700;letter-spacing:.7px;text-decoration:none;text-transform:uppercase;">${copy.chatOnWhatsApp}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:23px 0 0;border-top:1px solid #cbd5c0;">
                      <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:700;">WeReact agency</p>
                      <p style="margin:7px 0 0;color:#5f5f5f;font-size:13px;line-height:1.65;">${copy.footerLine}<br />${copy.footerLocation}</p>
                      <p style="margin:14px 0 0;color:#3a5a40;font-size:13px;line-height:1.7;"><a href="mailto:${email}" style="color:#3a5a40;text-decoration:underline;">${email}</a> &middot; <a href="tel:${phone.replace(/[^\d+]/g, '')}" style="color:#3a5a40;text-decoration:underline;">${phone}</a> &middot; <a href="${website}" style="color:#3a5a40;text-decoration:underline;">wereact.agency</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
}
