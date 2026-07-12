import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContactConfirmationEmail, buildContactEmail, validateContactSubmission } from './contact';

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
});
test('requires a direct phone number and keeps WhatsApp optional', () => {
  const missingPhone = validateContactSubmission({ name: 'Anas', email: 'anas@example.com', message: 'I need a site.' });
  assert.deepEqual(missingPhone, { valid: false, message: 'Please add a phone number we can use to reach you.' });

  const withPhone = validateContactSubmission({ name: 'Anas', email: 'anas@example.com', phone: '+212 600 000 000', message: 'I need a site.' });
  assert.deepEqual(withPhone, { valid: true });
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
