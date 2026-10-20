// Daily cold-outreach run: bounce + reply check, follow-ups, then new first emails.
//
//   node scripts/outreach/send.mjs            # send for real
//   node scripts/outreach/send.mjs --dry-run  # print what would go out
//
// Rules: weekdays only, OUTREACH_DAILY_CAP (default 10) emails per Morocco day,
// every lead gets at most 3 emails (day 0 / 3 / 8), and the sequence stops the
// moment they reply, bounce or say stop. Follow-ups never go out unless the
// hello@ inbox can be checked for replies (OUTREACH_IMAP_PASSWORD).

import { randomUUID } from 'node:crypto';
import {
  DAY, FROM, REPLY_TO, fetchReplySenders, hasReplied, loadEnv, loadLeads,
  log, moroccoDate, readLog, resend, saveLeads,
} from './_lib.mjs';

loadEnv();
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--any-day');
const CAP = Number(process.env.OUTREACH_DAILY_CAP ?? 10);

const SIGNATURE = {
  fr: 'Anas\nWeReact — studio web à Marrakech\nwereact.agency · WhatsApp +212 602-258009',
  en: 'Anas\nWeReact — web studio in Marrakech\nwereact.agency · WhatsApp +212 602-258009',
};

const OPT_OUT = {
  fr: 'Pas le bon moment ? Répondez simplement « stop » et je ne vous écrirai plus.',
  en: 'Not relevant? Just reply "stop" and I won\'t write again.',
};

const FOLLOW_UPS = {
  2: {
    fr: () =>
      'Bonjour,\n\nJe me permets de relancer mon message — je sais que la saison est chargée.\n\n' +
      'Si c\'est utile, je peux vous préparer une maquette gratuite de votre futur site, sans engagement. ' +
      'Un simple « oui » en réponse suffit.',
    en: () =>
      'Hi,\n\nJust bumping my note in case it got buried — I know the season is busy.\n\n' +
      'If it helps, I can put together a free mock-up of your new site, no strings attached. ' +
      'A simple "yes" is enough.',
  },
  3: {
    fr: () =>
      'Bonjour,\n\nDernier message pour ne pas vous déranger. Si un jour vous voulez un site qui ramène ' +
      'des réservations en direct (sans commission), ma porte reste ouverte : https://www.wereact.agency/fr/contact\n\n' +
      'Belle saison !',
    en: () =>
      'Hi,\n\nLast note so I don\'t clutter your inbox. If you ever want a site that brings direct, ' +
      'commission-free bookings, the door is open: https://www.wereact.agency/en/contact\n\n' +
      'Have a great season!',
  },
};

const isWeekend = () => {
  const day = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Casablanca', weekday: 'short' });
  return day === 'Sat' || day === 'Sun';
};

function compose(lead, n) {
  const lang = lead.lang === 'en' ? 'en' : 'fr';
  if (n === 1) {
    return {
      subject: lead.first_email.subject,
      text: `${lead.first_email.body.trim()}\n\n${SIGNATURE[lang]}\n\n${OPT_OUT[lang]}`,
    };
  }
  return {
    subject: `Re: ${lead.first_email.subject}`,
    text: `${FOLLOW_UPS[n][lang]()}\n\n${SIGNATURE[lang]}\n\n${OPT_OUT[lang]}`,
  };
}

async function sendTouch(lead, n) {
  const { subject, text } = compose(lead, n);
  const messageId = `<${randomUUID()}@wereact.agency>`;
  const thread = lead.touches[0]?.message_id;
  const headers = {
    'Message-ID': messageId,
    'List-Unsubscribe': `<mailto:${REPLY_TO}?subject=stop>`,
    ...(thread ? { 'In-Reply-To': thread, References: lead.touches.map((t) => t.message_id).join(' ') } : {}),
  };

  if (DRY) {
    console.log(`\n── [dry] touch ${n} → ${lead.name} <${lead.email}>\nSubject: ${subject}\n\n${text}\n`);
    return;
  }
  const { id } = await resend('/emails', {
    method: 'POST',
    body: JSON.stringify({ from: FROM, to: [lead.email], reply_to: REPLY_TO, subject, text, headers }),
  });
  lead.touches.push({ n, at: new Date().toISOString(), resend_id: id, message_id: messageId, subject });
  lead.status = 'contacted';
  log({ type: 'sent', lead: lead.id, n, resend_id: id });
  console.log(`✓ touch ${n} → ${lead.name} <${lead.email}> (${id})`);
  await new Promise((r) => setTimeout(r, 8000 + Math.random() * 20000)); // don't burst
}

async function refreshDelivery(leads) {
  for (const lead of leads.filter((l) => l.status === 'contacted')) {
    const last = lead.touches.at(-1);
    if (!last?.resend_id || last.final_event) continue;
    try {
      const email = await resend(`/emails/${last.resend_id}`);
      if (email.last_event === 'bounced' || email.last_event === 'complained') {
        lead.status = email.last_event === 'bounced' ? 'bounced' : 'unsubscribed';
        last.final_event = email.last_event;
        log({ type: email.last_event, lead: lead.id });
        console.log(`✗ ${email.last_event}: ${lead.name}`);
      } else if (email.last_event === 'delivered') {
        last.final_event = 'delivered';
      }
    } catch (err) {
      console.warn(`! delivery check failed for ${lead.name}: ${err.message}`);
    }
  }
}

async function main() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY missing from .env.local');
  if (isWeekend() && !FORCE) {
    console.log('Weekend — no sends.');
    return;
  }

  const leads = loadLeads();
  const today = moroccoDate();
  const sentToday = readLog().filter((e) => e.type === 'sent' && moroccoDate(new Date(e.at)) === today).length;
  let budget = Math.max(0, CAP - sentToday);
  console.log(`${leads.length} leads · ${sentToday} sent today · budget ${budget}${DRY ? ' · DRY RUN' : ''}`);

  await refreshDelivery(leads);

  const contacted = leads.filter((l) => l.status === 'contacted' && l.email);
  let senders = null;
  if (contacted.length) {
    const earliest = new Date(Math.min(...contacted.map((l) => Date.parse(l.touches[0].at))));
    try {
      senders = await fetchReplySenders(earliest);
    } catch (err) {
      console.warn(`! inbox check failed: ${err.message}`);
    }
    if (senders) {
      for (const lead of contacted) {
        if (!hasReplied(lead, senders)) continue;
        lead.status = 'replied';
        log({ type: 'replied', lead: lead.id });
        console.log(`★ REPLIED: ${lead.name} <${lead.email}> — answer them in hello@ today`);
      }
    } else {
      console.warn('! No inbox access (OUTREACH_IMAP_PASSWORD) — follow-ups paused so nobody who replied gets chased.');
    }
  }

  // Follow-ups first: they convert better than new first touches.
  const now = Date.now();
  if (senders) {
    for (const lead of leads.filter((l) => l.status === 'contacted')) {
      const first = Date.parse(lead.touches[0].at);
      const n = lead.touches.length;
      if (n === 3 && now - first >= 14 * DAY) {
        lead.status = 'no_reply';
        log({ type: 'closed_no_reply', lead: lead.id });
        continue;
      }
      const next = n === 1 && now - first >= 3 * DAY ? 2 : n === 2 && now - first >= 8 * DAY ? 3 : null;
      if (!next || budget <= 0) continue;
      await sendTouch(lead, next);
      budget--;
      if (!DRY) saveLeads(leads);
    }
  }

  const fresh = leads
    .filter((l) => l.status === 'queued' && l.channel === 'email' && l.email && l.first_email)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  for (const lead of fresh) {
    if (budget <= 0) break;
    await sendTouch(lead, 1);
    budget--;
    if (!DRY) saveLeads(leads);
  }

  if (!DRY) saveLeads(leads);
  const left = leads.filter((l) => l.status === 'queued' && l.channel === 'email' && l.first_email).length;
  console.log(`Done. ${left} first emails still queued.`);
  if (left < 10) console.log('! Queue running low — ask Claude for a new lead batch.');
}

main().catch((err) => {
  console.error(err);
  log({ type: 'error', message: String(err.message ?? err) });
  process.exit(1);
});
