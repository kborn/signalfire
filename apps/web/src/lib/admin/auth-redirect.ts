import { AuthenticationError } from '@/lib/api/error';
import { redirect } from 'next/navigation';

export function redirectIfAuthenticationError(error: unknown): never | void {
  if (error instanceof AuthenticationError) {
    redirect('/admin/login');
  }
}

export async function withAdminAuthRedirect<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    redirectIfAuthenticationError(error);
    throw error;
  }
}
