import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getActionsList } from '@/lib/api/actions';

import ActionListPage from './page';

vi.mock('@/lib/api/actions', () => ({
  getActionsList: vi.fn(),
}));

describe('ActionListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the actions list and action detail links', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
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

    const markup = renderToStaticMarkup(await ActionListPage());

    expect(getActionsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain('Find practical ways to take meaningful action');
    expect(markup).toContain('href="/actions/call-your-state-representative"');
    expect(markup).toContain('Call Your State Representative');
    expect(markup).toContain('Ask for support on climate legislation.');
    expect(markup).toContain('href="/actions/donate-to-local-organizers"');
    expect(markup).toContain('Donate to Local Organizers');
    expect(markup).toContain('Support direct local civic work financially.');
  });

  it('renders the empty state when there are no actions', async () => {
    vi.mocked(getActionsList).mockResolvedValue({
      items: [],
    });

    const markup = renderToStaticMarkup(await ActionListPage());

    expect(getActionsList).toHaveBeenCalledTimes(1);
    expect(markup).toContain('Actions');
    expect(markup).toContain('No actions available yet.');
    expect(markup).not.toContain('Find practical ways to take meaningful action');
  });
});
