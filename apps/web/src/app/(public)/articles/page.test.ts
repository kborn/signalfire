import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getArticlesList } from '@/lib/api/articles';
import { getTopicsList } from '@/lib/api/topics';

import ArticleListPage from './page';

vi.mock('@/lib/api/articles', () => ({
  getArticlesList: vi.fn(),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

describe('ArticleListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the articles list and article detail links', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      page: 9,
      pageSize: 12,
      totalItems: 180,
      totalPages: 15,
      items: [
        {
          id: 1,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          publishedAt: '2026-03-20T12:00:00.000Z',
        },
        {
          id: 2,
          slug: 'education-funding-101',
          title: 'Education Funding 101',
          summary: 'Understand how school funding decisions are made.',
          publishedAt: '2026-03-21T12:00:00.000Z',
        },
      ],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'Voting, participation, and civic institutions.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '9', pageSize: '12' }),
      }),
    );

    expect(getArticlesList).toHaveBeenCalledTimes(1);
    expect(getArticlesList).toHaveBeenCalledWith({
      topicSlug: 'democracy',
      page: '9',
      pageSize: '12',
    });
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain(
      'Read reporting, explainers, and field guides about the issues that matter',
    );
    expect(markup).toContain('Issue');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=12"');
    expect(markup).toContain('Results per page');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=10"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=25"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=50"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Learn the baseline policy tradeoffs.');
    expect(markup).toContain('Published March 20, 2026');
    expect(markup).toContain('href="/articles/education-funding-101"');
    expect(markup).toContain('Education Funding 101');
    expect(markup).toContain('Understand how school funding decisions are made.');
    expect(markup).toContain('Published March 21, 2026');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=1&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=7&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=8&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=9&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=10&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=11&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=15&amp;pageSize=12"');
    expect(markup).toContain('...');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=1&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=8&amp;pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=10&amp;pageSize=12"');
    expect(markup).toContain('Previous');
    expect(markup).toContain('Next');
  });

  it('renders the empty state when there are no articles', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: [],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'Voting, participation, and civic institutions.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({ searchParams: Promise.resolve({ topicSlug: 'democracy' }) }),
    );

    expect(getArticlesList).toHaveBeenCalledTimes(1);
    expect(getArticlesList).toHaveBeenCalledWith({
      topicSlug: 'democracy',
      page: undefined,
      pageSize: undefined,
    });
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain('No published articles match this issue yet.');
    expect(markup).toContain(
      'Read reporting, explainers, and field guides about the issues that matter',
    );
    expect(markup).toContain('Issue');
    expect(markup).toContain('Results per page');
  });

  it('renders a recoverable empty page state when the requested page has no items', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      page: 9,
      pageSize: 10,
      totalItems: 12,
      totalPages: 2,
      items: [],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'Voting, participation, and civic institutions.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '9', pageSize: '10' }),
      }),
    );

    expect(markup).toContain('Articles');
    expect(markup).toContain('These filters have results, just not here.');
    expect(markup).toContain('Issue');
    expect(markup).toContain('Results per page');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;page=8&amp;pageSize=10"');
  });

  it('resets the page query when changing topics', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      page: 3,
      pageSize: 12,
      totalItems: 50,
      totalPages: 5,
      items: [
        {
          id: 1,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          publishedAt: '2026-03-20T12:00:00.000Z',
        },
      ],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'Voting, participation, and civic institutions.',
        },
        {
          id: 2,
          slug: 'climate',
          name: 'Climate',
          description: 'Climate action and accountability.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '3', pageSize: '12' }),
      }),
    );

    expect(markup).toContain('href="/articles?pageSize=12"');
    expect(markup).toContain('href="/articles?topicSlug=climate&amp;pageSize=12"');
  });

  it('resets the page query when changing page size', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      page: 4,
      pageSize: 25,
      totalItems: 100,
      totalPages: 4,
      items: [
        {
          id: 1,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          publishedAt: '2026-03-20T12:00:00.000Z',
        },
      ],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'Voting, participation, and civic institutions.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '4', pageSize: '25' }),
      }),
    );

    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=10"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=25"');
    expect(markup).toContain('href="/articles?topicSlug=democracy&amp;pageSize=50"');
    expect(markup).not.toContain('href="/articles?topicSlug=democracy&amp;page=4&amp;pageSize=10"');
    expect(markup).not.toContain('href="/articles?topicSlug=democracy&amp;page=4&amp;pageSize=50"');
  });
});
