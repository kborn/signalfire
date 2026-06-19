import { describe, expect, it } from 'vitest';

import { formatAdminDateTime, formatEventTime } from './time';

describe('formatEventTime', () => {
  it('formats single timestamps in the event local timezone when location is known', () => {
    expect(
      formatEventTime('2026-04-20T22:30:00.000Z', null, {
        city: 'Boston',
        region: 'MA',
        country: 'USA',
      }),
    ).toBe('Mon, Apr 20, 2026 at 6:30 PM EDT');
  });

  it('falls back to UTC when no location is available', () => {
    expect(formatEventTime('2026-04-20T22:30:00.000Z', null)).toBe(
      'Mon, Apr 20, 2026 at 10:30 PM UTC',
    );
  });

  it('formats same-day ranges without repeating the date', () => {
    expect(
      formatEventTime('2026-04-20T22:30:00.000Z', '2026-04-20T23:30:00.000Z', {
        city: 'Boston',
        region: 'MA',
        country: 'USA',
      }),
    ).toBe('Mon, Apr 20, 2026 from 6:30 PM to 7:30 PM EDT');
  });

  it('formats Puerto Rico events in Atlantic time', () => {
    expect(
      formatEventTime('2026-04-20T22:30:00.000Z', null, {
        city: 'San Juan',
        region: 'PR',
        country: 'US',
      }),
    ).toBe('Mon, Apr 20, 2026 at 6:30 PM AST');
  });

  it('handles cross-day UTC ranges on the same local day', () => {
    expect(
      formatEventTime('2026-04-20T23:30:00.000Z', '2026-04-21T01:00:00.000Z', {
        city: 'Boston',
        region: 'MA',
        country: 'USA',
      }),
    ).toBe('Mon, Apr 20, 2026 from 7:30 PM to 9:00 PM EDT');
  });

  it('formats true local cross-day ranges with both dates', () => {
    expect(
      formatEventTime('2026-04-21T03:30:00.000Z', '2026-04-21T05:00:00.000Z', {
        city: 'Boston',
        region: 'MA',
        country: 'USA',
      }),
    ).toBe('Mon, Apr 20, 2026 at 11:30 PM EDT to Tue, Apr 21, 2026 at 1:00 AM EDT');
  });

  it('returns a fallback when the start date is invalid', () => {
    expect(formatEventTime('not-a-date', null)).toBe('Unable to determine event time');
  });

  it('returns a fallback when the end date is invalid', () => {
    expect(formatEventTime('2026-04-20T22:30:00.000Z', 'not-a-date')).toBe(
      'Unable to determine event time',
    );
  });
});

describe('formatAdminDateTime', () => {
  it('formats admin timestamps in a shorter local date-time form', () => {
    expect(formatAdminDateTime('2026-06-08T17:07:12.000Z')).toMatch(
      /6\/8\/2026, \d{1,2}:07 (AM|PM)/,
    );
  });

  it('returns a fallback when the timestamp is invalid', () => {
    expect(formatAdminDateTime('not-a-date')).toBe('--');
  });
});
