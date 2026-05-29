import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSubmissionsList } from '@/lib/api/admin';

import SubmissionListPage from './page';

vi.mock('@/lib/api/admin', () => ({
  getSubmissionsList: vi.fn(),
}));

describe('SubmissionListPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the pending empty state with queue context', async () => {
    vi.mocked(getSubmissionsList).mockResolvedValue({ items: [] });

    const markup = renderToStaticMarkup(
      await SubmissionListPage({ searchParams: Promise.resolve({ status: 'PENDING' }) }),
    );

    expect(markup).toContain('No pending submissions right now.');
    expect(markup).toContain('New community article and event submissions will appear here');
    expect(markup).not.toContain('No data available.');
  });

  it('renders status and type-aware empty state copy', async () => {
    vi.mocked(getSubmissionsList).mockResolvedValue({ items: [] });

    const markup = renderToStaticMarkup(
      await SubmissionListPage({
        searchParams: Promise.resolve({ status: 'APPROVED', type: 'EVENT' }),
      }),
    );

    expect(getSubmissionsList).toHaveBeenCalledWith({
      status: 'APPROVED',
      submissionType: 'EVENT',
    });
    expect(markup).toContain('No event submissions match this approved view.');
    expect(markup).toContain('Try a different status or clear the type filter');
  });
});
