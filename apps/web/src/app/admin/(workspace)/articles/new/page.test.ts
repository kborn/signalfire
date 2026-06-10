import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTopicsList } from '@/lib/api/topics';

import NewAdminArticlePage from './page';
import ArticleEditorForm from '@/app/admin/(workspace)/articles/_components/ArticleEditorForm';

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

vi.mock('@/app/admin/(workspace)/articles/_components/ArticleEditorForm', () => ({
  default: vi.fn(() => null),
}));

describe('NewAdminArticlePage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads topics and passes create defaults into the editor', async () => {
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        { id: 1, slug: 'climate', name: 'Climate', description: 'Climate overview.' },
        { id: 2, slug: 'education', name: 'Education', description: 'Education overview.' },
      ],
    });

    const markup = renderToStaticMarkup(await NewAdminArticlePage());

    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('← Back to articles');
    expect(markup).toContain('New Article');
    expect(markup).toContain('Create a curated article. The slug is generated from the title');

    expect(vi.mocked(ArticleEditorForm)).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'create',
        topics: expect.arrayContaining([
          expect.objectContaining({ slug: 'climate' }),
          expect.objectContaining({ slug: 'education' }),
        ]),
        initialValues: expect.objectContaining({
          slug: '',
          title: '',
          summary: '',
          content: '',
          author: '',
          topicSlugs: [],
        }),
      }),
      undefined,
    );
  });
});
