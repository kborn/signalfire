import { renderToStaticMarkup } from 'react-dom/server';
import { notFound } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/error';
import { getEventDetails } from '@/lib/api/events';

import EventDetailsPage from './page';

vi.mock('@/lib/api/events', () => ({
  getEventDetails: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('EventDetailsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders event details, full description, and related links when related content exists', async () => {
    vi.mocked(getEventDetails).mockResolvedValue({
      id: 5,
      title: 'Downtown Housing Rally',
      summary: 'Join local organizers calling for housing reform.',
      description: '## What to expect\n\nBring signs and water.',
      eventType: 'RALLY',
      startTime: '2026-04-20T22:30:00.000Z',
      endTime: '2026-04-20T23:30:00.000Z',
      locationName: 'City Hall Plaza',
      addressRaw: '1 Civic Center Plaza',
      city: 'Boston',
      region: 'MA',
      postalCode: '02108',
      country: 'USA',
      latitude: 42.0,
      longitude: -71.0,
      publishedAt: '2026-04-10T12:00:00.000Z',
      updatedAt: '2026-04-12T12:00:00.000Z',
      topics: [
        {
          id: 10,
          slug: 'local-community',
          name: 'Local Community',
          description: 'Neighborhood-level civic participation.',
        },
      ],
      articles: [
        {
          id: 20,
          slug: 'housing-policy-basics',
          title: 'Housing Policy Basics',
          summary: 'A primer on housing policy tradeoffs.',
          publishedAt: '2026-04-08T12:00:00.000Z',
        },
      ],
      actions: [
        {
          id: 30,
          slug: 'contact-city-council',
          title: 'Contact City Council',
          summary: 'Ask for support on housing reform.',
          actionType: 'CONTACT',
          publishedAt: '2026-04-09T12:00:00.000Z',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await EventDetailsPage({
        params: Promise.resolve({ id: '5' }),
      }),
    );

    expect(getEventDetails).toHaveBeenCalledWith(5);
    expect(markup).toContain('Downtown Housing Rally');
    expect(markup).toContain('Join local organizers calling for housing reform.');
    expect(markup).toContain('Rally');
    expect(markup).toContain('City Hall Plaza');
    expect(markup).toContain('1 Civic Center Plaza');
    expect(markup).toContain('Boston, MA, 02108, USA');
    expect(markup).toContain('What to expect');
    expect(markup).toContain('Bring signs and water.');
    expect(markup).toContain('Related Topics');
    expect(markup).toContain('href="/topics/local-community"');
    expect(markup).toContain('Articles');
    expect(markup).toContain('href="/articles/housing-policy-basics"');
    expect(markup).toContain('Actions');
    expect(markup).toContain('href="/actions/contact-city-council"');
  });

  it('omits related sections when the event has no related topics, articles, or actions', async () => {
    vi.mocked(getEventDetails).mockResolvedValue({
      id: 8,
      title: 'Neighborhood Meeting',
      summary: 'Residents discuss local budget priorities.',
      description: 'Meeting agenda and facilitation details.',
      eventType: 'MEETING',
      startTime: '2026-05-01T16:00:00.000Z',
      endTime: null,
      locationName: 'Community Center',
      addressRaw: '10 Main Street',
      city: 'Providence',
      region: 'RI',
      postalCode: null,
      country: 'USA',
      latitude: null,
      longitude: null,
      publishedAt: '2026-04-20T12:00:00.000Z',
      updatedAt: '2026-04-21T12:00:00.000Z',
      topics: [],
      articles: [],
      actions: [],
    });

    const markup = renderToStaticMarkup(
      await EventDetailsPage({
        params: Promise.resolve({ id: '8' }),
      }),
    );

    expect(getEventDetails).toHaveBeenCalledWith(8);
    expect(markup).not.toContain('Related Topics');
    expect(markup).not.toContain('Articles');
    expect(markup).not.toContain('Actions');
    expect(markup).toContain('Neighborhood Meeting');
    expect(markup).toContain('Community Center');
  });

  it('translates a 404 event API error into route not-found behavior', async () => {
    const notFoundSignal = new Error('NEXT_NOT_FOUND');

    vi.mocked(notFound).mockImplementation(() => {
      throw notFoundSignal;
    });

    vi.mocked(getEventDetails).mockRejectedValue(
      new ApiError('Event not found', 404, 'events/404'),
    );

    await expect(
      EventDetailsPage({
        params: Promise.resolve({ id: '404' }),
      }),
    ).rejects.toThrow(notFoundSignal);

    expect(getEventDetails).toHaveBeenCalledWith(404);
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('treats invalid event ids as not-found routes', async () => {
    const notFoundSignal = new Error('NEXT_NOT_FOUND');

    vi.mocked(notFound).mockImplementation(() => {
      throw notFoundSignal;
    });

    await expect(
      EventDetailsPage({
        params: Promise.resolve({ id: 'not-a-number' }),
      }),
    ).rejects.toThrow(notFoundSignal);

    expect(getEventDetails).not.toHaveBeenCalled();
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('rethrows non-404 event API errors so route error handling can take over', async () => {
    const error = new ApiError('API unavailable', 500, 'events/5');

    vi.mocked(getEventDetails).mockRejectedValue(error);

    await expect(
      EventDetailsPage({
        params: Promise.resolve({ id: '5' }),
      }),
    ).rejects.toThrow(error);

    expect(getEventDetails).toHaveBeenCalledWith(5);
    expect(notFound).not.toHaveBeenCalled();
  });
});
