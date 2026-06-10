import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAdminEventsList } from '@/lib/api/admin.server';

import EventsListPage from './page';

vi.mock('@/lib/api/admin.server', () => ({
  getAdminEventsList: vi.fn(),
}));

describe('EventsListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the events list and event detail links', async () => {
    vi.mocked(getAdminEventsList).mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'Climate Rally',
          summary: 'Join a rally for climate action.',
          eventType: 'RALLY',
          startTime: '2026-05-14T17:00:00.000Z',
          endTime: '2026-05-14T19:00:00.000Z',
          locationName: 'City Hall',
          city: 'Boston',
          region: 'MA',
          country: 'USA',
          postalCode: '02108',
          status: 'DRAFT',
          updatedAt: '2026-05-13T12:00:00.000Z',
          publishedAt: null,
          topicSlugs: ['climate'],
        },
        {
          id: 2,
          title: 'Town Hall Meeting',
          summary: 'Discuss local policy priorities.',
          eventType: 'TOWN_HALL',
          startTime: '2026-06-01T16:00:00.000Z',
          endTime: null,
          locationName: 'Community Center',
          city: 'Providence',
          region: 'RI',
          country: 'USA',
          postalCode: '02903',
          status: 'PUBLISHED',
          updatedAt: '2026-05-14T12:00:00.000Z',
          publishedAt: '2026-05-14T12:00:00.000Z',
          topicSlugs: ['democracy'],
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await EventsListPage({ searchParams: Promise.resolve({ status: 'PUBLISHED' }) }),
    );

    expect(getAdminEventsList).toHaveBeenCalledWith({ status: 'PUBLISHED' });
    expect(markup).toContain('Events');
    expect(markup).toContain('Create and maintain curated public events.');
    expect(markup).toContain('href="/admin/events/new"');
    expect(markup).toContain('href="/admin/events/1"');
    expect(markup).toContain('Climate Rally');
    expect(markup).toContain('Join a rally for climate action.');
    expect(markup).toContain('Rally');
    expect(markup).toContain('DRAFT');
    expect(markup).toContain('href="/admin/events/2"');
    expect(markup).toContain('Town Hall Meeting');
    expect(markup).toContain('Discuss local policy priorities.');
    expect(markup).toContain('Town Hall');
    expect(markup).toContain('PUBLISHED');
  });

  it('renders the empty state when there are no events', async () => {
    vi.mocked(getAdminEventsList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(
      await EventsListPage({ searchParams: Promise.resolve({}) }),
    );

    expect(getAdminEventsList).toHaveBeenCalledWith({ status: 'DRAFT' });
    expect(markup).toContain('Events');
    expect(markup).toContain('No events yet.');
    expect(markup).toContain('Create an event to populate this list.');
  });
});
