export type QueryParams = Record<string, string | undefined>;

export function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    throw new Error('No API base URL configured!');
  }
  return apiBase;
}

export function buildUrl(endpoint: string, queryParams?: QueryParams): string {
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
