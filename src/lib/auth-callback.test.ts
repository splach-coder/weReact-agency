import assert from 'node:assert/strict';
import test from 'node:test';
import { recoverMisroutedAuthCallback } from './auth-callback';

test('moves a Supabase auth code from a public locale page to the admin callback', () => {
  const source = new URL('https://www.wereact.agency/en?code=f283871b-0a9d-4800-825e-0a0ae8c4961e');

  const recovered = recoverMisroutedAuthCallback(source);

  assert.equal(
    recovered?.toString(),
    'https://www.wereact.agency/admin/auth/callback?code=f283871b-0a9d-4800-825e-0a0ae8c4961e',
  );
});

test('does not redirect ordinary public URLs', () => {
  assert.equal(recoverMisroutedAuthCallback(new URL('https://www.wereact.agency/en')), null);
  assert.equal(recoverMisroutedAuthCallback(new URL('https://www.wereact.agency/en?code=article')), null);
  assert.equal(
    recoverMisroutedAuthCallback(
      new URL('https://www.wereact.agency/en/contact?code=f283871b-0a9d-4800-825e-0a0ae8c4961e'),
    ),
    null,
  );
});
