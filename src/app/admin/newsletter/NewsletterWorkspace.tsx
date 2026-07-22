'use client';

import { useMemo, useState, useTransition } from 'react';
import { Mail, Search, Send, UserMinus, UserPlus } from 'lucide-react';
import type { NewsletterCampaign, NewsletterSubscriber } from '@/lib/operations';
import { sendNewsletterAction, setSubscriberStatusAction } from '../operations-actions';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function NewsletterWorkspace({ subscribers, campaigns }: { subscribers: NewsletterSubscriber[]; campaigns: NewsletterCampaign[] }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isPending, startTransition] = useTransition();
  const active = subscribers.filter((item) => item.status === 'subscribed');
  const filtered = useMemo(() => subscribers.filter((item) => item.email.toLowerCase().includes(query.trim().toLowerCase())), [subscribers, query]);

  function send(formData: FormData) {
    setResult('');
    startTransition(async () => {
      const response = await sendNewsletterAction({ subject: formData.get('subject'), preview: formData.get('preview'), message: formData.get('message') });
      setResult(response.ok ? `Campaign sent to ${response.sent} subscriber${response.sent === 1 ? '' : 's'}${response.failed ? `; ${response.failed} failed` : ''}.` : response.error || 'Could not send the campaign.');
    });
  }

  function toggle(email: string, status: NewsletterSubscriber['status']) {
    startTransition(async () => {
      const response = await setSubscriberStatusAction(email, status === 'subscribed' ? 'unsubscribed' : 'subscribed');
      if (!response.ok) setResult(response.error || 'Could not update the subscriber.');
    });
  }

  return (
    <main className="ops-main">
      <header className="ops-page-header"><div><p>Audience</p><h1>Newsletter</h1></div><span>{active.length} active {active.length === 1 ? 'subscriber' : 'subscribers'}</span></header>
      <section className="ops-newsletter-layout">
        <form action={send} className="ops-panel ops-composer">
          <header><div><p>New campaign</p><h2>Write to your audience</h2></div><Mail size={19} /></header>
          <label><span>Subject</span><input name="subject" required maxLength={120} placeholder="A useful reason to open this email" /></label>
          <label><span>Inbox preview</span><input name="preview" required maxLength={180} placeholder="One clear sentence that supports the subject" /></label>
          <label><span>Message</span><textarea name="message" required minLength={20} maxLength={12000} placeholder={'Write naturally. Use a blank line between paragraphs.\n\nEvery subscriber receives a private email with an unsubscribe link.'} /></label>
          <footer><span><strong>{active.length}</strong> recipients</span><button type="submit" disabled={isPending || active.length === 0}><Send size={16} /> {isPending ? 'Sending…' : 'Send campaign'}</button></footer>
          {result && <p className={`ops-form-result${result.startsWith('Campaign sent') ? ' is-success' : ' is-error'}`} role="status">{result}</p>}
        </form>

        <section className="ops-panel ops-campaign-history">
          <header><div><p>Delivery</p><h2>Campaign history</h2></div></header>
          {campaigns.length ? <div>{campaigns.map((campaign) => <article key={campaign.id}><span className={`ops-campaign-status is-${campaign.status}`}>{campaign.status}</span><strong>{campaign.subject}</strong><small>{formatDate(campaign.sent_at ?? campaign.created_at)} · {campaign.sent_count}/{campaign.audience_count} delivered</small></article>)}</div> : <div className="ops-panel-empty">Your sent campaigns will appear here.</div>}
        </section>
      </section>

      <section className="ops-panel ops-audience">
        <header><div><p>Contacts</p><h2>Subscribers</h2></div><div className="ops-compact-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search email" aria-label="Search subscribers" /></div></header>
        <div className="ops-audience-list">
          {filtered.map((subscriber) => <article key={subscriber.email}><span className={`ops-subscriber-icon is-${subscriber.status}`}>{subscriber.status === 'subscribed' ? <UserPlus size={15} /> : <UserMinus size={15} />}</span><span><strong>{subscriber.email}</strong><small>{subscriber.locale.toUpperCase()} · {subscriber.source} · joined {formatDate(subscriber.consented_at)}</small></span><button type="button" onClick={() => toggle(subscriber.email, subscriber.status)} disabled={isPending}>{subscriber.status === 'subscribed' ? 'Unsubscribe' : 'Restore'}</button></article>)}
          {!filtered.length && <div className="ops-panel-empty">No subscribers match this search.</div>}
        </div>
      </section>
    </main>
  );
}
