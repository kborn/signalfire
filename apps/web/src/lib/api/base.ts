import { ApiError } from '@/lib/api/error';
import { SubmissionRequest } from '@signal-fire/api-contracts';

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
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

export async function post<T>(req: SubmissionRequest): Promise<T> {
  const url = `${getApiBase()}/submissions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    throw new ApiError(`Request failed for submissions`, response.status, 'submissions');
  }
  return response.json() as Promise<T>;
}
