// Attaches ad assets (callouts, sitelinks, structured snippet, call button)
// to the rebuilt campaign — EN assets at campaign level, FR variants at the
// FR ad-group level so French searchers see French extensions.
//   node scripts/google-ads/apply-assets.mjs
import { readFileSync, existsSync } from 'node:fs';

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    if (!existsSync(f)) continue;
    for (const l of readFileSync(f, 'utf8').split('\n')) {
      const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim();
      if (/^(".*"|'.*')$/.test(v)) v = v.slice(1, -1);
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
  }
}
loadEnv();

const V = process.env.GOOGLE_ADS_API_VERSION || 'v21';
const CID = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/\D/g, '');
const CAMPAIGN_NAME = 'WeReact — Search — Morocco';

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  }),
});
const HEADERS = {
  Authorization: `Bearer ${(await tokenRes.json()).access_token}`,
  'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  'Content-Type': 'application/json',
};

async function gaql(query) {
  const r = await fetch(`https://googleads.googleapis.com/${V}/customers/${CID}/googleAds:searchStream`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ query }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(apiErr(data));
  return (Array.isArray(data) ? data : [data]).flatMap((b) => b.results || []);
}
async function mutate(service, operations) {
  const r = await fetch(`https://googleads.googleapis.com/${V}/customers/${CID}/${service}:mutate`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ operations }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(apiErr(data));
  return data.results || [];
}
function apiErr(data) {
  const err = Array.isArray(data) ? data[0]?.error : data?.error;
  return `${err?.status || err?.code}: ${err?.details?.[0]?.errors?.map((e) => e.message).join(' | ') || err?.message}`;
}

const camp = await gaql(`SELECT campaign.id FROM campaign WHERE campaign.name = '${CAMPAIGN_NAME.replace(/'/g, "\\'")}'`);
if (!camp.length) { console.error('Campaign not found'); process.exit(1); }
const campaignResource = `customers/${CID}/campaigns/${camp[0].campaign.id}`;

const frGroups = await gaql(`SELECT ad_group.id, ad_group.name FROM ad_group WHERE campaign.id = ${camp[0].campaign.id} AND ad_group.name LIKE '%(FR)'`);
const frGroupResources = frGroups.map((r) => `customers/${CID}/adGroups/${r.adGroup.id}`);

// Idempotency: skip everything if the campaign already has linked assets.
const existing = await gaql(`SELECT campaign_asset.asset FROM campaign_asset WHERE campaign_asset.campaign = '${campaignResource}'`);
if (existing.length) { console.log(`Campaign already has ${existing.length} linked assets — aborting to avoid duplicates.`); process.exit(0); }

// ---- create assets ---------------------------------------------------------
const EN_CALLOUTS = ['Free Quote', 'Reply in 1 Business Day', 'English & French', 'Mobile-First Design', 'SEO-Ready Websites'];
const FR_CALLOUTS = ['Devis Gratuit', 'Réponse Sous Un Jour Ouvré', 'Lancement Rapide', 'Basés à Marrakech'];
const EN_SITELINKS = [
  { text: 'Our Work', url: 'https://www.wereact.agency/en/work' },
  { text: 'Our Services', url: 'https://www.wereact.agency/en' },
  { text: 'Blog & Guides', url: 'https://www.wereact.agency/en/blog' },
  { text: 'Contact Us', url: 'https://www.wereact.agency/en/contact' },
];
const FR_SITELINKS = [
  { text: 'Nos Réalisations', url: 'https://www.wereact.agency/fr/work' },
  { text: 'Nos Services', url: 'https://www.wereact.agency/fr' },
  { text: 'Blog & Guides', url: 'https://www.wereact.agency/fr/blog' },
  { text: 'Contactez-Nous', url: 'https://www.wereact.agency/fr/contact' },
];
const SNIPPET = { header: 'Services', values: ['Business Websites', 'Landing Pages', 'E-commerce', 'Tourism Sites'] };
const PHONE = '+212602258009';

// FR callout "Réponse Sous Un Jour Ouvré" is 26 chars — over the 25 limit; trim set.
const frCallouts = FR_CALLOUTS.map((t) => (t.length > 25 ? 'Réponse Rapide' : t));

const calloutOps = [...EN_CALLOUTS, ...frCallouts].map((text) => ({ create: { calloutAsset: { calloutText: text } } }));
const sitelinkOps = [...EN_SITELINKS, ...FR_SITELINKS].map((s) => ({
  create: { finalUrls: [s.url], sitelinkAsset: { linkText: s.text } },
}));
const snippetOps = [{ create: { structuredSnippetAsset: { header: SNIPPET.header, values: SNIPPET.values } } }];
const callOps = [{ create: { callAsset: { countryCode: 'MA', phoneNumber: PHONE } } }];

const created = await mutate('assets', [...calloutOps, ...sitelinkOps, ...snippetOps, ...callOps]);
const resources = created.map((r) => r.resourceName);
const enCalloutAssets = resources.slice(0, EN_CALLOUTS.length);
const frCalloutAssets = resources.slice(EN_CALLOUTS.length, EN_CALLOUTS.length + frCallouts.length);
const enSitelinkAssets = resources.slice(calloutOps.length, calloutOps.length + EN_SITELINKS.length);
const frSitelinkAssets = resources.slice(calloutOps.length + EN_SITELINKS.length, calloutOps.length + sitelinkOps.length);
const snippetAsset = resources[calloutOps.length + sitelinkOps.length];
const callAsset = resources[calloutOps.length + sitelinkOps.length + 1];
console.log(`✔ created ${resources.length} assets`);

// ---- link: EN + shared assets at campaign level ----------------------------
const campaignLinks = [
  ...enCalloutAssets.map((asset) => ({ campaign: campaignResource, asset, fieldType: 'CALLOUT' })),
  ...enSitelinkAssets.map((asset) => ({ campaign: campaignResource, asset, fieldType: 'SITELINK' })),
  { campaign: campaignResource, asset: snippetAsset, fieldType: 'STRUCTURED_SNIPPET' },
  { campaign: campaignResource, asset: callAsset, fieldType: 'CALL' },
];
await mutate('campaignAssets', campaignLinks.map((l) => ({ create: l })));
console.log(`✔ linked ${campaignLinks.length} assets at campaign level (EN callouts/sitelinks + snippet + call)`);

// ---- link: FR assets at the FR ad-group level (override EN there) ----------
const adGroupLinks = frGroupResources.flatMap((adGroup) => [
  ...frCalloutAssets.map((asset) => ({ adGroup, asset, fieldType: 'CALLOUT' })),
  ...frSitelinkAssets.map((asset) => ({ adGroup, asset, fieldType: 'SITELINK' })),
]);
await mutate('adGroupAssets', adGroupLinks.map((l) => ({ create: l })));
console.log(`✔ linked FR callouts+sitelinks on ${frGroupResources.length} FR ad groups (${adGroupLinks.length} links)`);
console.log('\nAssets complete.');
