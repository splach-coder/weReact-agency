import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContactConfirmationEmail, buildContactEmail, validateContactSubmission } from './contact';

test('validates a complete contact enquiry', () => {
  assert.deepEqual(
    validateContactSubmission({
      name: 'Anas Benbow',
      email: 'anas@example.com',
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
    message: 'I need a website.',
  });

  assert.equal(email.subject, 'We received your note');
  assert.match(email.html, /Thanks for getting in touch, Anas/);
});