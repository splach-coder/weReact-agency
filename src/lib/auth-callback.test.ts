import assert from 'node:assert/strict';
import test from 'node:test';
import { getEarlyRequestRedirect } from './auth-callback';

test('moves a Supabase auth code from a public locale page to the admin callback', () => {
  const source = new URL('https://www.wereact.agency/en?code=f283871b-0a9d-4800-825e-0a0ae8c4961e');

  const recovered = getEarlyRequestRedirect(source);

  assert.equal(
    recovered?.toString(),
    'https://www.wereact.agency/admin/auth/callback?code=f283871b-0a9d-4800-825e-0a0ae8c4961e',
  );
});

test('moves apex requests to the canonical www host without losing the destination', () => {
  const source = new URL('https://wereact.agency/admin?view=pipeline');

  const redirected = getEarlyRequestRedirect(source);

  assert.equal(
    redirected?.toString(),
    'https://www.wereact.agency/admin?view=pipeline',
  );
});

test('does not redirect ordinary public URLs', () => {
  assert.equal(getEarlyRequestRedirect(new URL('https://www.wereact.agency/en')), null);
  assert.equal(getEarlyRequestRedirect(new URL('https://www.wereact.agency/en?code=article')), null);
  assert.equal(
    getEarlyRequestRedirect(
      new URL('https://www.wereact.agency/en/contact?code=f283871b-0a9d-4800-825e-0a0ae8c4961e'),
    ),
    null,
  );
});
