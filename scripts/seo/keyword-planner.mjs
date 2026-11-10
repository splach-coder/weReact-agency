// Keyword research through the Google Ads Keyword Planner API (free with the
// existing Ads account). Zero dependencies. Run from the repo root:
//
//   node scripts/seo/keyword-planner.mjs ideas   --seeds seeds.txt --out ideas.csv   [--lang fr|en|ar] [--geo 2504]
//   node scripts/seo/keyword-planner.mjs metrics --seeds list.txt  --out metrics.csv [--lang fr|en|ar] [--geo 2504]
//
// ideas   -> related keyword ideas with volume (Keyword Planner "discover new keywords")
// metrics -> volume / competition / CPC / 12-month trend for an exact list
//
// One keyword per line in the seeds file. Geo defaults to Morocco (2504).
// Reads the GOOGLE_ADS_* credentials from .env.local (see scripts/google-ads/README.md).

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

loadEnv();

const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || 'v25';
const CUSTOMER_ID = digits(process.env.GOOGLE_ADS_CUSTOMER_ID);
const LOGIN_CUSTOMER_ID = digits(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
const LANGUAGES = { en: 1000, fr: 1002, ar: 1019 };

const [mode] = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};

main().catch((error) => {
  console.error(`\nkeyword-planner: ${error.message}\n`);
  process.exit(1);
});

async function main() {
  if (!['ideas', 'metrics'].includes(mode)) throw new Error('mode must be "ideas" or "metrics"');
  const seeds = readFileSync(arg('seeds'), 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const out = arg('out', `${mode}.csv`);
  const lang = LANGUAGES[arg('lang', 'fr')];
  const geo = arg('geo', '2504');
  if (!lang) throw new Error('unknown --lang');

  const token = await getAccessToken();
  const base = {
    language: `languageConstants/${lang}`,
    geoTargetConstants: [`geoTargetConstants/${geo}`],
    keywordPlanNetwork: 'GOOGLE_SEARCH',
  };

  const rows = [];
  if (mode === 'metrics') {
    // The API accepts up to 10,000 keywords per call; batch at 1,000 to stay polite.
    for (let i = 0; i < seeds.length; i += 1000) {
      const data = await call(token, 'generateKeywordHistoricalMetrics', {
        ...base,
        keywords: seeds.slice(i, i + 1000),
        historicalMetricsOptions: { includeAverageCpc: true },
      });
      for (const r of data.results || []) rows.push(toRow(r.text, r.keywordMetrics, (r.closeVariants || []).join(' | ')));
    }
  } else {
    // Ideas take at most 20 seed keywords per call.
    for (let i = 0; i < seeds.length; i += 20) {
      let pageToken;
      do {
        const data = await call(token, 'generateKeywordIdeas', {
          ...base,
          includeAdultKeywords: false,
          keywordSeed: { keywords: seeds.slice(i, i + 20) },
          pageSize: 1000,
          ...(pageToken ? { pageToken } : {}),
        });
        for (const r of data.results || []) rows.push(toRow(r.text, r.keywordIdeaMetrics, ''));
        pageToken = data.nextPageToken;
      } while (pageToken);
      await sleep(1200);
    }
  }

  const seen = new Set();
  const unique = rows.filter((r) => (seen.has(r.keyword) ? false : seen.add(r.keyword)));
  unique.sort((a, b) => (b.volume ?? -1) - (a.volume ?? -1));
  const header = ['keyword', 'volume', 'competition', 'competition_index', 'cpc_low_mad', 'cpc_high_mad', 'trend_12m', 'close_variants'];
  const csv = [header.join(',')].concat(unique.map((r) => header.map((h) => csvCell(r[h])).join(','))).join('\n');
  writeFileSync(out, '﻿' + csv + '\n');
  console.log(`${mode}: ${unique.length} keywords -> ${out}`);
}

function toRow(keyword, m = {}, closeVariants) {
  const micros = (v) => (v == null ? '' : (Number(v) / 1e6).toFixed(2));
  return {
    keyword,
    volume: m.avgMonthlySearches == null ? null : Number(m.avgMonthlySearches),
    competition: m.competition || '',
    competition_index: m.competitionIndex ?? '',
    cpc_low_mad: micros(m.lowTopOfPageBidMicros),
    cpc_high_mad: micros(m.highTopOfPageBidMicros),
    trend_12m: (m.monthlySearchVolumes || []).map((x) => x.monthlySearches ?? 0).join(' '),
    close_variants: closeVariants,
  };
}

async function call(token, method, body) {
  const res = await fetch(`https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}:${method}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const detail = data?.error?.details?.[0]?.errors?.[0]?.message || data?.error?.message || res.status;
    throw new Error(`${method} failed: ${detail}`);
  }
  return data;
}

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth refresh failed: ${data.error_description || data.error}`);
  return data.access_token;
}

function authHeaders(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    'Content-Type': 'application/json',
  };
  if (LOGIN_CUSTOMER_ID) headers['login-customer-id'] = LOGIN_CUSTOMER_ID;
  return headers;
}

function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function digits(v) {
  return (v || '').replace(/\D/g, '');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}
