'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, UserPlus, X } from 'lucide-react';
import { createManualLeadAction } from './actions';

const SOURCES = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone call' },
  { value: 'referral', label: 'Referral' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'walk_in', label: 'In person' },
  { value: 'other', label: 'Other' },
] as const;

const EMPTY_FORM = {
  name: '',
  source: 'whatsapp',
  email: '',
  phone: '',
  whatsapp: '',
  company: '',
  message: '',
};

export function ManualLeadDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isPending, onClose, open]);

  if (!open) return null;

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Add the client name.');
      return;
    }
    if (![form.email, form.phone, form.whatsapp].some((value) => value.trim())) {
      setError('Add an email, phone number, or WhatsApp number.');
      return;
    }

    startTransition(async () => {
      const result = await createManualLeadAction(form);
      if (!result.ok || !result.leadId) {
        setError(result.error || 'Could not add this client.');
        return;
      }

      setForm(EMPTY_FORM);
      onClose();
      router.push(`/admin/leads/${result.leadId}`);
      router.refresh();
    });
  }

  return (
    <div className="crm-drawer-layer">
      <button
        className="crm-drawer-backdrop"
        type="button"
        onClick={isPending ? undefined : onClose}
        aria-label="Close new client form"
      />
      <aside className="crm-side-drawer crm-manual-lead-drawer" role="dialog" aria-modal="true" aria-labelledby="crm-new-client-title">
        <header>
          <div>
            <p className="crm-eyebrow"><span /> New enquiry</p>
            <h2 id="crm-new-client-title">Add a client</h2>
          </div>
          <button className="crm-icon-button" type="button" onClick={onClose} disabled={isPending} aria-label="Close form" title="Close">
            <X size={19} />
          </button>
        </header>

        <form className="crm-manual-lead-form" onSubmit={submit} noValidate>
          <div className="crm-manual-lead-form__intro">
            <UserPlus size={18} />
            <p>Add enquiries received by phone, WhatsApp, referrals, social media, or in person.</p>
          </div>

          <div className="crm-form-row crm-form-row--two">
            <label>
              <span>Name <b>*</b></span>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} autoComplete="name" autoFocus required />
            </label>
            <label>
              <span>Source <b>*</b></span>
              <select value={form.source} onChange={(event) => updateField('source', event.target.value)} required>
                {SOURCES.map((source) => <option value={source.value} key={source.value}>{source.label}</option>)}
              </select>
            </label>
          </div>

          <div className="crm-manual-contact-group">
            <div>
              <h3>Contact details</h3>
              <p>At least one is required.</p>
            </div>
            <label>
              <span>WhatsApp</span>
              <input type="tel" value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} autoComplete="tel" placeholder="+212 6 00 00 00 00" />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} autoComplete="tel" placeholder="+212 6 00 00 00 00" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" placeholder="client@company.com" />
            </label>
          </div>

          <label>
            <span>Company</span>
            <input value={form.company} onChange={(event) => updateField('company', event.target.value)} autoComplete="organization" />
          </label>

          <label>
            <span>What do they need?</span>
            <textarea value={form.message} onChange={(event) => updateField('message', event.target.value)} rows={5} placeholder="Website goals, urgency, budget clues, and the next action..." />
          </label>

          {error && <p className="crm-form-error" role="alert">{error}</p>}

          <footer>
            <button type="button" className="crm-secondary-button" onClick={onClose} disabled={isPending}>Cancel</button>
            <button type="submit" className="crm-primary-button" disabled={isPending}>
              {isPending ? 'Adding client...' : 'Add to pipeline'}
              {!isPending && <ArrowRight size={17} />}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
