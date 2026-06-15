import { makeRequest } from '@/lib/api/base';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';

type ArticleListQuery = {
  topicSlug?: string;
  page?: string;
  pageSize?: string;
};

export async function getArticlesList(query: ArticleListQuery = {}): Promise<ArticleListResponse> {
  const params =
    query.topicSlug || query.page || query.pageSize
      ? {
          topicSlug: query.topicSlug,
          page: query.page,
          pageSize: query.pageSize,
        }
      : undefined;

  return await makeRequest<ArticleListResponse>('articles', params);
}

export async function getArticleDetails(slug: string): Promise<ArticleDetailResponse> {
  return await makeRequest<ArticleDetailResponse>(`articles/${slug}`);
}
