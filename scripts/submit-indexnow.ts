import sitemap from '../src/app/sitemap';
import {
  createIndexNowPayload,
  isAcceptedIndexNowStatus,
} from '../src/lib/indexnow';

const INDEXNOW_KEY = '7c48682a-ebbb-4816-83b4-28ae3c0a2cc3';
const payload = createIndexNowPayload(
  sitemap().map((entry) => entry.url),
  INDEXNOW_KEY
);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(15_000),
});

if (!isAcceptedIndexNowStatus(response.status)) {
  const detail = await response.text();
  console.error(
    `IndexNow rejected ${payload.urlList.length} URLs (${response.status}): ${detail}`
  );
  process.exitCode = 1;
} else {
  console.log(
    `IndexNow accepted ${payload.urlList.length} canonical URLs (${response.status}).`
  );
}