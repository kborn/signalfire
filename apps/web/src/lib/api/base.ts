import { ApiError } from '@/lib/api/error';

function getApiBase() {
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

export async function makeRequest<T>(endpoint: string, queryParams?): Promise<T> {
  let query: string | null = null;
  if (queryParams) {
    const params = new URLSearchParams();
    queryParams.map((param) => {
      params.set(param, queryParams.param);
    });
    query = params.toString();
  }
  if (query) {
    endpoint += '??' + query;
  }
  const url = `${getApiBase()}/${endpoint}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(`Request failed for ${endpoint}`, response.status, endpoint);
  }
  return response.json() as Promise<T>;
}
