import { describe, expect, it } from 'vitest';

import { formatEventTime } from './time';

describe('formatEventTime', () => {
  it('formats single timestamps in a human-readable UTC format', () => {
    expect(formatEventTime('2026-04-20T22:30:00.000Z', null)).toBe('Apr 20, 2026, 10:30 PM UTC');
  });

  it('formats same-day ranges without repeating the date', () => {
    expect(formatEventTime('2026-04-20T22:30:00.000Z', '2026-04-20T23:30:00.000Z')).toBe(
      'Apr 20, 2026, 10:30 PM - 11:30 PM UTC',
    );
  });

  it('formats cross-day ranges with both dates', () => {
    expect(formatEventTime('2026-04-20T23:30:00.000Z', '2026-04-21T01:00:00.000Z')).toBe(
      'Apr 20, 2026, 11:30 PM UTC - Apr 21, 2026, 1:00 AM UTC',
    );
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
