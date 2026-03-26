import { makeRequest } from '@/lib/api/base';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';

export async function getArticlesList(): Promise<ArticleListResponse> {
  return await makeRequest<ArticleListResponse>('articles');
}

export async function getArticleDetails(slug: string): Promise<ArticleDetailResponse> {
  return await makeRequest<ArticleDetailResponse>(`articles/${slug}`);
}
