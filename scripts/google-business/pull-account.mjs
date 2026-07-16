// Pulls your GBP account + location(s) so we can grab the IDs to write into
// .env.local, and looks up category resource names (gcid:*) needed to apply.
//
//   npm run gbp:pull                      # list accounts + locations
//   npm run gbp:pull -- --categories web  # search categories matching "web" (MA/fr)
//
// After this, add to .env.local:
//   GOOGLE_BUSINESS_ACCOUNT_ID=accounts/1234567890
//   GOOGLE_BUSINESS_LOCATION_ID=locations/0987654321

import { loadEnv, getAccessToken, api, ACCOUNTS, INFO } from './_lib.mjs';

loadEnv();

const args = process.argv.slice(2);
const catFlag = args.indexOf('--categories');
const catQuery = catFlag !== -1 ? args[catFlag + 1] : null;

const regionCode = process.env.GOOGLE_BUSINESS_REGION || 'MA';
const languageCode = process.env.GOOGLE_BUSINESS_LANGUAGE || 'fr';

const token = await getAccessToken();

if (catQuery) {
  const url =
    `${INFO}/categories?` +
    new URLSearchParams({
      regionCode,
      languageCode,
      view: 'BASIC',
      filter: `displayName=${catQuery}`,
      pageSize: '20',
    });
  const data = await api(token, url);
  const cats = data.categories || [];
  if (!cats.length) {
    console.log(`No categories matched "${catQuery}" in ${regionCode}/${languageCode}.`);
  } else {
    console.log(`\nCategories matching "${catQuery}" (${regionCode}/${languageCode}):\n`);
    for (const c of cats) console.log(`  ${c.name}   ${c.displayName}`);
    console.log('\nCopy the "categories/gcid:*" name into profile.json.\n');
  }
} else {
  const { accounts = [] } = await api(token, `${ACCOUNTS}/accounts`);
  if (!accounts.length) {
    console.log('No accounts returned. Is the API access request approved for this account?');
  }
  for (const acct of accounts) {
    console.log(`\nAccount: ${acct.name}   (${acct.accountName || acct.type})`);
    const readMask =
      'name,title,storefrontAddress,phoneNumbers,websiteUri,categories,profile,regularHours';
    const url = `${INFO}/${acct.name}/locations?readMask=${readMask}&pageSize=100`;
    const { locations = [] } = await api(token, url);
    if (!locations.length) {
      console.log('  (no locations)');
      continue;
    }
    for (const loc of locations) {
      console.log(`  Location: ${loc.name}   "${loc.title}"`);
      console.log(`    website: ${loc.websiteUri || '(none)'}`);
      console.log(
        `    primary category: ${loc.categories?.primaryCategory?.name || '(none)'} ` +
          `(${loc.categories?.primaryCategory?.displayName || ''})`
      );
      console.log(`    description set: ${loc.profile?.description ? 'yes' : 'no'}`);
    }
  }
  console.log(
    '\nAdd the account + location names to .env.local as ' +
      'GOOGLE_BUSINESS_ACCOUNT_ID and GOOGLE_BUSINESS_LOCATION_ID.\n'
  );
}
