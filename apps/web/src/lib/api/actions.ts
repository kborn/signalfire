import { makeRequest } from '@/lib/api/base';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';

export async function getActionsList(topicSlug?: string): Promise<ActionListResponse> {
  const params = topicSlug ? { topicSlug } : undefined;
  return await makeRequest<ActionListResponse>('actions', params);
}

export async function getActionDetails(slug: string): Promise<ActionDetailResponse> {
  return await makeRequest<ActionDetailResponse>(`actions/${slug}`);
}
