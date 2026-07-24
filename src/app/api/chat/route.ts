import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';
import {
  createGeminiInteractionPayload,
  parseSalesChatRequest,
  transformGeminiSse,
  type SalesChatLocale,
} from '@/lib/sales-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_INTERACTIONS_URL =
  'https://generativelanguage.googleapis.com/v1beta/interactions';
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_REQUEST_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const MAX_ACTIVE_REQUESTS_PER_CLIENT = 1;

const UNAVAILABLE = {
  en: 'The sales assistant is unavailable right now. Please use WhatsApp or email.',
  fr: 'L’assistant commercial est indisponible pour le moment. Contactez-nous par WhatsApp ou e-mail.',
} as const;

const RATE_LIMITED = {
  en: 'Too many messages from this connection. Please wait a few minutes or use WhatsApp.',
  fr: 'Trop de messages depuis cette connexion. Patientez quelques minutes ou utilisez WhatsApp.',
} as const;

const attempts = new Map<string, number[]>();
const activeRequests = new Map<string, number>();

function clientKey(request: Request) {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'local';
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const hostname = new URL(origin).hostname;
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname === 'wereact.agency'
      || hostname === 'www.wereact.agency'
      || hostname === 'wereact-agency.wereact.workers.dev';
  } catch {
    return false;
  }
}

type RateLimitBinding = {
  limit(input: { key: string }): Promise<{ success: boolean }>;
};

type SalesChatCloudflareEnv = CloudflareEnv & {
  SALES_CHAT_RATE_LIMITER?: RateLimitBinding;
};

function isFallbackRateLimited(key: string, now = Date.now()) {
  const recent = (attempts.get(key) ?? [])
    .filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 5_000) {
    for (const [storedKey, timestamps] of attempts) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
        attempts.delete(storedKey);
      }
    }
  }

  return false;
}

async function isRateLimited(key: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (env as SalesChatCloudflareEnv).SALES_CHAT_RATE_LIMITER;
    if (limiter) {
      const result = await limiter.limit({ key: `sales-chat:${key}` });
      return !result.success;
    }
  } catch {
    // The binding is unavailable in plain Node tests and non-Cloudflare development.
  }

  return isFallbackRateLimited(key);
}

async function readBoundedBody(request: Request) {
  if (!request.body) return { status: 'ok' as const, value: '' };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let value = '';

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel('Request body too large.');
        return { status: 'too-large' as const };
      }
      value += decoder.decode(chunk.value, { stream: true });
    }
    value += decoder.decode();
    return { status: 'ok' as const, value };
  } catch {
    return { status: 'invalid' as const };
  } finally {
    reader.releaseLock();
  }
}
function localeFrom(input: unknown): SalesChatLocale {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return (input as Record<string, unknown>).locale === 'fr' ? 'fr' : 'en';
  }
  return 'en';
}

function releaseClient(key: string) {
  const remaining = (activeRequests.get(key) ?? 1) - 1;
  if (remaining > 0) activeRequests.set(key, remaining);
  else activeRequests.delete(key);
}

function withRelease(stream: ReadableStream<Uint8Array>, key: string) {
  const reader = stream.getReader();
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    releaseClient(key);
  };

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          release();
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch (error) {
        release();
        controller.error(error);
      }
    },
    async cancel(reason) {
      release();
      await reader.cancel(reason);
    },
  });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  }

  const body = await readBoundedBody(request);
  if (body.status === 'too-large') {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  }
  if (body.status === 'invalid') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  let input: unknown;
  try {
    input = JSON.parse(body.value);
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const locale = localeFrom(input);
  const parsed = parseSalesChatRequest(input);
  if (!parsed.valid) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const key = clientKey(request);
  if (await isRateLimited(key)) {
    return NextResponse.json({ error: RATE_LIMITED[locale] }, { status: 429 });
  }
  if ((activeRequests.get(key) ?? 0) >= MAX_ACTIVE_REQUESTS_PER_CLIENT) {
    return NextResponse.json({ error: RATE_LIMITED[locale] }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured.');
    return NextResponse.json({ error: UNAVAILABLE[locale] }, { status: 503 });
  }

  activeRequests.set(key, (activeRequests.get(key) ?? 0) + 1);

  try {
    const signal = AbortSignal.any([
      request.signal,
      AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    ]);
    const upstream = await fetch(GEMINI_INTERACTIONS_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(createGeminiInteractionPayload({
        ...parsed.value,
        model: process.env.GEMINI_MODEL,
      })),
      cache: 'no-store',
      signal,
    });

    if (!upstream.ok || !upstream.body) {
      releaseClient(key);
      console.error('Gemini interaction request failed.', {
        status: upstream.status,
        requestId: upstream.headers.get('x-request-id'),
      });
      return NextResponse.json({ error: UNAVAILABLE[locale] }, { status: 502 });
    }

    const stream = withRelease(
      transformGeminiSse(upstream.body, locale),
      key,
    );

    return new Response(stream, {
      status: 200,
      headers: {
        'content-type': 'application/x-ndjson; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    releaseClient(key);
    console.error('Gemini interaction request could not be completed.', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    return NextResponse.json({ error: UNAVAILABLE[locale] }, { status: 502 });
  }
}