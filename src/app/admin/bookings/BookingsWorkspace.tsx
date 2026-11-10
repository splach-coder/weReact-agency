import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { CrmLead } from '@/lib/crm';

/** Reads one "Label: value" line out of the message the Cal.com webhook stores on the lead. */
function readBookingField(message: string | null | undefined, label: string) {
  if (!message) return null;
  const line = message.split('\n').find((entry) => entry.startsWith(`${label}: `));
  return line ? line.slice(label.length + 2).trim() : null;
}

function BookingCard({ booking }: { booking: CrmLead }) {
  const scheduled = readBookingField(booking.message, 'Scheduled');
  const event = readBookingField(booking.message, 'Event');
  const location = readBookingField(booking.message, 'Location');
  const rescheduleUrl = readBookingField(booking.message, 'Reschedule');
  const notes = readBookingField(booking.message, 'Notes');
  const attribution = booking.attribution ?? {};
  const cameFrom = [attribution.utm_source, attribution.utm_campaign].filter(Boolean).join(' · ');
  // "Scheduled" is stored as "YYYY-MM-DD HH:mm UTC", so a string comparison orders correctly.
  const isUpcoming = Boolean(scheduled) && scheduled! >= new Date().toISOString().slice(0, 16).replace('T', ' ');

  return (
    <article className="crm-lead-card">
      <header>
        <div>
          <strong>{booking.name}</strong>
          <p>{scheduled ? `${scheduled}${isUpcoming ? '' : ' (past)'}` : 'Time not recorded'}</p>
        </div>
        <span className="crm-status">{event ?? 'Call'}</span>
      </header>
      <dl className="crm-contact-grid">
        {booking.email && (
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${booking.email}`}>{booking.email}</a></dd>
          </div>
        )}
        {cameFrom && (
          <div>
            <dt>Came from</dt>
            <dd><strong>{cameFrom}</strong>{attribution.gclid ? ' (Google Ads)' : ''}</dd>
          </div>
        )}
        {notes && (
          <div>
            <dt>Notes</dt>
            <dd>{notes}</dd>
          </div>
        )}
      </dl>
      <div className="crm-contact-actions">
        <Link href={`/admin/leads/${booking.id}`} title="Open lead">Open lead</Link>
        {location?.startsWith('http') && <a href={location} target="_blank" rel="noreferrer" title="Join meeting">Join</a>}
        {rescheduleUrl && <a href={rescheduleUrl} target="_blank" rel="noreferrer" title="Reschedule">Reschedule</a>}
      </div>
    </article>
  );
}

export function BookingsWorkspace({ bookings }: { bookings: CrmLead[] }) {
  return (
    <div className="crm-detail">
      <section className="crm-section">
        <header>
          <h2><CalendarDays size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />Bookings</h2>
          <a className="crm-action-link" href={siteConfig.business.calBookingUrl} target="_blank" rel="noreferrer">Open booking page</a>
        </header>
        {bookings.length === 0 ? (
          <p className="crm-empty-state">No bookings yet. They appear here automatically once someone books a call.</p>
        ) : (
          <div className="crm-client-list">
            {bookings.map((booking) => <BookingCard booking={booking} key={booking.id} />)}
          </div>
        )}
      </section>
    </div>
  );
}
