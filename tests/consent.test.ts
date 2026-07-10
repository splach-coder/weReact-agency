import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONSENT_STORAGE_KEY,
  getConsentState,
  parseConsentChoice,
} from '../src/lib/consent';

test('uses a stable key for the visitor consent choice', () => {
  assert.equal(CONSENT_STORAGE_KEY, 'wereact_cookie_consent_v1');
});

test('grants every Google measurement category only after acceptance', () => {
  assert.deepEqual(getConsentState('accepted'), {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  });
});

test('keeps non-essential Google measurement categories denied on rejection', () => {
  assert.deepEqual(getConsentState('rejected'), {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
});

test('only accepts known stored consent choices', () => {
  assert.equal(parseConsentChoice('accepted'), 'accepted');
  assert.equal(parseConsentChoice('rejected'), 'rejected');
  assert.equal(parseConsentChoice('anything else'), null);
});
