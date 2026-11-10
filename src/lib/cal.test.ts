import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCalBookingUrl, buildCalConfig, getCalCopy } from './cal';
import { createCalBookingLead } from './cal-webhook';

test('builds the Cal embed config from stored attribution', () => {
  assert.deepEqual(buildCalConfig(null, 'fr'), { layout: 'month_view', 'ui.language': 'fr', utm_source: 'website' });
  assert.deepEqual(buildCalConfig({ utm_source: 'google', utm_campaign: 'riads', gclid: 'abc' }, 'de'), {
    layout: 'month_view',
    'ui.language': 'en',
    utm_source: 'google',
    utm_campaign: 'riads',
    utm_content: 'gclid_abc',
  });
});

test('adds attribution to the hosted booking URL without overwriting existing params', () => {
  const url = new URL(buildCalBookingUrl('https://cal.com/team/30min?utm_source=email', { utm_source: 'google', utm_medium: 'cpc' }));
  assert.equal(url.searchParams.get('utm_source'), 'email');
  assert.equal(url.searchParams.get('utm_medium'), 'cpc');
  assert.equal(url.searchParams.has('layout'), false);
});

test('localizes the booking copy with an English fallback', () => {
  assert.equal(getCalCopy('fr').cta, 'Réserver un appel');
  assert.equal(getCalCopy('de').cta, 'Book a call');
});

test('maps a Cal.com booking to a CRM lead', () => {
  const lead = createCalBookingLead({
    triggerEvent: 'BOOKING_CREATED',
    payload: {
      title: '30 Min Meeting',
      startTime: '2026-11-12T10:30:00.000Z',
      attendees: [{ name: ' Salma ', email: 'salma@example.com', timeZone: 'Africa/Casablanca' }],
      responses: {
        name: { label: 'your_name', value: 'Salma' },
        notes: { label: 'Notes', value: 'Riad website' },
        budget: { label: 'Budget', value: ['3,500 MAD', 'flexible'] },
      },
      videoCallData: { url: 'https://meet.google.com/abc' },
      rescheduleUrl: 'https://cal.com/reschedule/xyz',
      tracking: { utm_source: 'google', utm_content: 'gclid_abc' },
      metadata: { utm_source: 'ignored', utm_campaign: 'riads' },
    },
  });

  assert.ok(lead);
  assert.equal(lead.name, 'Salma');
  assert.equal(lead.source, 'cal_booking');
  assert.equal(
    lead.message,
    [
      'Booked a call via Cal.com.',
      'Event: 30 Min Meeting',
      'Scheduled: 2026-11-12 10:30 UTC',
      'Invitee timezone: Africa/Casablanca',
      'Location: https://meet.google.com/abc',
      'Notes: Riad website',
      'Budget: 3,500 MAD, flexible',
      'Reschedule: https://cal.com/reschedule/xyz',
    ].join('\n'),
  );
  assert.deepEqual(lead.attribution, {
    source_page: 'cal_booking',
    utm_source: 'google',
    utm_campaign: 'riads',
    utm_content: 'gclid_abc',
    gclid: 'abc',
  });
});

test('skips bookings without an attendee name or email', () => {
  assert.equal(createCalBookingLead({ triggerEvent: 'BOOKING_CREATED', payload: { attendees: [{ name: 'Salma' }] } }), null);
});
