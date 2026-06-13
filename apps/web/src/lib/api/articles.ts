import { makeRequest } from '@/lib/api/base';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';

export async function getArticlesList(topicSlug?: string): Promise<ArticleListResponse> {
  const params = topicSlug ? { topicSlug } : undefined;
  return await makeRequest<ArticleListResponse>('articles', params);
}

export async function getArticleDetails(slug: string): Promise<ArticleDetailResponse> {
  return await makeRequest<ArticleDetailResponse>(`articles/${slug}`);
}
