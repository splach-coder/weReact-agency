'use client';

import { useEffect, useState } from 'react';
import { History, UserRound, X } from 'lucide-react';
import { getWhatsAppHref, type CrmLead, type LeadEvent } from '@/lib/crm';
import { CopyButton, WhatsAppIcon } from './CopyButton';
import { LeadActivity } from './LeadEditor';

type DetailItem = {
  label: string;
  value: string;
};

type Panel = 'details' | 'activity' | null;

function phoneHref(value: string) {
  return 'tel:' + value.replace(/[^\d+]/g, '');
}

export function ClientDetailPanels({
  lead,
  events,
  received,
  clientId,
  acquisition,
  technical,
}: {
  lead: CrmLead;
  events: LeadEvent[];
  received: string;
  clientId?: string;
  acquisition: DetailItem[];
  technical: DetailItem[];
}) {
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => {
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [panel]);

  return (
    <>
      <div className="crm-client-tools" aria-label="Client record tools">
        <button type="button" onClick={() => setPanel('details')}>
          <UserRound size={16} /> Client details
        </button>
        <button type="button" onClick={() => setPanel('activity')}>
          <History size={16} /> Activity <span>{events.length}</span>
        </button>
      </div>

      {panel && (
        <div className="crm-drawer-layer">
          <button className="crm-drawer-backdrop" type="button" onClick={() => setPanel(null)} aria-label="Close panel" />
          <aside className="crm-side-drawer" role="dialog" aria-modal="true" aria-labelledby="crm-drawer-title">
            <header>
              <div>
                <p className="crm-eyebrow"><span /> Client record</p>
                <h2 id="crm-drawer-title">{panel === 'details' ? 'Client details' : 'Activity'}</h2>
              </div>
              <button className="crm-icon-button" type="button" onClick={() => setPanel(null)} aria-label="Close panel" title="Close">
                <X size={19} />
              </button>
            </header>

            <div className="crm-side-drawer__body">
              {panel === 'details' ? (
                <>
                  <section className="crm-drawer-section">
                    <h3>Contact</h3>
                    <dl className="crm-drawer-list">
                      <div>
                        <dt>Email</dt>
                        <dd>{lead.email ? <><a href={'mailto:' + lead.email}>{lead.email}</a><CopyButton value={lead.email} label="Copy email" /></> : <span>Not provided</span>}</dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{lead.phone ? <><a href={phoneHref(lead.phone)}>{lead.phone}</a><CopyButton value={lead.phone} label="Copy phone" /></> : <span>Not provided</span>}</dd>
                      </div>
                      <div>
                        <dt>WhatsApp</dt>
                        <dd>{lead.whatsapp ? <><a href={getWhatsAppHref(lead.whatsapp)} target="_blank" rel="noreferrer"><WhatsAppIcon size={15} /> {lead.whatsapp}</a><CopyButton value={lead.whatsapp} label="Copy WhatsApp" /></> : <span>Not provided</span>}</dd>
                      </div>
                      <div><dt>Company</dt><dd><strong>{lead.company || 'Not provided'}</strong></dd></div>
                      <div><dt>Received</dt><dd><strong>{received}</strong></dd></div>
                      <div><dt>Source</dt><dd><strong>{lead.source || 'Unknown'}</strong></dd></div>
                    </dl>
                  </section>

                  {acquisition.length > 0 && (
                    <details className="crm-drawer-disclosure">
                      <summary>Acquisition <span>{acquisition.length}</span></summary>
                      <dl className="crm-drawer-list">
                        {acquisition.map((item) => <div key={item.label}><dt>{item.label}</dt><dd><strong>{item.value}</strong></dd></div>)}
                      </dl>
                    </details>
                  )}

                  <details className="crm-drawer-disclosure">
                    <summary>Technical details <span>{technical.length + (clientId ? 2 : 1)}</span></summary>
                    <dl className="crm-drawer-list">
                      <div><dt>Lead ID</dt><dd><code>{lead.id}</code><CopyButton value={lead.id} label="Copy lead ID" /></dd></div>
                      {clientId && <div><dt>Client ID</dt><dd><code>{clientId}</code><CopyButton value={clientId} label="Copy client ID" /></dd></div>}
                      {technical.map((item) => <div key={item.label}><dt>{item.label}</dt><dd><code>{item.value}</code><CopyButton value={item.value} label={'Copy ' + item.label} /></dd></div>)}
                    </dl>
                  </details>
                </>
              ) : (
                <LeadActivity leadId={lead.id} events={events} embedded />
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
