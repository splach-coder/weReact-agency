// Shared helpers for the cold-outreach autopilot.
// Lead data lives in /outreach-data (gitignored — the repo is public).

import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA_DIR = join(ROOT, 'outreach-data');
const LEADS_FILE = join(DATA_DIR, 'leads.json');
const LOG_FILE = join(DATA_DIR, 'log.jsonl');

export const FROM = 'Anas · WeReact <hello@wereact.agency>';
export const REPLY_TO = 'hello@wereact.agency';
export const DAY = 24 * 60 * 60 * 1000;

export function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key] = match;
      let value = match[2].trim();
      if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

export function loadLeads() {
  if (!existsSync(LEADS_FILE)) return [];
  return JSON.parse(readFileSync(LEADS_FILE, 'utf8'));
}

export function saveLeads(leads) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2) + '\n');
}

export function log(event) {
  mkdirSync(DATA_DIR, { recursive: true });
  appendFileSync(LOG_FILE, JSON.stringify({ at: new Date().toISOString(), ...event }) + '\n');
}

export function readLog() {
  if (!existsSync(LOG_FILE)) return [];
  return readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

/** YYYY-MM-DD in Morocco time, so "today's cap" matches the owner's day. */
export function moroccoDate(date = new Date()) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Africa/Casablanca' });
}

export async function resend(path, init = {}) {
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${path} ${res.status}: ${JSON.stringify(body)}`);
  return body;
}

/**
 * Senders who wrote to hello@ since `since`, lower-cased. Needs the Private
 * Email (Namecheap) mailbox password; returns null when not configured so the
 * caller can refuse to send follow-ups blind.
 */
export async function fetchReplySenders(since) {
  const password = process.env.OUTREACH_IMAP_PASSWORD;
  if (!password) return null;
  const { ImapFlow } = await import('imapflow');
  const client = new ImapFlow({
    host: process.env.OUTREACH_IMAP_HOST ?? 'mail.privateemail.com',
    port: 993,
    secure: true,
    auth: { user: process.env.OUTREACH_IMAP_USER ?? REPLY_TO, pass: password },
    logger: false,
  });
  await client.connect();
  const senders = new Set();
  try {
    for (const mailbox of ['INBOX', 'Spam', 'Junk']) {
      let lock;
      try {
        lock = await client.getMailboxLock(mailbox);
      } catch {
        continue; // folder doesn't exist on this account
      }
      try {
        for await (const msg of client.fetch({ since }, { envelope: true })) {
          for (const addr of msg.envelope?.from ?? []) {
            if (addr.address) senders.add(addr.address.toLowerCase());
          }
        }
      } finally {
        lock.release();
      }
    }
  } finally {
    await client.logout();
  }
  return senders;
}

export function domainOf(email) {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

const FREE_MAIL = new Set(['gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com', 'live.fr', 'icloud.com', 'menara.ma', 'aol.com']);

/** A reply counts if it comes from the lead's address, or anyone at their own (non-webmail) domain. */
export function hasReplied(lead, senders) {
  const email = lead.email.toLowerCase();
  if (senders.has(email)) return true;
  const domain = domainOf(email);
  if (FREE_MAIL.has(domain)) return false;
  return [...senders].some((s) => domainOf(s) === domain);
}
