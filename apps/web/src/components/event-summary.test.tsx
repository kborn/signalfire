import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { EventSummary } from './event-summary';

describe('EventSummary', () => {
  it('renders the canonical event collection fields', () => {
    const markup = renderToStaticMarkup(
      <EventSummary
        event={{
          id: 42,
          title: 'City Hall Town Hall',
          summary: 'Public discussion with local officials.',
          eventType: 'TOWN_HALL',
          startTime: '2026-04-20T22:30:00.000Z',
          endTime: '2026-04-20T23:30:00.000Z',
          city: 'Boston',
          region: 'MA',
          postalCode: '02108',
          country: 'USA',
        }}
      />,
    );

    expect(markup).toContain('href="/events/42"');
    expect(markup).toContain('City Hall Town Hall');
    expect(markup).toContain('Public discussion with local officials.');
    expect(markup).toContain('TOWN_HALL');
    expect(markup).toContain('Boston, MA, USA');
  });

  it('omits null location fields instead of rendering placeholder text', () => {
    const markup = renderToStaticMarkup(
      <EventSummary
        event={{
          id: 7,
          title: 'Virtual Training',
          summary: 'Online organizing workshop.',
          eventType: 'WORKSHOP',
          startTime: '2026-05-01T16:00:00.000Z',
          endTime: null,
          city: null,
          region: null,
          postalCode: null,
          country: null,
        }}
      />,
    );

    expect(markup).not.toContain('null');
    expect(markup).not.toContain(', ,');
  });
});
