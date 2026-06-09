import { makeServerAdminRequest } from '@/lib/api/base.server';
import { AdminSessionResponse } from '@signal-fire/api-contracts';

export async function getSession(): Promise<AdminSessionResponse> {
  return await makeServerAdminRequest<AdminSessionResponse>('admin/auth/session');
}
