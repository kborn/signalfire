import { makeAuthenticatedRequest, postAuthenticatedJson } from '@/lib/api/base';
import { AdminLoginRequest, AdminSessionResponse } from '@signal-fire/api-contracts';

export async function login(req: AdminLoginRequest): Promise<{ ok: boolean }> {
  return await postAuthenticatedJson<{ ok: boolean }>('admin/auth/login', req);
}

export async function logout(): Promise<{ ok: boolean }> {
  return await postAuthenticatedJson<{ ok: boolean }>('admin/auth/logout', {});
}

export async function getSession(): Promise<AdminSessionResponse> {
  return await makeAuthenticatedRequest<AdminSessionResponse>('admin/auth/session');
}
