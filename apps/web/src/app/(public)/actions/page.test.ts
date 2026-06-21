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
      page: 9,
      pageSize: 10,
      totalItems: 180,
      totalPages: 15,
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
      await ActionListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '9', pageSize: '10' }),
      }),
    );

    expect(getActionsList).toHaveBeenCalledTimes(1);
    expect(getActionsList).toHaveBeenCalledWith({
      topicSlug: 'democracy',
      page: '9',
      pageSize: '10',
    });
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain(
      'One concrete step, taken seriously, is worth more than ten articles saved to read later.',
    );
    expect(markup).toContain('Issue');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=10"');
    expect(markup).toContain('Results per page');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=5"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=20"');
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
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=1&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=7&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=8&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=9&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=10&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=11&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=15&amp;pageSize=10"');
    expect(markup).toContain('Previous');
    expect(markup).toContain('Next');
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
    expect(getActionsList).toHaveBeenCalledWith({
      topicSlug: 'democracy',
      page: undefined,
      pageSize: undefined,
    });
    expect(getTopicsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain('No actions match this issue yet.');
    expect(markup).toContain(
      'One concrete step, taken seriously, is worth more than ten articles saved to read later.',
    );
    expect(markup).toContain('Issue');
    expect(markup).toContain('Results per page');
  });

  it('renders a recoverable empty page state when the requested page has no items', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
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
      await ActionListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '9', pageSize: '10' }),
      }),
    );

    expect(markup).toContain('These filters still have actions available.');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;page=8&amp;pageSize=10"');
    expect(markup).toContain('Results per page');
  });

  it('resets the page query when changing topics and page size', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
      page: 4,
      pageSize: 20,
      totalItems: 100,
      totalPages: 4,
      items: [
        {
          id: 1,
          slug: 'call-your-state-representative',
          title: 'Call Your State Representative',
          summary: 'Ask for support on climate legislation.',
          actionType: 'CONTACT',
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
        {
          id: 2,
          slug: 'climate',
          name: 'Climate',
          description: 'Climate action and accountability.',
        },
      ],
    });

    const markup = renderToStaticMarkup(
      await ActionListPage({
        searchParams: Promise.resolve({ topicSlug: 'democracy', page: '4', pageSize: '20' }),
      }),
    );

    expect(markup).toContain('href="/actions?pageSize=20"');
    expect(markup).toContain('href="/actions?topicSlug=climate&amp;pageSize=20"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=5"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=10"');
    expect(markup).toContain('href="/actions?topicSlug=democracy&amp;pageSize=20"');
    expect(markup).not.toContain('href="/actions?topicSlug=democracy&amp;page=4&amp;pageSize=10"');
  });
});
