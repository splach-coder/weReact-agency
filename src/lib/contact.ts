import { siteConfig } from '@/config/site';

export type ContactSubmission = {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
};

type ValidationResult = { valid: true } | { valid: false; message: string };

export function validateContactSubmission(input: ContactSubmission): ValidationResult {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    return { valid: false, message: 'Please complete the required fields.' };
  }

  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  if (input.name.length > 120 || input.email.length > 254 || (input.company?.length ?? 0) > 160 || input.message.length > 5000) {
    return { valid: false, message: 'Please shorten your message and try again.' };
  }

  return { valid: true };
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
  const company = input.company?.trim() || 'Not provided';
  const message = input.message.trim();

  return {
    subject: `New project enquiry - ${name}`,
    replyTo: email,
    html: `
      <h2>New project enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
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
              <td align="center" style="padding:32px 16px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;">
                  <tr>
                    <td style="padding:0 0 28px;border-bottom:1px solid #cbd5c0;">
                      <a href="${website}" style="display:inline-block;text-decoration:none;">
                        <img src="${website}/images/logo.webp" width="138" alt="WeReact" style="display:block;width:138px;height:auto;border:0;outline:none;text-decoration:none;" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:42px 0 30px;">
                      <p style="margin:0 0 16px;color:#3a5a40;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;">Project enquiry received</p>
                      <h1 style="margin:0;color:#1a1a1a;font-size:31px;line-height:1.18;font-weight:700;">Thanks for getting in touch, ${escapeHtml(name)}.</h1>
                      <p style="margin:24px 0 0;color:#4f4f4f;font-size:17px;line-height:1.65;">Your note is with our team. We will review it carefully and reply within one business day with the next useful step for your project.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 26px;background:#e7ece2;border-left:4px solid #3a5a40;">
                      <p style="margin:0;color:#2e4833;font-size:15px;line-height:1.55;">Need to add something? Reply directly to this email or continue the conversation on WhatsApp. We work with businesses in Marrakech, across Morocco, and internationally.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 0 38px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background:#3a5a40;">
                            <a href="mailto:${email}" style="display:inline-block;padding:14px 20px;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:.6px;text-decoration:none;text-transform:uppercase;">Reply by email</a>
                          </td>
                          <td width="12" style="width:12px;">&nbsp;</td>
                          <td style="border:1px solid #3a5a40;">
                            <a href="${whatsapp}" style="display:inline-block;padding:13px 19px;color:#3a5a40;font-size:13px;font-weight:700;letter-spacing:.6px;text-decoration:none;text-transform:uppercase;">Chat with us on WhatsApp</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:24px 0 0;border-top:1px solid #cbd5c0;">
                      <p style="margin:0;color:#1a1a1a;font-size:15px;font-weight:700;">WeReact agency</p>
                      <p style="margin:7px 0 0;color:#5f5f5f;font-size:13px;line-height:1.65;">Web design, SEO foundations, and conversion-focused digital experiences.<br />Marrakech, Morocco · English &amp; French</p>
                      <p style="margin:14px 0 0;color:#3a5a40;font-size:13px;line-height:1.7;"><a href="mailto:${email}" style="color:#3a5a40;text-decoration:underline;">${email}</a> &nbsp;·&nbsp; <a href="tel:${phone.replace(/\s/g, '')}" style="color:#3a5a40;text-decoration:underline;">${phone}</a> &nbsp;·&nbsp; <a href="${website}" style="color:#3a5a40;text-decoration:underline;">wereact.agency</a></p>
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
