import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSubmissionsList } from '@/lib/api/admin';

import AdminPage from './page';

vi.mock('@/lib/api/admin', () => ({
  getSubmissionsList: vi.fn(),
}));

describe('AdminPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders live moderation counts from the submission API', async () => {
    vi.mocked(getSubmissionsList)
      .mockResolvedValueOnce({ items: [{ id: 1 }] } as never)
      .mockResolvedValueOnce({ items: [{ id: 2 }, { id: 3 }] } as never)
      .mockResolvedValueOnce({ items: [] } as never);

    const markup = renderToStaticMarkup(await AdminPage());

    expect(getSubmissionsList).toHaveBeenNthCalledWith(1, { status: 'PENDING' });
    expect(getSubmissionsList).toHaveBeenNthCalledWith(2, { status: 'APPROVED' });
    expect(getSubmissionsList).toHaveBeenNthCalledWith(3, { status: 'REJECTED' });
    expect(markup).toContain('Pending review');
    expect(markup).toContain('Submissions awaiting review are the primary moderation queue.');
    expect(markup).toContain('class="adminStat">1');
    expect(markup).toContain('class="adminStat">2');
    expect(markup).toContain('class="adminStat">0');
    expect(markup).not.toContain('after the moderation API is connected');
  });
});
