import { renderToStaticMarkup } from 'react-dom/server';
import { notFound } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getActionDetails } from '@/lib/api/actions';
import { ApiError } from '@/lib/api/error';

import ActionDetailsPage from './page';

vi.mock('@/lib/api/actions', () => ({
  getActionDetails: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('ActionDetailsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the action details, markdown body, related topics, and related articles', async () => {
    vi.mocked(getActionDetails).mockResolvedValue({
      id: 1,
      slug: 'call-your-state-representative',
      title: 'Call Your State Representative',
      summary: 'Ask for support on climate legislation.',
      description: '## Steps\n\nCall and ask for support on the bill.',
      actionType: 'CONTACT',
      updatedAt: '2026-03-22T12:00:00.000Z',
      publishedAt: '2026-03-21T12:00:00.000Z',
      topics: [
        {
          id: 10,
          slug: 'climate',
          name: 'Climate',
          description: 'Climate issue overview.',
        },
      ],
      articles: [
        {
          id: 20,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          publishedAt: '2026-03-20T12:00:00.000Z',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ActionDetailsPage({
        params: Promise.resolve({ slug: 'call-your-state-representative' }),
      }),
    );

    expect(getActionDetails).toHaveBeenCalledWith('call-your-state-representative');
    expect(markup).toContain('Call Your State Representative');
    expect(markup).toContain('Ask for support on climate legislation.');
    expect(markup).toContain('Action Type');
    expect(markup).toContain('CONTACT');
    expect(markup).toContain('Published');
    expect(markup).toContain('March 21, 2026');
    expect(markup).toContain('Updated');
    expect(markup).toContain('March 22, 2026');
    expect(markup).toContain('Steps');
    expect(markup).toContain('Call and ask for support on the bill.');
    expect(markup).toContain('Related Topics');
    expect(markup).toContain('href="/topics/climate"');
    expect(markup).toContain('Climate');
    expect(markup).toContain('Learn More');
    expect(markup).toContain('href="/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('class="relatedList"');
    expect(markup).toContain('class="relatedListItemTitle"');
  });

  it('translates a 404 action API error into route not-found behavior', async () => {
    const notFoundSignal = new Error('NEXT_NOT_FOUND');

    vi.mocked(notFound).mockImplementation(() => {
      throw notFoundSignal;
    });

    vi.mocked(getActionDetails).mockRejectedValue(
      new ApiError('Action not found', 404, 'actions/missing'),
    );

    await expect(
      ActionDetailsPage({
        params: Promise.resolve({ slug: 'missing' }),
      }),
    ).rejects.toThrow(notFoundSignal);

    expect(getActionDetails).toHaveBeenCalledWith('missing');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('rethrows non-404 action API errors so route error handling can take over', async () => {
    const error = new ApiError('API unavailable', 500, 'actions/call-your-state-representative');

    vi.mocked(getActionDetails).mockRejectedValue(error);

    await expect(
      ActionDetailsPage({
        params: Promise.resolve({ slug: 'call-your-state-representative' }),
      }),
    ).rejects.toThrow(error);

    expect(getActionDetails).toHaveBeenCalledWith('call-your-state-representative');
    expect(notFound).not.toHaveBeenCalled();
  });
});
