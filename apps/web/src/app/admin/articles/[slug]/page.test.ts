import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAdminArticleDetails } from '@/lib/api/admin';
import { getTopicsList } from '@/lib/api/topics';

import AdminArticleDetailPage from './page';
import ArticleEditorForm from '@/app/admin/articles/_components/ArticleEditorForm';
import ArticleMetadataPanel from '@/app/admin/articles/_components/ArticleMetadataPanel';

vi.mock('@/lib/api/admin', () => ({
  getAdminArticleDetails: vi.fn(),
  getAdminArticlesList: vi.fn(),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

vi.mock('@/app/admin/articles/_components/ArticleEditorForm', () => ({
  default: vi.fn(() => null),
}));

vi.mock('@/app/admin/articles/_components/ArticleMetadataPanel', () => ({
  default: vi.fn(() => null),
}));

describe('AdminArticleDetailPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads the article and topics and passes edit defaults into the editor', async () => {
    vi.mocked(getAdminArticleDetails).mockResolvedValue({
      id: 42,
      slug: 'climate-article',
      title: 'Climate Article',
      summary: 'Existing summary',
      content: 'Existing content',
      author: 'Existing author',
      status: 'DRAFT',
      updatedAt: '2026-03-21T12:00:00.000Z',
      publishedAt: null,
      topicSlugs: ['climate'],
    });
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        { id: 1, slug: 'climate', name: 'Climate', description: 'Climate overview.' },
        { id: 2, slug: 'education', name: 'Education', description: 'Education overview.' },
      ],
    });

    const markup = renderToStaticMarkup(
      await AdminArticleDetailPage({ params: Promise.resolve({ slug: 'climate-article' }) }),
    );

    expect(getAdminArticleDetails).toHaveBeenCalledWith('climate-article');
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('← Back to articles');
    expect(markup).toContain('Edit Article');
    expect(markup).toContain('Update the article while keeping its bookmarked slug stable.');

    expect(vi.mocked(ArticleMetadataPanel)).toHaveBeenCalledWith(
      expect.objectContaining({
        article: expect.objectContaining({
          slug: 'climate-article',
          status: 'DRAFT',
        }),
      }),
      undefined,
    );

    expect(vi.mocked(ArticleEditorForm)).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'edit',
        topics: expect.arrayContaining([
          expect.objectContaining({ slug: 'climate' }),
          expect.objectContaining({ slug: 'education' }),
        ]),
        initialValues: expect.objectContaining({
          slug: 'climate-article',
          title: 'Climate Article',
          summary: 'Existing summary',
          content: 'Existing content',
          author: 'Existing author',
          topicSlugs: ['climate'],
        }),
      }),
      undefined,
    );
  });
});
