import {
  ActionSummary,
  ArticleSummary,
  PaginatedListResponse,
  PaginationParams,
  TopicSummary,
} from './common.types.js';

export type ArticleListRequest = PaginationParams & {
  topicSlug?: string;
  search?: string;
};

export type ArticleListResponse = PaginatedListResponse<ArticleSummary>;

export type ArticleDetailResponse = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  author: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  topics: TopicSummary[];
  actions: ActionSummary[];
};
