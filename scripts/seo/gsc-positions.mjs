// Position tracker from Google Search Console (free, first-party). Zero dependencies.
//
//   node scripts/seo/gsc-positions.mjs            -> last 28 days (ending 3 days ago, Search Console lag)
//   node scripts/seo/gsc-positions.mjs --days 90
//
// Tracks every priority-A keyword in docs/seo/keyword-research.csv plus the target pages, and writes
// docs/seo/positions/<date>.md and .json. Each run is compared with the previous JSON so progress is visible.
// Needs GOOGLE_INSIGHTS_REFRESH_TOKEN (scripts/google-insights/get-refresh-token.mjs) in .env.local.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

loadEnv();
const SITE = 'sc-domain:wereact.agency';
const OUT_DIR = 'docs/seo/positions';
const days = Number(arg('days', '28'));

const end = new Date(Date.now() - 3 * 864e5);
const start = new Date(end.getTime() - (days - 1) * 864e5);
const iso = (d) => d.toISOString().slice(0, 10);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'-]/g, ' ').replace(/\s+/g, ' ').trim();

main().catch((e) => {
  console.error('gsc-positions:', e.message);
  process.exit(1);
});

async function main() {
  const token = await accessToken();
  const tracked = readTracked();
  const byQuery = await query(token, ['query']);
  const byPage = await query(token, ['page']);
  const qMap = new Map();
  for (const r of byQuery) {
    const k = norm(r.keys[0]);
    const prev = qMap.get(k);
    if (!prev || r.impressions > prev.impressions) qMap.set(k, r);
  }

  const keywords = tracked.map((t) => {
    const r = qMap.get(norm(t.keyword));
    return { ...t, impressions: r?.impressions ?? 0, clicks: r?.clicks ?? 0, position: r ? round(r.position) : null };
  });
  const pageRows = byPage
    .filter((r) => /wereact\.agency\/(en|fr)\b/.test(r.keys[0]))
    .map((r) => ({ page: r.keys[0].replace(/^https?:\/\/[^/]+/, ''), impressions: r.impressions, clicks: r.clicks, position: round(r.position) }))
    .sort((a, b) => b.impressions - a.impressions);
  const totals = byPage.reduce((t, r) => ({ clicks: t.clicks + r.clicks, impressions: t.impressions + r.impressions }), { clicks: 0, impressions: 0 });

  mkdirSync(OUT_DIR, { recursive: true });
  const previous = latestPrevious();
  const today = iso(new Date());
  const report = { generatedAt: new Date().toISOString(), range: { start: iso(start), end: iso(end), days }, totals, keywords, pages: pageRows };
  writeFileSync(`${OUT_DIR}/${today}.json`, JSON.stringify(report, null, 1));

  const prevKw = new Map((previous?.keywords ?? []).map((k) => [norm(k.keyword), k]));
  const prevPg = new Map((previous?.pages ?? []).map((p) => [p.page, p]));
  const delta = (now, before) => (now == null || before == null ? '' : before - now > 0 ? ` (▲${round(before - now)})` : before - now < 0 ? ` (▼${round(now - before)})` : ' (=)');

  const lines = [
    `# Google positions — ${today}`,
    '',
    `Search Console, ${report.range.start} to ${report.range.end} (${days} days). Position is Google's average position for the query (1 = top).`,
    previous ? `Compared with the report of ${previous.generatedAt.slice(0, 10)}: ▲ = better position, ▼ = worse.` : 'First report: this is the baseline.',
    '',
    `**Whole site:** ${totals.clicks} clicks, ${totals.impressions} impressions` +
      (previous ? ` (previous: ${previous.totals.clicks} clicks, ${previous.totals.impressions} impressions)` : '') + '.',
    '',
    '## Priority keywords',
    '',
    '| Keyword | Searches/month (MA) | Target page | Impressions | Clicks | Avg position |',
    '|---|---|---|---|---|---|',
    ...keywords.map((k) => {
      const p = prevKw.get(norm(k.keyword));
      return `| ${k.keyword} | ${k.volume} | ${k.target} | ${k.impressions} | ${k.clicks} | ${k.position ?? 'not shown'}${delta(k.position, p?.position)} |`;
    }),
    '',
    '"not shown" = Google did not show the site for that query in the period (or too rarely for Search Console to report it).',
    '',
    '## Pages',
    '',
    '| Page | Impressions | Clicks | Avg position |',
    '|---|---|---|---|',
    ...pageRows.slice(0, 40).map((p) => `| ${p.page} | ${p.impressions} | ${p.clicks} | ${p.position}${delta(p.position, prevPg.get(p.page)?.position)} |`),
    '',
  ];
  writeFileSync(`${OUT_DIR}/${today}.md`, lines.join('\n'));
  const shown = keywords.filter((k) => k.position != null).length;
  console.log(`${OUT_DIR}/${today}.md: ${totals.clicks} clicks, ${totals.impressions} impressions; ${shown}/${keywords.length} priority keywords visible`);
}

function readTracked() {
  const text = readFileSync('docs/seo/keyword-research.csv', 'utf8').replace(/^﻿/, '');
  const [head, ...rows] = text.split(/\r?\n/).filter(Boolean);
  const cols = head.split(',');
  const parse = (l) => l.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g).slice(0, -1).map((x) => x.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
  const seen = new Set();
  return rows
    .map(parse)
    .map((c) => Object.fromEntries(cols.map((k, i) => [k, c[i]])))
    .filter((r) => r.priority === 'A' && !seen.has(norm(r.keyword)) && seen.add(norm(r.keyword)))
    .map((r) => ({ keyword: r.keyword, volume: Number(r.volume_ma || 0), target: r.target_page.replace(' (new)', '') }));
}

function latestPrevious() {
  if (!existsSync(OUT_DIR)) return null;
  const today = iso(new Date());
  const files = readdirSync(OUT_DIR).filter((f) => f.endsWith('.json') && f.slice(0, 10) !== today).sort();
  return files.length ? JSON.parse(readFileSync(`${OUT_DIR}/${files.at(-1)}`, 'utf8')) : null;
}

async function query(token, dimensions) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions, rowLimit: 5000 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Search Console: ${data.error?.message || res.status}`);
  return data.rows || [];
}

async function accessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_INSIGHTS_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth refresh failed: ${data.error_description || data.error}`);
  return data.access_token;
}

function round(n) {
  return Math.round(n * 10) / 10;
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
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
