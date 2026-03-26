import { ApiError } from '@/lib/api/error';

function getApiBase() {
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

export async function makeRequest<T>(endpoint: string): Promise<T> {
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/${endpoint}`);
  if (!response.ok) {
    throw new ApiError(`Request failed for ${endpoint}`, response.status, endpoint);
  }
  return response.json() as Promise<T>;
}
