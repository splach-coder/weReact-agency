import assert from 'node:assert/strict';
import test from 'node:test';
import { trackLead } from './analytics';

test('trackLead waits for the Google Ads conversion callback', async () => {
  let resolveConversion: (() => void) | undefined;
  const calls: unknown[][] = [];

  Object.assign(globalThis, {
    window: {
      setTimeout: (callback: () => void, delay: number) => globalThis.setTimeout(callback, delay),
      clearTimeout: (timeout: ReturnType<typeof setTimeout>) => globalThis.clearTimeout(timeout),
      gtag: (...args: unknown[]) => {
        calls.push(args);
        if (args[0] === 'event' && args[1] === 'conversion') {
          resolveConversion = (args[2] as { event_callback?: () => void }).event_callback;
        }
      },
    },
  });

  let settled = false;
  const lead = trackLead('contact_form').then(() => {
    settled = true;
  });

  assert.equal(settled, false);
  assert.equal(typeof resolveConversion, 'function');

  resolveConversion?.();
  await lead;

  assert.equal(settled, true);
  assert.equal(calls.some((call) => call[1] === 'conversion'), true);
});
