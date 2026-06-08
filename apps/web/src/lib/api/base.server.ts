import 'server-only';

import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@signal-fire/api-contracts';
import { buildUrl, type QueryParams } from '@/lib/api/base.shared';
import { ApiError } from '@/lib/api/error';

export async function makeServerAdminRequest<T>(
  endpoint: string,
  queryParams?: QueryParams,
): Promise<T> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(COOKIE_NAME);

  const headers = new Headers();
  if (adminSession) {
    headers.set('Cookie', `${COOKIE_NAME}=${adminSession.value}`);
  }

  const response = await fetch(buildUrl(endpoint, queryParams), {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ApiError(`Request failed for ${endpoint}`, response.status, endpoint);
  }

  return (await response.json()) as Promise<T>;
}
