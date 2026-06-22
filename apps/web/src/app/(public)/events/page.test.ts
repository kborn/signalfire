import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEventsList } from '@/lib/api/events';
import { getTopicsList } from '@/lib/api/topics';

import EventListPage from './page';

vi.mock('@/lib/api/events', () => ({
  getEventsList: vi.fn(),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('EventListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  function mockTopics() {
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'desc',
        },
      ],
    });
  }

  it('renders the events list and detail links without a topic filter', async () => {
    mockTopics();
    vi.mocked(getEventsList).mockResolvedValue({
      page: 2,
      pageSize: 20,
      totalItems: 60,
      totalPages: 3,
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

    const markup = renderToStaticMarkup(
      await EventListPage({
        searchParams: Promise.resolve({ region: 'PA', page: '2', pageSize: '20' }),
      }),
    );

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(
      expect.objectContaining({ region: 'PA', page: '2', pageSize: '20' }),
    );
    expect(markup).toContain('Events');
    expect(markup).toContain('Protests, town halls, volunteer shifts, community meetings');
    expect(markup).toContain('event-start-date');
    expect(markup).toContain('event-end-date');
    expect(markup).toContain('Results per page');
    expect(markup).toContain('region=PA&amp;pageSize=5');
    expect(markup).toContain('region=PA&amp;pageSize=10');
    expect(markup).toContain('region=PA&amp;pageSize=20');
    expect(markup).toContain('region=PA&amp;page=1&amp;pageSize=20');
    expect(markup).toContain('region=PA&amp;page=2&amp;pageSize=20');
    expect(markup).toContain('region=PA&amp;page=3&amp;pageSize=20');
    expect(markup).toContain('href="/events/1"');
    expect(markup).toContain('Town Hall Meeting');
    expect(markup).toContain('A short event summary.');
    expect(markup).toContain('href="/events/2"');
    expect(markup).toContain('East River Cleanup');
    expect(markup).toContain('Community river cleanup day');
  });

  it('renders the events list with a topic filter banner when events are found', async () => {
    mockTopics();
    vi.mocked(getEventsList).mockResolvedValue({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
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
        searchParams: Promise.resolve({ topicSlug: 'local-community', region: 'PA' }),
      }),
    );

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(
      expect.objectContaining({ topicSlug: 'local-community', region: 'PA' }),
    );
    expect(markup).toContain('Events');
    expect(markup).toContain('Protests, town halls, volunteer shifts, community meetings');
    expect(markup).toContain('event-start-date');
    expect(markup).toContain('href="/events/10"');
    expect(markup).toContain('Neighborhood Mutual Aid Fair');
  });

  it('renders the pre-results state when no region filter is present', async () => {
    mockTopics();
    vi.mocked(getEventsList).mockResolvedValue({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: [],
    });

    const markup = renderToStaticMarkup(await EventListPage({}));

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(expect.objectContaining({}));
    expect(markup).toContain('Events');
  });

  it('renders the empty state when a filtered query returns no events', async () => {
    mockTopics();
    vi.mocked(getEventsList).mockResolvedValue({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: [],
    });

    const markup = renderToStaticMarkup(
      await EventListPage({
        searchParams: Promise.resolve({ topicSlug: 'consumer-activism', region: 'PA' }),
      }),
    );

    expect(getEventsList).toHaveBeenCalledTimes(1);
    expect(getEventsList).toHaveBeenCalledWith(
      expect.objectContaining({ topicSlug: 'consumer-activism', region: 'PA' }),
    );
    expect(markup).toContain('Events');
    expect(markup).toContain('No events match this issue right now.');
  });

  it('renders a recoverable empty page state when the requested page has no items', async () => {
    mockTopics();
    vi.mocked(getEventsList).mockResolvedValue({
      page: 9,
      pageSize: 20,
      totalItems: 12,
      totalPages: 2,
      items: [],
    });

    const markup = renderToStaticMarkup(
      await EventListPage({
        searchParams: Promise.resolve({
          topicSlug: 'consumer-activism',
          region: 'PA',
          page: '9',
          pageSize: '20',
        }),
      }),
    );

    expect(markup).toContain('There are matching events, just not on this page.');
    expect(markup).toContain(
      'href="/events?topicSlug=consumer-activism&amp;region=PA&amp;page=8&amp;pageSize=20',
    );
    expect(markup).toContain('Results per page');
  });
});
