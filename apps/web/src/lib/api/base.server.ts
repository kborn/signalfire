import 'server-only';

import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@signal-fire/api-contracts';
import { ApiError } from '@/lib/api/error';

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

type QueryParams = Record<string, string | undefined>;

function buildUrl(endpoint: string, queryParams?: QueryParams): string {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  return query ? `${getApiBase()}/${endpoint}?${query}` : `${getApiBase()}/${endpoint}`;
}

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
