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
      await ArticleListPage({ searchParams: Promise.resolve({ topicSlug: 'democracy' }) }),
    );

    expect(getArticlesList).toHaveBeenCalledTimes(1);
    expect(getArticlesList).toHaveBeenCalledWith('democracy');
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain(
      'Read reporting, explainers, and field guides about the issues that matter',
    );
    expect(markup).toContain('TOPIC');
    expect(markup).toContain('href="/articles?topicSlug=democracy"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Learn the baseline policy tradeoffs.');
    expect(markup).toContain('Published March 20, 2026');
    expect(markup).toContain('href="/articles/education-funding-101"');
    expect(markup).toContain('Education Funding 101');
    expect(markup).toContain('Understand how school funding decisions are made.');
    expect(markup).toContain('Published March 21, 2026');
  });

  it('renders the empty state when there are no articles', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
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
    expect(getArticlesList).toHaveBeenCalledWith('democracy');
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain('No articles available yet.');
    expect(markup).not.toContain(
      'Read reporting, explainers, and field guides about the issues that matter',
    );
  });
});
