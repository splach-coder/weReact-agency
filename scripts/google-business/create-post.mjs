// Publishes a Google Business Profile "update" post (v4 localPosts API).
//   npm run gbp:post -- "Your post text here"
//   npm run gbp:post -- --file scripts/google-business/post.txt
//
// Adds a "Call now" action button pointing at the phone by default.
// Needs GOOGLE_BUSINESS_ACCOUNT_ID + GOOGLE_BUSINESS_LOCATION_ID in .env.local.

import { readFileSync } from 'node:fs';
import { loadEnv, getAccessToken, api, V4 } from './_lib.mjs';

loadEnv();

const args = process.argv.slice(2);
const fileFlag = args.indexOf('--file');
let summary;
if (fileFlag !== -1) {
  summary = readFileSync(args[fileFlag + 1], 'utf8').trim();
} else {
  summary = args.filter((a) => !a.startsWith('--')).join(' ').trim();
}

if (!summary) {
  console.error('Provide post text: npm run gbp:post -- "text"  (or --file path)');
  process.exit(1);
}

const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID; // accounts/123
const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID; // locations/456
if (!accountId || !locationId) {
  console.error('Missing GOOGLE_BUSINESS_ACCOUNT_ID / GOOGLE_BUSINESS_LOCATION_ID (run gbp:pull).');
  process.exit(1);
}

const websiteUri = process.env.GOOGLE_BUSINESS_WEBSITE || 'https://www.wereact.agency';
const token = await getAccessToken();

// v4 path is accounts/{aid}/locations/{lid}/localPosts — strip the resource prefixes.
const acct = accountId.replace(/^accounts\//, '');
const loc = locationId.replace(/^locations\//, '');
const url = `${V4}/accounts/${acct}/locations/${loc}/localPosts`;

const body = {
  languageCode: 'fr',
  summary,
  topicType: 'STANDARD',
  callToAction: { actionType: 'LEARN_MORE', url: websiteUri },
};

const result = await api(token, url, { method: 'POST', body });
console.log('\n✅ Post published.');
console.log(`   name : ${result.name}`);
console.log(`   state: ${result.state}\n`);
