import { postJson } from '@/lib/api/base';
import { AdminLoginRequest } from '@signal-fire/api-contracts';

export async function login(req: AdminLoginRequest): Promise<{ ok: boolean }> {
  return await postJson<{ ok: boolean }>('admin/auth/login', req);
}

// export async function getActionDetails(slug: string): Promise<ActionDetailResponse> {
//   return await makeRequest<ActionDetailResponse>(`actions/${slug}`);
// }
