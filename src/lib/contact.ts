import type { LeadAttribution } from '@/lib/leads';
import { siteConfig } from '@/config/site';

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
  message: string;
  website?: string;
  attribution?: LeadAttribution;
};

type ValidationResult = { valid: true } | { valid: false; message: string };
export type ContactField = 'name' | 'email' | 'phone' | 'whatsapp' | 'company' | 'message';
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

function isPhoneNumber(value: string) {
  return /^\+?[0-9().\s-]{7,40}$/.test(value);
}

export function getContactFieldErrors(input: ContactSubmission): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = input.name?.trim() ?? '';
  const email = input.email?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';
  const whatsapp = input.whatsapp?.trim() ?? '';
  const company = input.company?.trim() ?? '';
  const message = input.message?.trim() ?? '';

  if (!name) errors.name = 'Please add your name.';
  else if (name.length > 120) errors.name = 'Please use a shorter name.';

  if (!email) errors.email = 'Please add your email address.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Please enter a valid email address.';
  else if (email.length > 254) errors.email = 'Please use a shorter email address.';

  if (!phone) errors.phone = 'Please add a phone number we can use to reach you.';
  else if (!isPhoneNumber(phone)) errors.phone = 'Please enter a valid phone number.';
  else if (phone.length > 40) errors.phone = 'Please use a shorter phone number.';

  if (whatsapp && !isPhoneNumber(whatsapp)) errors.whatsapp = 'Please enter a valid WhatsApp number.';
  else if (whatsapp.length > 40) errors.whatsapp = 'Please use a shorter WhatsApp number.';

  if (company.length > 160) errors.company = 'Please use a shorter company name.';

  if (!message) errors.message = 'Tell us a little about your project.';
  else if (message.length > 5000) errors.message = 'Please shorten your message and try again.';

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

export function buildContactEmail(input: ContactSubmission) {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const whatsapp = input.whatsapp?.trim() || 'Not provided';
  const company = input.company?.trim() || 'Not provided';
  const message = input.message.trim();

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
    `,
  };
}

export function buildContactConfirmationEmail(input: ContactSubmission) {
  const name = input.name.trim();
  const email = siteConfig.business.email;
  const phone = siteConfig.business.phoneInternational;
  const whatsapp = siteConfig.business.whatsapp;
  const website = siteConfig.url;
  const followUp = input.whatsapp?.trim()
    ? 'We will reach you on WhatsApp as soon as possible. You can also reply directly to this email if that is easier.'
    : 'We will reply by email within one business day. If you prefer WhatsApp, you can start the conversation using the button below.';

  return {
    subject: 'We received your note',
    replyTo: email,
    html: `
      <!doctype html>
      <html lang="en">
        <body style="margin:0;padding:0;background:#f6f6f2;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
          <span style="display:none!important;font-size:1px;color:#f6f6f2;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Your WeReact project enquiry is safely with us.</span>
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
                      <p style="margin:0 0 15px;color:#3a5a40;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Project enquiry received</p>
                      <h1 style="margin:0;color:#1a1a1a;font-size:31px;line-height:1.16;font-weight:700;">Thanks for getting in touch, ${escapeHtml(name)}.</h1>
                      <p style="margin:23px 0 0;color:#4f4f4f;font-size:17px;line-height:1.65;">Your note is safely with our studio. We will review it carefully and come back with the next useful step for your project.</p>
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
                            <a href="mailto:${email}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:.7px;text-decoration:none;text-transform:uppercase;">Reply by email</a>
                          </td>
                          <td width="12" style="width:12px;">&nbsp;</td>
                          <td style="border:1px solid #3a5a40;">
                            <a href="${whatsapp}" style="display:inline-block;padding:13px 19px;color:#3a5a40;font-size:12px;font-weight:700;letter-spacing:.7px;text-decoration:none;text-transform:uppercase;">Chat on WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:23px 0 0;border-top:1px solid #cbd5c0;">
                      <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:700;">WeReact agency</p>
                      <p style="margin:7px 0 0;color:#5f5f5f;font-size:13px;line-height:1.65;">Web design, SEO foundations, and conversion-focused digital experiences.<br />Marrakech, Morocco &middot; English and French</p>
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

