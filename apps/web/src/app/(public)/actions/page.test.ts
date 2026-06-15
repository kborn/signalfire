import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getActionsList } from '@/lib/api/actions';
import { getTopicsList } from '@/lib/api/topics';

import ActionListPage from './page';

vi.mock('@/lib/api/actions', () => ({
  getActionsList: vi.fn(),
}));

vi.mock('@/lib/api/topics', () => ({
  getTopicsList: vi.fn(),
}));

describe('ActionListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the actions list and action detail links', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
      page: 1,
      pageSize: 10,
      totalItems: 2,
      totalPages: 1,
      items: [
        {
          id: 1,
          slug: 'call-your-state-representative',
          title: 'Call Your State Representative',
          summary: 'Ask for support on climate legislation.',
          actionType: 'CONTACT',
          publishedAt: '2026-03-21T12:00:00.000Z',
        },
        {
          id: 2,
          slug: 'donate-to-local-organizers',
          title: 'Donate to Local Organizers',
          summary: 'Support direct local civic work financially.',
          actionType: 'DONATE',
          publishedAt: '2026-03-22T12:00:00.000Z',
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
      await ActionListPage({ searchParams: Promise.resolve({ topicSlug: 'democracy' }) }),
    );

    expect(getActionsList).toHaveBeenCalledTimes(1);
    expect(getActionsList).toHaveBeenCalledWith('democracy');
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain('Find practical ways to take meaningful action');
    expect(markup).toContain('Topic');
    expect(markup).toContain('href="/actions?topicSlug=democracy"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/actions/call-your-state-representative"');
    expect(markup).toContain('Call Your State Representative');
    expect(markup).toContain('Ask for support on climate legislation.');
    expect(markup).toContain('Contact');
    expect(markup).toContain('March 21, 2026');
    expect(markup).toContain('href="/actions/donate-to-local-organizers"');
    expect(markup).toContain('Donate to Local Organizers');
    expect(markup).toContain('Support direct local civic work financially.');
    expect(markup).toContain('Donate');
    expect(markup).toContain('March 22, 2026');
    expect(markup).not.toContain('CONTACT');
    expect(markup).not.toContain('DONATE');
  });

  it('renders the empty state when there are no actions', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
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
      await ActionListPage({ searchParams: Promise.resolve({ topicSlug: 'democracy' }) }),
    );

    expect(getActionsList).toHaveBeenCalledTimes(1);
    expect(getActionsList).toHaveBeenCalledWith('democracy');
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain('No actions found for this topic yet.');
    expect(markup).not.toContain('Find practical ways to take meaningful action');
  });
});
