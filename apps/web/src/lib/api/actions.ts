import { makeRequest } from '@/lib/api/base';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';

type ActionListQuery = {
  topicSlug?: string;
  search?: string;
  page?: string;
  pageSize?: string;
};

export async function getActionsList(query: ActionListQuery): Promise<ActionListResponse> {
  const params =
    query.topicSlug || query.search || query.page || query.pageSize
      ? {
          topicSlug: query.topicSlug,
          search: query.search,
          page: query.page,
          pageSize: query.pageSize,
        }
      : undefined;
  return await makeRequest<ActionListResponse>('actions', params);
}

export async function getActionDetails(slug: string): Promise<ActionDetailResponse> {
  return await makeRequest<ActionDetailResponse>(`actions/${slug}`);
}
