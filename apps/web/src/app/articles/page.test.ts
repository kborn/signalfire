import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getArticlesList } from '@/lib/api/articles';

import ArticleListPage from './page';

vi.mock('@/lib/api/articles', () => ({
  getArticlesList: vi.fn(),
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

    const markup = renderToStaticMarkup(await ArticleListPage());

    expect(getArticlesList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain('Read and understand the issues that matter');
    expect(markup).toContain('href="/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Learn the baseline policy tradeoffs.');
    expect(markup).toContain('href="/articles/education-funding-101"');
    expect(markup).toContain('Education Funding 101');
    expect(markup).toContain('Understand how school funding decisions are made.');
  });

  it('renders the empty state when there are no articles', async () => {
    vi.mocked(getArticlesList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(await ArticleListPage());

    expect(getArticlesList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Articles');
    expect(markup).toContain('No articles available yet.');
    expect(markup).not.toContain('Read and understand the issues that matter');
  });
});
