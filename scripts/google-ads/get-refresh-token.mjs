// Mints a Google Ads API refresh token via the OAuth loopback flow.
// Zero dependencies — uses native fetch + node:http. Run from the repo root:
//   npm run ads:token
//
// Requires GOOGLE_ADS_OAUTH_CLIENT_ID and GOOGLE_ADS_OAUTH_CLIENT_SECRET in
// .env.local (from a "Desktop app" OAuth client — see README step 2).

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const SCOPE = 'https://www.googleapis.com/auth/adwords';
const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

loadEnv();

const CLIENT_ID = process.env.GOOGLE_ADS_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\nMissing GOOGLE_ADS_OAUTH_CLIENT_ID / GOOGLE_ADS_OAUTH_CLIENT_SECRET in .env.local.\n' +
      'Create a "Desktop app" OAuth client (README step 2) and add both values first.\n'
  );
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  }).toString();

const server = createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith('/oauth2callback')) {
    res.writeHead(404).end();
    return;
  }

  const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
  if (!code) {
    res.writeHead(400).end('No authorization code returned.');
    return;
  }

  try {
    const token = await exchangeCodeForToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      '<h2>Done. You can close this tab and return to the terminal.</h2>'
    );

    if (token.refresh_token) {
      console.log('\n✅ Refresh token minted. Add this line to .env.local:\n');
      console.log(`GOOGLE_ADS_REFRESH_TOKEN=${token.refresh_token}\n`);
    } else {
      console.error(
        '\n⚠️  No refresh_token in the response. Google only returns one on first consent.\n' +
          'Revoke the app at https://myaccount.google.com/permissions and run this again.\n' +
          JSON.stringify(token, null, 2)
      );
    }
  } catch (error) {
    console.error('\nToken exchange failed:', error.message);
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT, () => {
  console.log('\nOpening Google consent screen in your browser...');
  console.log('If it does not open, paste this URL manually:\n');
  console.log(authUrl + '\n');
  openBrowser(authUrl);
});

async function exchangeCodeForToken(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || `HTTP ${res.status}`);
  return data;
}

function openBrowser(url) {
  const commands = {
    win32: ['cmd', ['/c', 'start', '', url]],
    darwin: ['open', [url]],
    linux: ['xdg-open', [url]],
  };
  const entry = commands[process.platform];
  if (!entry) return;
  try {
    spawn(entry[0], entry[1], { stdio: 'ignore', detached: true }).unref();
  } catch {
    // Fine — the URL was printed above for manual use.
  }
}

// Minimal .env.local / .env loader so we don't need a dotenv dependency.
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
