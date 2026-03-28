import { renderToStaticMarkup } from 'react-dom/server';
import { notFound } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/error';
import { getTopicDetails } from '@/lib/api/topics';

import TopicDetailsPage from './page';

vi.mock('@/lib/api/topics', () => ({
  getTopicDetails: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('TopicDetailsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the topic details and related article and action links', async () => {
    vi.mocked(getTopicDetails).mockResolvedValue({
      id: 1,
      slug: 'climate',
      name: 'Climate',
      description: 'Climate issue overview.',
      articles: [
        {
          id: 101,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          publishedAt: '2026-03-20T12:00:00.000Z',
        },
      ],
      actions: [
        {
          id: 201,
          slug: 'call-your-state-representative',
          title: 'Call Your State Representative',
          summary: 'Ask for support on climate legislation.',
          actionType: 'CONTACT',
          publishedAt: '2026-03-21T12:00:00.000Z',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await TopicDetailsPage({
        params: Promise.resolve({ slug: 'climate' }),
      }),
    );

    expect(getTopicDetails).toHaveBeenCalledWith('climate');
    expect(markup).toContain('Climate');
    expect(markup).toContain('Climate issue overview.');
    expect(markup).toContain('Articles');
    expect(markup).toContain('href="/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Actions');
    expect(markup).toContain('href="/actions/call-your-state-representative"');
    expect(markup).toContain('Call Your State Representative');
  });

  it('translates a 404 topic API error into route not-found behavior', async () => {
    const notFoundSignal = new Error('NEXT_NOT_FOUND');

    vi.mocked(notFound).mockImplementation(() => {
      throw notFoundSignal;
    });

    vi.mocked(getTopicDetails).mockRejectedValue(
      new ApiError('Topic not found', 404, 'topics/missing'),
    );

    await expect(
      TopicDetailsPage({
        params: Promise.resolve({ slug: 'missing' }),
      }),
    ).rejects.toThrow(notFoundSignal);

    expect(getTopicDetails).toHaveBeenCalledWith('missing');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('rethrows non-404 API errors so route error handling can take over', async () => {
    const error = new ApiError('API unavailable', 500, 'topics/climate');

    vi.mocked(getTopicDetails).mockRejectedValue(error);

    await expect(
      TopicDetailsPage({
        params: Promise.resolve({ slug: 'climate' }),
      }),
    ).rejects.toThrow(error);

    expect(getTopicDetails).toHaveBeenCalledWith('climate');
    expect(notFound).not.toHaveBeenCalled();
  });
});
