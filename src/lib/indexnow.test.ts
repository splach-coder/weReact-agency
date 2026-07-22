import assert from 'node:assert/strict';
import test from 'node:test';
import { createIndexNowPayload, isAcceptedIndexNowStatus } from './indexnow';

const key = '7c48682a-ebbb-4816-83b4-28ae3c0a2cc3';

test('submits only canonical public WeReact URLs', () => {
  const payload = createIndexNowPayload([
    'https://www.wereact.agency/en',
    'https://www.wereact.agency/fr/blog',
    'https://www.wereact.agency/admin',
    'https://example.com/en',
  ], key);

  assert.deepEqual(payload.urlList, [
    'https://www.wereact.agency/en',
    'https://www.wereact.agency/fr/blog',
  ]);
  assert.equal(payload.keyLocation, `https://www.wereact.agency/${key}.txt`);
});

test('accepts IndexNow success and pending-validation responses', () => {
  assert.equal(isAcceptedIndexNowStatus(200), true);
  assert.equal(isAcceptedIndexNowStatus(202), true);
  assert.equal(isAcceptedIndexNowStatus(422), false);
});
