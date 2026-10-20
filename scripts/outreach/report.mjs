// Outreach scoreboard: funnel totals, this week's activity, who needs a human today.
//   node scripts/outreach/report.mjs

import { DAY, loadLeads, readLog } from './_lib.mjs';

const leads = loadLeads();
const events = readLog();
const weekAgo = Date.now() - 7 * DAY;
const count = (status) => leads.filter((l) => l.status === status).length;
const week = (type) => events.filter((e) => e.type === type && Date.parse(e.at) >= weekAgo).length;

console.log('WeReact outreach');
console.log(`  leads ${leads.length} · queued ${count('queued')} · contacted ${count('contacted')} · replied ${count('replied')}`);
console.log(`  won ${count('won')} · lost ${count('lost')} · no reply ${count('no_reply')} · bounced ${count('bounced')} · stopped ${count('unsubscribed')}`);
console.log(`  last 7 days: ${week('sent')} emails sent · ${week('replied')} replies · ${week('bounced')} bounces`);

const replied = leads.filter((l) => l.status === 'replied');
if (replied.length) {
  console.log('\nNeeds a human (replied):');
  for (const l of replied) console.log(`  ★ ${l.name} <${l.email}>${l.whatsapp ? ` · ${l.whatsapp}` : ''}`);
}

const whatsapp = leads.filter((l) => l.channel === 'whatsapp' && l.status === 'queued');
if (whatsapp.length) console.log(`\nWhatsApp to send by hand: ${whatsapp.length} (see the daily pack)`);
