// Applies the audited rebuild to the live Google Ads account via the REST API.
// Steps (run one at a time, verify between):
//   node scripts/google-ads/apply-rebuild.mjs --pause     pause every enabled old campaign
//   node scripts/google-ads/apply-rebuild.mjs --goals     1 primary conversion (form lead), rest secondary
//   node scripts/google-ads/apply-rebuild.mjs --whatsapp  create the WhatsApp click conversion action
//   node scripts/google-ads/apply-rebuild.mjs --campaign  build the new Search campaign (PAUSED) from docs/google-ads-import/campaign.json
//   node scripts/google-ads/apply-rebuild.mjs --verify    read back the final state
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
const DT = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const CID = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/\D/g, '');
// The conversion action that carries the website tag label C9w5CPvkkc4cEIea_vtD.
const FORM_LEAD_ACTION_ID = '7680062075';

if (!CID) { console.error('Set GOOGLE_ADS_CUSTOMER_ID in .env.local'); process.exit(1); }

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
const ACCESS_TOKEN = (await tokenRes.json()).access_token;

const HEADERS = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'developer-token': DT,
  'Content-Type': 'application/json',
};

async function gaql(query) {
  const r = await fetch(`https://googleads.googleapis.com/${V}/customers/${CID}/googleAds:searchStream`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ query }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(apiError(data));
  return (Array.isArray(data) ? data : [data]).flatMap((b) => b.results || []);
}

async function mutate(service, operations) {
  const r = await fetch(`https://googleads.googleapis.com/${V}/customers/${CID}/${service}:mutate`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ operations }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(apiError(data));
  return data.results || [];
}

function apiError(data) {
  const err = Array.isArray(data) ? data[0]?.error : data?.error;
  if (!err) return 'Unknown API error';
  const details = err.details?.[0]?.errors?.map((e) => e.message).join(' | ');
  return `${err.status || err.code}: ${details || err.message}`;
}

const step = process.argv[2];

// ---------------------------------------------------------------- pause ----
if (step === '--pause') {
  const rows = await gaql("SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status = 'ENABLED'");
  if (!rows.length) { console.log('No enabled campaigns — nothing to pause.'); process.exit(0); }
  const results = await mutate('campaigns', rows.map((r) => ({
    update: { resourceName: `customers/${CID}/campaigns/${r.campaign.id}`, status: 'PAUSED' },
    updateMask: 'status',
  })));
  console.log(`Paused ${results.length} campaigns:`);
  for (const r of rows) console.log(`  ⏸ ${r.campaign.name}`);
}

// ---------------------------------------------------------------- goals ----
if (step === '--goals') {
  const rows = await gaql('SELECT conversion_action.id, conversion_action.name, conversion_action.category, conversion_action.primary_for_goal FROM conversion_action WHERE conversion_action.status = ENABLED');
  for (const r of rows) {
    const c = r.conversionAction;
    const isFormLead = String(c.id) === FORM_LEAD_ACTION_ID;
    const wants = isFormLead
      ? { category: 'SUBMIT_LEAD_FORM', primaryForGoal: true }
      : { primaryForGoal: false };
    const already = isFormLead
      ? c.category === 'SUBMIT_LEAD_FORM' && c.primaryForGoal === true
      : c.primaryForGoal === false;
    if (already) { console.log(`  = "${c.name}" already correct`); continue; }
    try {
      await mutate('conversionActions', [{
        update: { resourceName: `customers/${CID}/conversionActions/${c.id}`, ...wants },
        updateMask: isFormLead ? 'category,primary_for_goal' : 'primary_for_goal',
      }]);
      console.log(`  ✔ "${c.name}" -> ${isFormLead ? 'SUBMIT_LEAD_FORM + PRIMARY' : 'secondary'}`);
    } catch (error) {
      console.log(`  ✖ "${c.name}" rejected: ${error.message}`);
    }
  }
}

// ------------------------------------------------------------- whatsapp ----
if (step === '--whatsapp') {
  const existing = await gaql("SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'WhatsApp click'");
  if (existing.length) {
    console.log(`"WhatsApp click" already exists (id=${existing[0].conversionAction.id}).`);
  } else {
    await mutate('conversionActions', [{
      create: {
        name: 'WhatsApp click',
        type: 'WEBPAGE',
        category: 'CONTACT',
        status: 'ENABLED',
        countingType: 'ONE_PER_CLICK',
        primaryForGoal: false,
        valueSettings: { defaultValue: 1, defaultCurrencyCode: 'MAD', alwaysUseDefaultValue: true },
      },
    }]);
    console.log('Created "WhatsApp click" conversion action.');
  }
  const snip = await gaql("SELECT conversion_action.id, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.name = 'WhatsApp click'");
  const snippet = (snip[0]?.conversionAction.tagSnippets || []).find((s) => s.type === 'WEBPAGE' && s.pageFormat === 'HTML');
  const label = snippet?.eventSnippet?.match(/send_to['"]?\s*:\s*['"]AW-\d+\/([\w-]+)/)?.[1];
  console.log(`\nNEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=${label ?? 'LABEL_NOT_FOUND — check tag snippets manually'}`);
}

// ------------------------------------------------------------- campaign ----
if (step === '--campaign') {
  const plan = JSON.parse(readFileSync('docs/google-ads-import/campaign.json', 'utf8'));
  const name = plan.campaign.name;

  // Resume-safe: reuse the campaign if a previous run already created it.
  let campaignResource;
  const dupe = await gaql(`SELECT campaign.id FROM campaign WHERE campaign.name = '${name.replace(/'/g, "\\'")}'`);
  if (dupe.length) {
    campaignResource = `customers/${CID}/campaigns/${dupe[0].campaign.id}`;
    console.log(`= campaign already exists, resuming: ${campaignResource}`);
  } else {
    // 1. Budget (100 MAD/day).
    const [budget] = await mutate('campaignBudgets', [{
      create: { name: `${name} — budget`, amountMicros: String(plan.campaign.dailyBudgetMAD * 1_000_000), deliveryMethod: 'STANDARD', explicitlyShared: false },
    }]);
    console.log(`✔ budget: ${budget.resourceName}`);

    // 2. Campaign — Search only, PAUSED, Maximize Clicks with 5 MAD ceiling.
    const campaignPayload = {
      name,
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      campaignBudget: budget.resourceName,
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: false,
        targetContentNetwork: false,
        targetPartnerSearchNetwork: false,
      },
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE', negativeGeoTargetType: 'PRESENCE' },
      targetSpend: { cpcBidCeilingMicros: String(plan.campaign.maxCpcMAD * 1_000_000) },
      containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
    };
    let campaign;
    try {
      [campaign] = await mutate('campaigns', [{ create: campaignPayload }]);
    } catch (error) {
      if (/contains_?eu_?political/i.test(error.message) || /Unknown field/i.test(error.message)) {
        delete campaignPayload.containsEuPoliticalAdvertising;
        [campaign] = await mutate('campaigns', [{ create: campaignPayload }]);
      } else throw error;
    }
    campaignResource = campaign.resourceName;
    console.log(`✔ campaign (PAUSED): ${campaignResource}`);
  }

  // 3. Geo (Morocco, presence-only) + languages (EN, FR, AR) + negatives.
  //    Skipped when a previous run already attached them.
  const existingCriteria = await gaql(`SELECT campaign_criterion.criterion_id FROM campaign_criterion WHERE campaign.id = ${campaignResource.split('/').pop()} AND campaign_criterion.type IN (LOCATION, LANGUAGE, KEYWORD)`);
  if (existingCriteria.length) {
    console.log(`= campaign criteria already attached (${existingCriteria.length}) — skipping`);
  } else {
    const criteria = [
      { campaign: campaignResource, location: { geoTargetConstant: 'geoTargetConstants/2504' } },
      { campaign: campaignResource, language: { languageConstant: 'languageConstants/1000' } },
      { campaign: campaignResource, language: { languageConstant: 'languageConstants/1002' } },
      { campaign: campaignResource, language: { languageConstant: 'languageConstants/1019' } },
      ...plan.negativeKeywords.map((n) => ({
        campaign: campaignResource,
        negative: true,
        keyword: { text: n.text, matchType: n.match.toUpperCase() },
      })),
    ];
    const critResults = await mutate('campaignCriteria', criteria.map((c) => ({ create: c })));
    console.log(`✔ campaign criteria: ${critResults.length} (1 geo + 3 languages + ${plan.negativeKeywords.length} negatives)`);
  }

  // 4. Ad groups, keywords, RSAs (skips ad groups that already exist).
  const existingGroups = new Set(
    (await gaql(`SELECT ad_group.name FROM ad_group WHERE campaign.id = ${campaignResource.split('/').pop()}`)).map((r) => r.adGroup.name)
  );
  for (const g of plan.adGroups) {
    if (existingGroups.has(g.name)) { console.log(`= ad group "${g.name}" already exists — skipping`); continue; }
    const [adGroup] = await mutate('adGroups', [{
      create: {
        name: g.name,
        campaign: campaignResource,
        status: 'ENABLED',
        type: 'SEARCH_STANDARD',
        cpcBidMicros: String(plan.campaign.maxCpcMAD * 1_000_000),
      },
    }]);

    const kwResults = await mutate('adGroupCriteria', g.keywords.map((k) => ({
      create: { adGroup: adGroup.resourceName, status: 'ENABLED', keyword: { text: k.text, matchType: k.match.toUpperCase() } },
    })));

    await mutate('adGroupAds', [{
      create: {
        adGroup: adGroup.resourceName,
        status: 'ENABLED',
        ad: {
          finalUrls: [g.ad.finalUrl],
          responsiveSearchAd: {
            headlines: g.ad.headlines.map((text) => ({ text })),
            descriptions: g.ad.descriptions.map((text) => ({ text })),
            ...(g.ad.path1 ? { path1: g.ad.path1 } : {}),
            ...(g.ad.path2 ? { path2: g.ad.path2 } : {}),
          },
        },
      },
    }]);
    console.log(`✔ ad group "${g.name}": ${kwResults.length} keywords + 1 RSA`);
  }
  console.log('\nCampaign built. It is PAUSED — enable it from the UI on launch day.');
}

// --------------------------------------------------------------- verify ----
if (step === '--verify') {
  const camps = await gaql('SELECT campaign.name, campaign.status, campaign.advertising_channel_type FROM campaign ORDER BY campaign.id');
  console.log('Campaigns:');
  for (const r of camps) console.log(`  [${r.campaign.status}] ${r.campaign.name}`);

  const conv = await gaql('SELECT conversion_action.name, conversion_action.category, conversion_action.primary_for_goal FROM conversion_action WHERE conversion_action.status = ENABLED');
  console.log('\nConversion actions:');
  for (const r of conv) {
    const c = r.conversionAction;
    console.log(`  ${c.primaryForGoal ? 'PRIMARY  ' : 'secondary'} [${c.category}] ${c.name}`);
  }

  const newCamp = await gaql("SELECT campaign.id FROM campaign WHERE campaign.name LIKE 'WeReact%'");
  if (newCamp.length) {
    const id = newCamp[0].campaign.id;
    const ags = await gaql(`SELECT ad_group.name FROM ad_group WHERE campaign.id = ${id}`);
    const kws = await gaql(`SELECT ad_group_criterion.criterion_id FROM ad_group_criterion WHERE campaign.id = ${id} AND ad_group_criterion.type = KEYWORD AND ad_group_criterion.negative = FALSE`);
    const negs = await gaql(`SELECT campaign_criterion.criterion_id FROM campaign_criterion WHERE campaign.id = ${id} AND campaign_criterion.type = KEYWORD AND campaign_criterion.negative = TRUE`);
    const ads = await gaql(`SELECT ad_group_ad.ad.id FROM ad_group_ad WHERE campaign.id = ${id}`);
    console.log(`\nNew campaign structure: ${ags.length} ad groups, ${kws.length} keywords, ${negs.length} negatives, ${ads.length} ads`);
  }
}

if (!step) console.log('Usage: node scripts/google-ads/apply-rebuild.mjs --pause | --goals | --whatsapp | --campaign | --verify');
