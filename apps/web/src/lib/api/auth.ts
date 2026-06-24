import { makeAuthenticatedRequest, postAuthenticatedJson } from '@/lib/api/base';
import { AdminLoginRequest, AdminSessionResponse } from '@signal-fire/api-contracts';
import { ApiError, AuthenticationError } from '@/lib/api/error';

// Login and logout go through Next.js proxy routes so the session cookie
// is scoped to the web domain rather than the API domain.
export async function login(req: AdminLoginRequest): Promise<{ ok: boolean }> {
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthenticationError('Authentication failed', response.status, 'admin/auth/login');
    }
    throw new ApiError('Login failed', response.status, 'admin/auth/login');
  }

  return (await response.json()) as { ok: boolean };
}

export async function logout(): Promise<{ ok: boolean }> {
  const response = await fetch('/api/admin/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  return (await response.json()) as { ok: boolean };
}

export async function getSession(): Promise<AdminSessionResponse> {
  return await makeAuthenticatedRequest<AdminSessionResponse>('admin/auth/session');
}
