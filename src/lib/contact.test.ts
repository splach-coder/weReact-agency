import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContactConfirmationEmail, buildContactEmail, getContactFieldErrors, isRequiredContactField, validateContactSubmission } from './contact';

test('identifies the required contact fields', () => {
  assert.equal(isRequiredContactField('name'), true);
  assert.equal(isRequiredContactField('email'), true);
  assert.equal(isRequiredContactField('phone'), false);
  assert.equal(isRequiredContactField('message'), false);
  assert.equal(isRequiredContactField('whatsapp'), false);
  assert.equal(isRequiredContactField('company'), false);
});

test('validates a complete contact enquiry', () => {
  assert.deepEqual(
    validateContactSubmission({
      name: 'Anas Benbow',
      email: 'anas@example.com',
      phone: '+212 600 000 000',
      company: 'WeReact',
      message: 'I need a website for my business.',
      website: '',
    }),
    { valid: true }
  );
});

test('builds a safe email for a contact enquiry', () => {
  const email = buildContactEmail({
    name: 'Anas <Benbow>',
    email: 'anas@example.com',
    phone: '+212 600 000 000',
    company: 'WeReact',
    message: 'I need a website.',
  });

  assert.equal(email.subject, 'New project enquiry - Anas <Benbow>');
  assert.match(email.html, /Anas &lt;Benbow&gt;/);
  assert.match(email.html, /I need a website\./);
});

test('builds a confirmation email for the sender', () => {
  const email = buildContactConfirmationEmail({
    name: 'Anas',
    email: 'anas@example.com',
    phone: '+212 600 000 000',
    message: 'I need a website.',
  });

  assert.equal(email.subject, 'We received your note');
  assert.match(email.html, /Thanks for getting in touch, Anas/);
  assert.equal(email.replyTo, 'hello@wereact.agency');
  assert.match(email.html, /hello@wereact\.agency/);
  assert.match(email.html, /\+212 602-258009/);
  assert.match(email.html, /Chat on WhatsApp/);
  assert.match(email.html, /wereact\.agency/);
  assert.match(email.html, /&middot;wereact&middot;/);
  assert.doesNotMatch(email.html, /wereact-email-logo\.png/);
});
test('requires only name and email, and validates phone only when provided', () => {
  const nameEmailOnly = validateContactSubmission({ name: 'Anas', email: 'anas@example.com' });
  assert.deepEqual(nameEmailOnly, { valid: true });

  const invalidPhone = validateContactSubmission({ name: 'Anas', email: 'anas@example.com', phone: 'abc' });
  assert.deepEqual(invalidPhone, { valid: false, message: 'Please enter a valid phone number.' });
});

test('uses the client WhatsApp route when it is provided', () => {
  const input = { name: 'Anas', email: 'anas@example.com', phone: '+212 600 000 000', whatsapp: '+212 611 000 000', message: 'I need a site.' };
  const confirmation = buildContactConfirmationEmail(input);
  const enquiry = buildContactEmail(input);

  assert.match(confirmation.html, /reach you on WhatsApp as soon as possible/i);
  assert.match(enquiry.html, /\+212 600 000 000/);
  assert.match(enquiry.html, /\+212 611 000 000/);
  assert.doesNotMatch(confirmation.html, /images\/logo\.webp/);
});

test('returns useful field-level feedback before submitting the form', () => {
  assert.deepEqual(
    getContactFieldErrors({
      name: '',
      email: 'not-an-email',
      phone: 'abc',
      whatsapp: 'no',
      message: '',
    }),
    {
      name: 'Please add your name.',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number.',
      whatsapp: 'Please enter a valid WhatsApp number.',
    }
  );
});

test('localizes validation errors for the French landing page', () => {
  const errors = getContactFieldErrors({ name: '', email: 'not-an-email' }, 'fr');
  assert.equal(errors.name, 'Merci d’ajouter votre nom.');
  assert.equal(errors.email, 'Merci de saisir une adresse e-mail valide.');
});

test('includes escaped campaign attribution in the owner enquiry email', () => {
  const email = buildContactEmail({
    name: 'Anas',
    email: 'anas@example.com',
    message: 'I need a website.',
    attribution: {
      utm_source: 'google',
      utm_campaign: 'search_marrakech',
      gclid: 'abc<script>123',
      transaction_id: 'tx-42',
    },
  });

  assert.match(email.html, /Campaign attribution/);
  assert.match(email.html, /utm_source:<\/strong> google/);
  assert.match(email.html, /abc&lt;script&gt;123/);
  assert.match(email.html, /tx-42/);
  assert.doesNotMatch(email.html, /<script>/);
});

test('omits the attribution block when no attribution was captured', () => {
  const email = buildContactEmail({ name: 'Anas', email: 'anas@example.com' });
  assert.doesNotMatch(email.html, /Campaign attribution/);
});

test('sends the confirmation email in French for FR leads', () => {
  const email = buildContactConfirmationEmail({
    name: 'Yassine',
    email: 'yassine@example.com',
    locale: 'fr',
  });

  assert.equal(email.subject, 'Nous avons bien reçu votre message');
  assert.match(email.html, /lang="fr"/);
  assert.match(email.html, /Merci de nous avoir écrit, Yassine/);
  assert.match(email.html, /Discuter sur WhatsApp/);
  assert.match(email.html, /sous un jour ouvré/);
});

test('accepts allowlisted optional qualification values', () => {
  const result = validateContactSubmission({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'tourism',
    budget: '5000-10000',
    timeline: 'within-month',
  });
  assert.equal(result.valid, true);
});

test('rejects forged qualification values', () => {
  const result = validateContactSubmission({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'forged' as never,
  });
  assert.equal(result.valid, false);
});
