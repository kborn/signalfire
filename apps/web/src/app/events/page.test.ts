import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEventsList } from '@/lib/api/events';

import EventListPage from './page';

vi.mock('@/lib/api/events', () => ({
  getEventsList: vi.fn(),
}));

describe('EventListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Events Page without topic slug. Renders the events list and event detail links', async () => {
    vi.mocked(getEventsList).mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'Town Hall Meeting',
          summary: 'A short event summary.',
          eventType: 'TOWN_HALL',
          startTime: '2025-12-17T03:24:00.000Z',
          endTime: '2025-12-17T04:24:00.000Z',
          city: 'Springfield',
          region: 'IL',
          postalCode: '62701',
          country: 'USA',
        },
        {
          id: 2,
          title: 'East River Cleanup',
          summary: 'Community river cleanup day',
          eventType: 'VOLUNTEER',
          startTime: '2026-01-17T08:00:00.000Z',
          endTime: '2026-01-17T17:00:00.000Z',
          city: 'New York',
          region: 'NY',
          postalCode: '11011',
          country: 'USA',
        },
      ],
    });

    const markup = renderToStaticMarkup(await EventListPage({ searchParams: {} }));

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Events');
    expect(markup).toContain('Find upcoming events to participate in');
    expect(markup).toContain('href="/events/1"');
    expect(markup).toContain('Town Hall Meeting');
    expect(markup).toContain('A short event summary.');
    expect(markup).toContain('href="/events/2"');
    expect(markup).toContain('East River Cleanup');
    expect(markup).toContain('Community river cleanup day');
  });
});
