// Shared helpers for the Google Business Profile scripts.
// Zero dependencies. Reuses the Ads OAuth client + a GBP-scoped refresh token.

import { existsSync, readFileSync } from 'node:fs';

export function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key] = match;
      let value = match[2].trim();
      if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

/** Exchange the stored refresh token for a short-lived access token. */
export async function getAccessToken() {
  const clientId = process.env.GOOGLE_ADS_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing OAuth config. Need GOOGLE_ADS_OAUTH_CLIENT_ID, GOOGLE_ADS_OAUTH_CLIENT_SECRET, ' +
        'and GOOGLE_BUSINESS_REFRESH_TOKEN in .env.local (run `npm run gbp:token`).'
    );
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || `HTTP ${res.status}`);
  return data.access_token;
}

/** GET/POST/PATCH a GBP API endpoint with the bearer token; returns parsed JSON. */
export async function api(accessToken, url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Non-JSON (e.g. an HTML error page) usually means the API isn't enabled
    // or access isn't approved yet.
    throw new Error(
      `Non-JSON response from ${url} (HTTP ${res.status}). ` +
        'Is the API enabled and access approved? First 200 chars:\n' +
        text.slice(0, 200)
    );
  }

  if (!res.ok) {
    const msg = data.error?.message || data.error || `HTTP ${res.status}`;
    throw new Error(`${method} ${url}\n  -> ${msg}`);
  }
  return data;
}

// API hosts
export const ACCOUNTS = 'https://mybusinessaccountmanagement.googleapis.com/v1';
export const INFO = 'https://mybusinessbusinessinformation.googleapis.com/v1';
export const V4 = 'https://mybusiness.googleapis.com/v4'; // local posts, media, reviews
