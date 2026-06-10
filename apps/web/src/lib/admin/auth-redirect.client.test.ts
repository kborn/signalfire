import { describe, expect, it, vi } from 'vitest';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { AuthenticationError } from '@/lib/api/error';

import { withAdminAuthClientRedirect } from './auth-redirect.client';

describe('withAdminAuthClientRedirect', () => {
  it('routes browser-side auth failures back to login with the current next path', async () => {
    const router = {
      push: vi.fn(),
    } as Pick<AppRouterInstance, 'push'> as AppRouterInstance;
    const error = new AuthenticationError('Unauthorized', 401, 'admin/articles');

    window.history.replaceState({}, '', '/admin/articles/community-article?mode=edit');

    await expect(
      withAdminAuthClientRedirect(router, async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    expect(router.push).toHaveBeenCalledWith(
      '/admin/login?next=%2Fadmin%2Farticles%2Fcommunity-article%3Fmode%3Dedit',
    );
  });

  it('rethrows non-auth failures without redirecting', async () => {
    const router = {
      push: vi.fn(),
    } as Pick<AppRouterInstance, 'push'> as AppRouterInstance;
    const error = new Error('boom');

    await expect(
      withAdminAuthClientRedirect(router, async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    expect(router.push).not.toHaveBeenCalled();
  });
});
