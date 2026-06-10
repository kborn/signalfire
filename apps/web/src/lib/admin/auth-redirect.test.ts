import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthenticationError } from '@/lib/api/error';

import { withAdminAuthRedirect } from './auth-redirect';

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('withAdminAuthRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated admin page loads to login with next', async () => {
    const error = new AuthenticationError('Unauthorized', 401, 'admin/events');

    await expect(
      withAdminAuthRedirect('/admin/events/42', async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    expect(redirectMock).toHaveBeenCalledWith('/admin/login?next=%2Fadmin%2Fevents%2F42');
  });

  it('rethrows non-auth failures without redirecting', async () => {
    const error = new Error('boom');

    await expect(
      withAdminAuthRedirect('/admin/events/42', async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    expect(redirectMock).not.toHaveBeenCalled();
  });
});
