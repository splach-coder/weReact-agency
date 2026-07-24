import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { POST } from './route';

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_KEY = process.env.GEMINI_API_KEY;

function request(body: unknown, ip: string) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

test.afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  if (ORIGINAL_KEY === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = ORIGINAL_KEY;
});

test('rejects malformed public chat input before contacting Gemini', async () => {
  process.env.GEMINI_API_KEY = 'server-test-key';
  let contacted = false;
  globalThis.fetch = async () => {
    contacted = true;
    return new Response();
  };

  const response = await POST(request({ message: '' }, '192.0.2.10'));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(contacted, false);
  assert.equal(typeof body.error, 'string');
});

test('rejects an oversized body even when content-length is absent', async () => {
  process.env.GEMINI_API_KEY = 'server-test-key';
  const oversized = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '192.0.2.13',
    },
    body: JSON.stringify({ message: 'Hello', padding: 'x'.repeat(20_000) }),
  });

  const response = await POST(oversized);

  assert.equal(response.status, 413);
});
test('fails safely when Gemini is not configured', async () => {
  delete process.env.GEMINI_API_KEY;
  const response = await POST(request({ message: 'Hello', locale: 'en' }, '192.0.2.11'));
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.error, 'The sales assistant is unavailable right now. Please use WhatsApp or email.');
});

test('streams filtered Gemini events without exposing provider metadata', async () => {
  process.env.GEMINI_API_KEY = 'server-test-key';
  const providerSse = [
    'event: interaction.created',
    'data: {"interaction":{"id":"v1_route_chat_123","status":"in_progress"},"event_type":"interaction.created"}',
    '',
    'event: step.delta',
    'data: {"index":0,"delta":{"type":"thought_signature","signature":"secret-thought"},"event_type":"step.delta"}',
    '',
    'event: step.delta',
    'data: {"index":1,"delta":{"type":"text","text":"We build fast websites."},"event_type":"step.delta"}',
    '',
    'event: interaction.completed',
    'data: {"interaction":{"id":"v1_route_chat_123","status":"completed"},"event_type":"interaction.completed"}',
    '',
    '',
  ].join('\n');
  let upstreamHeaders: Headers | undefined;
  let upstreamBody = '';

  globalThis.fetch = async (_input, init) => {
    upstreamHeaders = new Headers(init?.headers);
    upstreamBody = String(init?.body ?? '');
    return new Response(providerSse, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    });
  };

  const response = await POST(request({ message: 'What do you build?', locale: 'en' }, '192.0.2.12'));
  const output = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/x-ndjson/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(upstreamHeaders?.get('x-goog-api-key'), 'server-test-key');
  assert.match(upstreamBody, /gemini-3\.1-flash-lite/);
  assert.match(output, /We build fast websites/);
  assert.doesNotMatch(output, /v1_route_chat_123|secret-thought|thought_signature|server-test-key/);
});

test('keeps Gemini credentials server-only in the route source', () => {
  const route = readFileSync(new URL('./route.ts', import.meta.url), 'utf8');

  assert.match(route, /process\.env\.GEMINI_API_KEY/);
  assert.match(route, /x-goog-api-key/);
  assert.match(route, /application\/x-ndjson/);
  assert.match(route, /SALES_CHAT_RATE_LIMITER/);
  assert.match(route, /readBoundedBody/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_GEMINI|AQ\./);
});
