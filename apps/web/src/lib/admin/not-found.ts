import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/error';

export async function withNotFoundOn404<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export function parsePositiveIntOrNotFound(value: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    notFound();
  }

  return parsed;
}
