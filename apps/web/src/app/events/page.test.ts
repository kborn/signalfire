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

  it('renders the events list and detail links without a topic filter', async () => {
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

    const markup = renderToStaticMarkup(await EventListPage({}));

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(undefined);
    expect(markup).toContain('Events');
    expect(markup).toContain('Find upcoming events to participate in');
    expect(markup).not.toContain('Events related to');
    expect(markup).toContain('href="/events/1"');
    expect(markup).toContain('Town Hall Meeting');
    expect(markup).toContain('A short event summary.');
    expect(markup).toContain('href="/events/2"');
    expect(markup).toContain('East River Cleanup');
    expect(markup).toContain('Community river cleanup day');
  });

  it('renders the events list with a topic filter banner when events are found', async () => {
    vi.mocked(getEventsList).mockResolvedValue({
      items: [
        {
          id: 10,
          title: 'Neighborhood Mutual Aid Fair',
          summary: 'Meet local organizers and volunteer teams.',
          eventType: 'VOLUNTEER',
          startTime: '2026-02-12T15:00:00.000Z',
          endTime: '2026-02-12T18:00:00.000Z',
          city: 'Philadelphia',
          region: 'PA',
          postalCode: '19107',
          country: 'USA',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await EventListPage({
        searchParams: Promise.resolve({ topicSlug: 'local-community' }),
      }),
    );

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith('local-community');
    expect(markup).toContain('Events');
    expect(markup).toContain('Find upcoming events to participate in');
    expect(markup).toContain('Events related to Local Community');
    expect(markup).toContain('href="/events/10"');
    expect(markup).toContain('Neighborhood Mutual Aid Fair');
  });

  it('renders the unfiltered empty state when there are no events', async () => {
    vi.mocked(getEventsList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(await EventListPage({}));

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(undefined);
    expect(markup).toContain('Events');
    expect(markup).toContain('No upcoming events found');
    expect(markup).not.toContain('Find upcoming events to participate in');
    expect(markup).not.toContain('Events related to');
  });

  it('renders the topic-specific empty state when a filtered query returns no events', async () => {
    vi.mocked(getEventsList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(
      await EventListPage({
        searchParams: Promise.resolve({ topicSlug: 'consumer-activism' }),
      }),
    );

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith('consumer-activism');
    expect(markup).toContain('Events');
    expect(markup).toContain('No events found for Consumer Activism');
    expect(markup).not.toContain('Find upcoming events to participate in');
  });
});
