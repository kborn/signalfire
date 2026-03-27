import { makeRequest } from '@/lib/api/base';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';

export async function getActionsList(): Promise<ActionListResponse> {
  return await makeRequest<ActionListResponse>('actions');
}

export async function getActionDetails(slug: string): Promise<ActionDetailResponse> {
  return await makeRequest<ActionDetailResponse>(`actions/${slug}`);
}
