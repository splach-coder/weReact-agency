// Pulls a diagnostic snapshot of the Google Ads account via the REST API.
// Zero dependencies. Run from the repo root:
//   npm run ads:list   -> list accessible accounts (use to confirm the connection)
//   npm run ads:pull   -> pull campaigns / networks / search terms / geo / keywords
//
// Reads credentials from .env.local (see README).

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

loadEnv();

const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || 'v21';
const CLIENT_ID = process.env.GOOGLE_ADS_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const CUSTOMER_ID = digits(process.env.GOOGLE_ADS_CUSTOMER_ID);
const LOGIN_CUSTOMER_ID = digits(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);

const mode = process.argv.includes('--list') ? 'list' : 'pull';

// Date filter that every query shares.
const START = process.env.GOOGLE_ADS_START_DATE;
const END = process.env.GOOGLE_ADS_END_DATE;
const DATE = START && END ? `BETWEEN '${START}' AND '${END}'` : 'DURING LAST_30_DAYS';

main().catch((error) => {
  console.error('\n❌ ' + error.message + '\n');
  process.exit(1);
});

async function main() {
  requireEnv([
    'GOOGLE_ADS_OAUTH_CLIENT_ID',
    'GOOGLE_ADS_OAUTH_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN',
    'GOOGLE_ADS_DEVELOPER_TOKEN',
  ]);

  const accessToken = await getAccessToken();

  if (mode === 'list') {
    await listAccounts(accessToken);
    return;
  }

  if (!CUSTOMER_ID) {
    throw new Error('Set GOOGLE_ADS_CUSTOMER_ID in .env.local (digits only). Run `npm run ads:list` to find it.');
  }

  mkdirSync('google-ads-report', { recursive: true });
  console.log(`\nPulling account ${CUSTOMER_ID} for range: ${DATE}\n`);

  const reports = {
    campaigns: `SELECT campaign.name, campaign.status, campaign.advertising_channel_type,
      metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions,
      metrics.average_cpc, metrics.ctr
      FROM campaign WHERE segments.date ${DATE} AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC`,

    networks: `SELECT campaign.name, segments.ad_network_type,
      metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions
      FROM campaign WHERE segments.date ${DATE} AND metrics.impressions > 0`,

    search_terms: `SELECT search_term_view.search_term, campaign.name,
      metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM search_term_view WHERE segments.date ${DATE}
      ORDER BY metrics.cost_micros DESC LIMIT 300`,

    geo: `SELECT geographic_view.country_criterion_id, geographic_view.location_type,
      metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM geographic_view WHERE segments.date ${DATE}
      ORDER BY metrics.cost_micros DESC LIMIT 100`,

    keywords: `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
      campaign.name, metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM keyword_view WHERE segments.date ${DATE}
      ORDER BY metrics.cost_micros DESC LIMIT 200`,
  };

  const totals = { cost: 0, clicks: 0, conversions: 0, impressions: 0 };
  const output = {};

  for (const [name, query] of Object.entries(reports)) {
    try {
      const rows = await search(accessToken, query);
      output[name] = rows;
      writeFileSync(`google-ads-report/${name}.json`, JSON.stringify(rows, null, 2));
      console.log(`  ${name.padEnd(14)} ${rows.length} rows -> google-ads-report/${name}.json`);
    } catch (error) {
      console.log(`  ${name.padEnd(14)} skipped (${error.message})`);
    }
  }

  // ---- console summary (this is what to paste back to Claude) ----
  const line = '\n' + '='.repeat(64);
  console.log(line);
  console.log('SUMMARY  (paste this back to Claude)');
  console.log('='.repeat(64));

  for (const c of output.campaigns || []) {
    const cost = micros(c.metrics?.costMicros);
    totals.cost += cost;
    totals.clicks += Number(c.metrics?.clicks || 0);
    totals.conversions += Number(c.metrics?.conversions || 0);
    totals.impressions += Number(c.metrics?.impressions || 0);
    console.log(
      `\n• ${c.campaign?.name} [${c.campaign?.advertisingChannelType} / ${c.campaign?.status}]` +
        `\n    cost ${cost.toFixed(2)} · impr ${c.metrics?.impressions} · clicks ${c.metrics?.clicks}` +
        ` · conv ${c.metrics?.conversions} · CTR ${(Number(c.metrics?.ctr || 0) * 100).toFixed(2)}%`
    );
  }

  console.log(
    `\nTOTAL: cost ${totals.cost.toFixed(2)} · impr ${totals.impressions} · ` +
      `clicks ${totals.clicks} · conversions ${totals.conversions}`
  );

  const byNetwork = {};
  for (const n of output.networks || []) {
    const net = n.segments?.adNetworkType || 'UNKNOWN';
    byNetwork[net] = (byNetwork[net] || 0) + micros(n.metrics?.costMicros);
  }
  console.log('\nSpend by network:');
  for (const [net, cost] of Object.entries(byNetwork).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${net.padEnd(22)} ${cost.toFixed(2)}`);
  }

  console.log('\nTop 15 search terms by spend:');
  for (const s of (output.search_terms || []).slice(0, 15)) {
    console.log(
      `    ${micros(s.metrics?.costMicros).toFixed(2).padStart(9)}  ` +
        `clk ${String(s.metrics?.clicks || 0).padStart(3)}  conv ${s.metrics?.conversions || 0}  ` +
        `"${s.searchTermView?.searchTerm}"`
    );
  }

  console.log('\nFull JSON saved in google-ads-report/. ' + line);
}

async function listAccounts(accessToken) {
  const res = await fetch(
    `https://googleads.googleapis.com/${API_VERSION}/customers:listAccessibleCustomers`,
    { headers: authHeaders(accessToken) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(apiError(data));
  console.log('\nAccessible accounts (customer IDs):');
  for (const name of data.resourceNames || []) console.log('    ' + name.replace('customers/', ''));
  console.log('\nSet the one you advertised with as GOOGLE_ADS_CUSTOMER_ID in .env.local.\n');
}

async function search(accessToken, query) {
  const res = await fetch(
    `https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/googleAds:searchStream`,
    { method: 'POST', headers: authHeaders(accessToken), body: JSON.stringify({ query }) }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(apiError(data));
  // searchStream returns an array of { results: [...] } batches.
  return (Array.isArray(data) ? data : [data]).flatMap((batch) => batch.results || []);
}

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
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
    'developer-token': DEVELOPER_TOKEN,
    'Content-Type': 'application/json',
  };
  if (LOGIN_CUSTOMER_ID) headers['login-customer-id'] = LOGIN_CUSTOMER_ID;
  return headers;
}

function apiError(data) {
  const err = Array.isArray(data) ? data[0]?.error : data?.error;
  if (!err) return 'Unknown API error';
  const detail = err.details?.[0]?.errors?.[0]?.message;
  return `${err.status || err.code}: ${detail || err.message}`;
}

function micros(v) {
  return Number(v || 0) / 1_000_000;
}

function digits(v) {
  return v ? String(v).replace(/\D/g, '') : '';
}

function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(
      `Missing in .env.local: ${missing.join(', ')}.\n   See scripts/google-ads/README.md to set these.`
    );
  }
}

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const rawLine of readFileSync(file, 'utf8').split('\n')) {
      const match = rawLine.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key] = match;
      let value = match[2].trim();
      if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}
