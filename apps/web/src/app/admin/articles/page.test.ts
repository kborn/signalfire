import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAdminArticlesList } from '@/lib/api/admin';

import ArticleListPage from './page';

vi.mock('@/lib/api/admin', () => ({
  getAdminArticlesList: vi.fn(),
}));

describe('ArticleListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the articles list and article detail links', async () => {
    vi.mocked(getAdminArticlesList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'climate-policy-basics',
          title: 'Climate Policy Basics',
          summary: 'Learn the baseline policy tradeoffs.',
          status: 'DRAFT',
          author: 'John Smith',
          topicSlugs: ['climate'],
          updatedAt: '2026-03-20T12:00:00.000Z',
          publishedAt: null,
        },
        {
          id: 2,
          slug: 'education-funding-101',
          title: 'Education Funding 101',
          summary: 'Understand how school funding decisions are made.',
          author: 'Jane Smith',
          status: 'PUBLISHED',
          topicSlugs: ['education'],
          updatedAt: '2026-03-21T12:00:00.000Z',
          publishedAt: '2026-03-21T12:00:00.000Z',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({ searchParams: Promise.resolve({ status: 'PUBLISHED' }) }),
    );

    expect(getAdminArticlesList).toHaveBeenCalledWith({ status: 'PUBLISHED' });
    expect(markup).toContain('Articles');
    expect(markup).toContain('Create and maintain curated public articles.');
    expect(markup).toContain('href="/admin/articles/new"');
    expect(markup).toContain('href="/admin/articles/climate-policy-basics"');
    expect(markup).toContain('Climate Policy Basics');
    expect(markup).toContain('Learn the baseline policy tradeoffs.');
    expect(markup).toContain('DRAFT');
    expect(markup).toContain('Climate');
    expect(markup).toContain('href="/admin/articles/education-funding-101"');
    expect(markup).toContain('Education Funding 101');
    expect(markup).toContain('Understand how school funding decisions are made.');
    expect(markup).toContain('PUBLISHED');
    expect(markup).toContain('Education');
  });

  it('renders the empty state when there are no articles', async () => {
    vi.mocked(getAdminArticlesList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(
      await ArticleListPage({ searchParams: Promise.resolve({}) }),
    );

    expect(getAdminArticlesList).toHaveBeenCalledWith({ status: 'DRAFT' });
    expect(markup).toContain('Articles');
    expect(markup).toContain('No articles yet.');
    expect(markup).toContain('Create an article to populate this list.');
  });
});
