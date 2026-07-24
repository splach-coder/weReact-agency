import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { consumeNdjsonChatStream } from './chat-stream';
import { cleanChatText } from './chat-links';

function chunkedStream(chunks: string[]) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

test('consumes split NDJSON chat events in order', async () => {
  const events: unknown[] = [];
  await consumeNdjsonChatStream(
    chunkedStream([
      '{"type":"start"}\n{"type":"text",',
      '"text":"Hello"}\n{"type":"done"}\n',
    ]),
    (event) => events.push(event),
  );

  assert.deepEqual(events, [
    { type: 'start' },
    { type: 'text', text: 'Hello' },
    { type: 'done' },
  ]);
});

test('ignores malformed stream lines without losing valid events', async () => {
  const events: unknown[] = [];
  await consumeNdjsonChatStream(
    chunkedStream(['not-json\n{"type":"text","text":"Still here"}\n']),
    (event) => events.push(event),
  );

  assert.deepEqual(events, [{ type: 'text', text: 'Still here' }]);
});

test('cleans common model markdown without changing the wording', () => {
  assert.equal(
    cleanChatText('**Showcase websites:**\n* From 2,000 MAD.'),
    'Showcase websites:\n- From 2,000 MAD.',
  );
});

test('public layout mounts the localized accessible sales assistant', () => {
  const layout = readFileSync(new URL('../app/[locale]/layout.tsx', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../components/SalesChat.tsx', import.meta.url), 'utf8');

  assert.match(layout, /<SalesChat locale=\{locale\}/);
  assert.match(component, /aria-label=\{copy\.launcherLabel\}/);
  assert.match(component, /&middot;ask wereact&middot;/);
  assert.doesNotMatch(component, /MessageCircle|launcherMark/);
  assert.match(component, /role="dialog"/);
  assert.match(component, /aria-live="polite"[\s\S]*announcement/);
  assert.match(component, /querySelectorAll<HTMLElement>\('#site-header, main, footer'\)/);
  assert.match(component, /tokenizeChatText/);
  assert.match(component, /trackEvent\('sales_chat_/);
  assert.match(component, /href=\{siteConfig\.business\.whatsapp\}/);
  assert.match(component, /href=\{`mailto:\$\{siteConfig\.business\.email\}`\}/);
  assert.match(component, /<WhatsAppIcon/);
  assert.match(component, /<Mail/);
  assert.doesNotMatch(component, /AI sales assistant|Assistant commercial IA/);
  assert.doesNotMatch(component, /Built for useful answers|Des réponses vraiment utiles/);
  assert.doesNotMatch(component, /Powered by Gemini|Propulsé par Gemini/);
  assert.doesNotMatch(component, /statusDot|welcomeMark|copy\.privacy/);
  assert.doesNotMatch(component, /previousInteractionId|interactionId/);
  assert.doesNotMatch(component, /GEMINI_API_KEY|NEXT_PUBLIC_GEMINI|AQ\./);
});
