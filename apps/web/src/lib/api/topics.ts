import { makeRequest } from '@/lib/api/base';
import { TopicDetailResponse, TopicListResponse } from '../../../../api/src/topic/topic.types';

export async function getTopicsList(): Promise<TopicListResponse> {
  return await makeRequest<TopicListResponse>('topics');
}

export async function getTopicDetails(slug: string): Promise<TopicDetailResponse> {
  return await makeRequest<TopicDetailResponse>(`topics/${slug}`);
}
