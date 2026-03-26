const envApiBase = {
  development: 'http://localhost:3001',
};

function getEnv() {
  return process.env.NODE_ENV;
}

function getApiBase() {
  const env = getEnv();
  const apiBase = envApiBase[env];
  if (!apiBase) {
    throw Error();
  }
  return apiBase;
}

export async function makeRequest<T>(endpoint: string): Promise<T> {
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/${endpoint}`);
  if (!response.ok) {
    throw Error();
  }
  return response.json() as Promise<T>;
}
