import { AuthenticationError } from '@/lib/api/error';
import { redirect } from 'next/navigation';

export function redirectIfAuthenticationError(next: string, error: unknown): never | void {
  if (error instanceof AuthenticationError) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }
}

export async function withAdminAuthRedirect<T>(next: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    redirectIfAuthenticationError(next, error);
    throw error;
  }
}
