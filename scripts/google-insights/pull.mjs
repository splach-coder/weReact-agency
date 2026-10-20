// Read-only snapshot of Search Console + GA4 for wereact.agency.
// Zero dependencies. Run from the repo root:
//   node scripts/google-insights/pull.mjs            # full pull (GSC, index status, GA4)
//   node scripts/google-insights/pull.mjs --no-inspect  # skip per-URL index inspection
//
// Needs GOOGLE_INSIGHTS_REFRESH_TOKEN (mint with get-refresh-token.mjs) and the
// same Desktop OAuth client as the Ads scripts. Writes raw JSON to
// /google-insights-report (gitignored) and prints a summary.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

loadEnv();

const OUT_DIR = 'google-insights-report';
const SITE_HOST = 'wereact.agency';
const DAYS = 90;

const token = await getAccessToken();
const report = { pulledAt: new Date().toISOString() };

// ── Search Console ───────────────────────────────────────────────────────────
try {
const sites = (await gapi('https://www.googleapis.com/webmasters/v3/sites')).siteEntry ?? [];
report.gscSites = sites;
const site =
  sites.find((s) => s.siteUrl === `sc-domain:${SITE_HOST}`) ??
  sites.find((s) => s.siteUrl.includes(SITE_HOST));
if (!site) {
  console.log(`⚠️  No Search Console property for ${SITE_HOST} on this Google account.`);
  console.log('   Properties visible:', sites.map((s) => s.siteUrl).join(', ') || '(none)');
} else {
  const siteUrl = encodeURIComponent(site.siteUrl);
  const range = { startDate: daysAgo(DAYS), endDate: daysAgo(1) };
  const query = (body) =>
    gapi(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
      method: 'POST',
      body: JSON.stringify({ ...range, rowLimit: 250, ...body }),
    }).then((r) => r.rows ?? []);

  report.gsc = {
    property: site.siteUrl,
    permission: site.permissionLevel,
    range,
    totals: await query({}),
    byDate: await query({ dimensions: ['date'] }),
    queries: await query({ dimensions: ['query'] }),
    pages: await query({ dimensions: ['page'] }),
    countries: await query({ dimensions: ['country'] }),
    devices: await query({ dimensions: ['device'] }),
    sitemaps: (await gapi(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`)).sitemap ?? [],
  };

  if (!process.argv.includes('--no-inspect')) {
    const urls = await sitemapUrls(`https://www.${SITE_HOST}/sitemap.xml`);
    report.gsc.inspection = [];
    for (const url of urls) {
      const res = await gapi('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        body: JSON.stringify({ inspectionUrl: url, siteUrl: site.siteUrl }),
      }).catch((err) => ({ error: err.message }));
      const r = res.inspectionResult?.indexStatusResult ?? {};
      report.gsc.inspection.push({
        url,
        verdict: r.verdict,
        coverage: r.coverageState,
        lastCrawl: r.lastCrawlTime,
        googleCanonical: r.googleCanonical,
        userCanonical: r.userCanonical,
        robots: r.robotsTxtState,
        fetch: r.pageFetchState,
        error: res.error,
      });
    }
  }
}

} catch (err) {
  report.gscError = err.message;
  console.log(`⚠️  Search Console: ${err.message}`);
}

// ── GA4 ──────────────────────────────────────────────────────────────────────
try {
const summaries = (await gapi('https://analyticsadmin.googleapis.com/v1beta/accountSummaries')).accountSummaries ?? [];
const properties = summaries.flatMap((a) => (a.propertySummaries ?? []).map((p) => ({ account: a.displayName, ...p })));
report.ga4Properties = properties;
const property =
  properties.find((p) => process.env.GA4_PROPERTY_ID && p.property.endsWith(process.env.GA4_PROPERTY_ID)) ??
  properties.find((p) => /wereact/i.test(p.displayName)) ??
  (properties.length === 1 ? properties[0] : null);

if (!property) {
  console.log('⚠️  Could not pick a GA4 property. Visible:', properties.map((p) => `${p.displayName} (${p.property})`).join(', ') || '(none)');
  console.log('   Set GA4_PROPERTY_ID=<number> in .env.local and re-run.');
} else {
  const run = (body) =>
    gapi(`https://analyticsdata.googleapis.com/v1beta/${property.property}:runReport`, {
      method: 'POST',
      body: JSON.stringify({ dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: 'yesterday' }], limit: 100, ...body }),
    }).then(flattenGa);

  report.ga4 = {
    property: property.property,
    name: property.displayName,
    channels: await run({
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagementRate' }, { name: 'keyEvents' }],
    }),
    sources: await run({
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'keyEvents' }],
    }),
    landingPages: await run({
      dimensions: [{ name: 'landingPagePlusQueryString' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'keyEvents' }],
    }),
    events: await run({ dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }] }),
    countries: await run({ dimensions: [{ name: 'country' }], metrics: [{ name: 'sessions' }] }),
    byWeek: await run({ dimensions: [{ name: 'isoYearIsoWeek' }], metrics: [{ name: 'sessions' }, { name: 'keyEvents' }] }),
  };
}
} catch (err) {
  report.ga4Error = err.message;
  console.log(`⚠️  GA4: ${err.message}`);
}

mkdirSync(OUT_DIR, { recursive: true });
const file = `${OUT_DIR}/insights-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(file, JSON.stringify(report, null, 2));
printSummary(report);
console.log(`\nRaw data: ${file}`);

// ── helpers ──────────────────────────────────────────────────────────────────
function printSummary(r) {
  if (r.gsc) {
    const t = r.gsc.totals[0] ?? { clicks: 0, impressions: 0 };
    console.log(`\nSearch Console (${r.gsc.property}, last ${DAYS} days)`);
    console.log(`  ${t.clicks} clicks · ${t.impressions} impressions · avg position ${t.position?.toFixed(1) ?? '–'}`);
    console.log('  Top queries:');
    for (const q of r.gsc.queries.slice(0, 15)) console.log(`    ${q.keys[0]} — ${q.impressions} impr, ${q.clicks} clicks, pos ${q.position.toFixed(1)}`);
    console.log('  Sitemaps:', r.gsc.sitemaps.map((s) => `${s.path} (errors ${s.errors ?? 0}, warnings ${s.warnings ?? 0}, last read ${s.lastDownloaded ?? 'never'})`).join('; ') || 'none submitted');
    if (r.gsc.inspection) {
      const indexed = r.gsc.inspection.filter((i) => i.verdict === 'PASS').length;
      console.log(`  Index status: ${indexed}/${r.gsc.inspection.length} sitemap URLs indexed`);
      for (const i of r.gsc.inspection.filter((x) => x.verdict !== 'PASS')) console.log(`    ✗ ${i.url} — ${i.coverage ?? i.error}`);
    }
  }
  if (r.ga4) {
    console.log(`\nGA4 (${r.ga4.name}, last ${DAYS} days)`);
    for (const c of r.ga4.channels) console.log(`  ${c.sessionDefaultChannelGroup}: ${c.sessions} sessions, ${c.keyEvents} key events`);
    console.log('  Events:', r.ga4.events.map((e) => `${e.eventName} ${e.eventCount}`).join(', '));
  }
}

function flattenGa(res) {
  const dims = (res.dimensionHeaders ?? []).map((h) => h.name);
  const mets = (res.metricHeaders ?? []).map((h) => h.name);
  return (res.rows ?? []).map((row) => ({
    ...Object.fromEntries(dims.map((d, i) => [d, row.dimensionValues[i].value])),
    ...Object.fromEntries(mets.map((m, i) => [m, Number(row.metricValues[i].value)])),
  }));
}

async function sitemapUrls(url) {
  const xml = await (await fetch(url)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}

async function gapi(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.error?.message ?? `HTTP ${res.status}`;
    if (/has not been used|is disabled/i.test(msg)) {
      throw new Error(`${msg}\n→ Enable it in Google Cloud (same project as the Ads OAuth client), wait a minute, re-run.`);
    }
    throw new Error(`${url} → ${msg}`);
  }
  return body;
}

async function getAccessToken() {
  const { GOOGLE_ADS_OAUTH_CLIENT_ID: id, GOOGLE_ADS_OAUTH_CLIENT_SECRET: secret, GOOGLE_INSIGHTS_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) {
    throw new Error('Missing GOOGLE_INSIGHTS_REFRESH_TOKEN — run node scripts/google-insights/get-refresh-token.mjs first.');
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secret, refresh_token: refresh, grant_type: 'refresh_token' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth refresh failed: ${data.error_description ?? data.error} — re-run get-refresh-token.mjs`);
  return data.access_token;
}

function loadEnv() {
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
