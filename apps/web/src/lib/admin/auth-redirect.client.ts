import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AuthenticationError } from '@/lib/api/error';

export function redirectClientIfAuthenticationError(
  error: unknown,
  router: AppRouterInstance,
): never | void {
  if (error instanceof AuthenticationError) {
    router.push('/admin/login');
  }
}

export async function withAdminAuthClientRedirect<T>(
  router: AppRouterInstance,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    redirectClientIfAuthenticationError(error, router);
    throw error;
  }
}
