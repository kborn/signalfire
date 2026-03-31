import { ApiError } from '@/lib/api/error';

function getApiBase() {
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

type QueryParams = Record<string, string | undefined>;

export async function makeRequest<T>(endpoint: string, queryParams?: QueryParams): Promise<T> {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });
  }

  const query = params.toString();
  const url = query ? `${getApiBase()}/${endpoint}?${query}` : `${getApiBase()}/${endpoint}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(`Request failed for ${endpoint}`, response.status, endpoint);
  }
  return response.json() as Promise<T>;
}
