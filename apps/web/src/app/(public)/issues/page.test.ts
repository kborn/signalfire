import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getTopicsList } from '@/lib/api/topics';

import TopicListPage from './page';

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

describe('TopicListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the topics list and topic detail links', async () => {
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [
        {
          id: 1,
          slug: 'climate',
          name: 'Climate',
          description: 'Climate issue overview.',
        },
        {
          id: 2,
          slug: 'education',
          name: 'Education',
          description: 'Education policy and advocacy.',
        },
      ],
    });

    const markup = renderToStaticMarkup(await TopicListPage());

    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Issues');
    expect(markup).toContain(
      'Explore the issues that matter to you and find ways to learn or act.',
    );
    expect(markup).toContain('href="/issues/climate"');
    expect(markup).toContain('Climate');
    expect(markup).toContain('Climate issue overview.');
    expect(markup).toContain('href="/issues/education"');
    expect(markup).toContain('Education');
    expect(markup).toContain('Education policy and advocacy.');
  });

  it('renders the empty state when there are no topics', async () => {
    vi.mocked(getTopicsList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(await TopicListPage());

    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Issues');
    expect(markup).toContain('No issues available yet.');
    expect(markup).not.toContain(
      'Explore the issues that matter to you and find ways to learn or act.',
    );
  });
});
