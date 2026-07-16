// Applies profile.json (description, website, categories) to the location.
// Dry-run by default — prints the current values + the patch it WOULD send.
// Pass --apply to actually write.
//
//   npm run gbp:apply            # dry run (safe — shows the diff)
//   npm run gbp:apply -- --apply # write the changes
//
// Needs GOOGLE_BUSINESS_LOCATION_ID in .env.local (from `npm run gbp:pull`).
//
// NOTE: the Business Information API does NOT support the services-with-prices
// list — that stays a manual GBP edit. This script covers description,
// website, and categories (the parts the API allows).

import { readFileSync } from 'node:fs';
import { loadEnv, getAccessToken, api, INFO } from './_lib.mjs';

loadEnv();

const apply = process.argv.includes('--apply');
const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

if (!locationId) {
  console.error('Missing GOOGLE_BUSINESS_LOCATION_ID in .env.local. Run `npm run gbp:pull` first.');
  process.exit(1);
}

const desired = JSON.parse(readFileSync('scripts/google-business/profile.json', 'utf8'));
const token = await getAccessToken();

// Read current state for the fields we manage.
const readMask = 'name,title,websiteUri,categories,profile';
const current = await api(token, `${INFO}/${locationId}?readMask=${readMask}`);

console.log(`\nLocation: ${current.title} (${current.name})`);
console.log('Current website  :', current.websiteUri || '(none)');
console.log('Current primary  :', current.categories?.primaryCategory?.name || '(none)');
console.log('Current desc set :', current.profile?.description ? 'yes' : 'no');

// Build the patch body + updateMask.
const body = {};
const mask = [];

if (desired.description) {
  body.profile = { description: desired.description };
  mask.push('profile.description');
}
if (desired.websiteUri) {
  body.websiteUri = desired.websiteUri;
  mask.push('websiteUri');
}
if (desired.primaryCategory) {
  body.categories = {
    primaryCategory: { name: desired.primaryCategory },
    additionalCategories: (desired.additionalCategories || []).map((name) => ({ name })),
  };
  mask.push('categories');
}

console.log('\nWill update fields:', mask.join(', ') || '(nothing)');

if (!apply) {
  console.log('\n[dry run] Patch body that WOULD be sent:\n');
  console.log(JSON.stringify(body, null, 2));
  console.log('\nRe-run with `-- --apply` to write these changes.\n');
  process.exit(0);
}

const url = `${INFO}/${locationId}?updateMask=${encodeURIComponent(mask.join(','))}`;
const result = await api(token, url, { method: 'PATCH', body });
console.log('\n✅ Applied. Updated location:');
console.log(`   website : ${result.websiteUri || '(none)'}`);
console.log(`   primary : ${result.categories?.primaryCategory?.name || '(none)'}`);
console.log(`   desc set: ${result.profile?.description ? 'yes' : 'no'}\n`);
