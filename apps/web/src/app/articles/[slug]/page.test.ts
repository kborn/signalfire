import { renderToStaticMarkup } from 'react-dom/server';
import { notFound } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/error';
import { getArticleDetails } from '@/lib/api/articles';

import ArticleDetailsPage from './page';

vi.mock('@/lib/api/articles', () => ({
  getArticleDetails: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('ArticleDetailsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the article details, markdown body, related topics, and related actions', async () => {
    vi.mocked(getArticleDetails).mockResolvedValue({
      id: 1,
      slug: 'climate-policy-basics',
      title: 'Climate Policy Basics',
      summary: 'Learn the baseline policy tradeoffs.',
      author: 'CivicSignal Editorial',
      content: '## Why it matters\n\nStrong policy changes daily life.',
      publishedAt: '2026-03-20T12:00:00.000Z',
      updatedAt: '2026-03-22T12:00:00.000Z',
      topics: [
        {
          id: 10,
          slug: 'climate',
          name: 'Climate',
          description: 'Climate issue overview.',
        },
      ],
      actions: [
        {
          id: 20,
          slug: 'call-your-state-representative',
          title: 'Call Your State Representative',
          summary: 'Ask for support on climate legislation.',
          actionType: 'CONTACT',
          publishedAt: '2026-03-21T12:00:00.000Z',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleDetailsPage({
        params: Promise.resolve({ slug: 'climate-policy-basics' }),
      }),
    );

    expect(getArticleDetails).toHaveBeenCalledWith('climate-policy-basics');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Learn the baseline policy tradeoffs.');
    expect(markup).toContain('CivicSignal Editorial');
    expect(markup).toContain('Author');
    expect(markup).toContain('Published');
    expect(markup).toContain('March 20, 2026');
    expect(markup).toContain('Updated');
    expect(markup).toContain('March 22, 2026');
    expect(markup).toContain('Why it matters');
    expect(markup).toContain('Strong policy changes daily life.');
    expect(markup).toContain('Topics');
    expect(markup).toContain('href="/topics/climate"');
    expect(markup).toContain('Climate');
    expect(markup).toContain('Take Action');
    expect(markup).toContain('href="/actions/call-your-state-representative"');
    expect(markup).toContain('Call Your State Representative');
    expect(markup).toContain('class="relatedList"');
    expect(markup).toContain('class="relatedListItemTitle"');
  });

  it('translates a 404 article API error into route not-found behavior', async () => {
    const notFoundSignal = new Error('NEXT_NOT_FOUND');

    vi.mocked(notFound).mockImplementation(() => {
      throw notFoundSignal;
    });

    vi.mocked(getArticleDetails).mockRejectedValue(
      new ApiError('Article not found', 404, 'articles/missing'),
    );

    await expect(
      ArticleDetailsPage({
        params: Promise.resolve({ slug: 'missing' }),
      }),
    ).rejects.toThrow(notFoundSignal);

    expect(getArticleDetails).toHaveBeenCalledWith('missing');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('rethrows non-404 article API errors so route error handling can take over', async () => {
    const error = new ApiError('API unavailable', 500, 'articles/climate-policy-basics');

    vi.mocked(getArticleDetails).mockRejectedValue(error);

    await expect(
      ArticleDetailsPage({
        params: Promise.resolve({ slug: 'climate-policy-basics' }),
      }),
    ).rejects.toThrow(error);

    expect(getArticleDetails).toHaveBeenCalledWith('climate-policy-basics');
    expect(notFound).not.toHaveBeenCalled();
  });
});
