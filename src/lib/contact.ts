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

  return {
    subject: 'We received your note',
    html: `
      <main style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:Arial,sans-serif;color:#1a1a1a;line-height:1.6">
        <p style="margin:0 0 28px;color:#3a5a40;font-weight:700">WeReact</p>
        <h1 style="font-size:28px;line-height:1.15;margin:0 0 20px">Thanks for getting in touch, ${escapeHtml(name)}.</h1>
        <p>We received your project note and will read it carefully. We will reply as soon as possible.</p>
        <p style="margin-top:28px">WeReact<br />Marrakech, Morocco</p>
      </main>
    `,
  };
}