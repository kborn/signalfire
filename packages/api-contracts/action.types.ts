import {
  ActionSummary,
  ActionType,
  ArticleSummary,
  PaginatedListResponse,
  PaginationParams,
  TopicSummary,
} from './common.types.js';

export type ActionListRequest = PaginationParams & {
  topicSlug?: string;
  search?: string;
};

export type ActionListResponse = PaginatedListResponse<ActionSummary>;

export type ActionDetailResponse = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  externalUrl: string | null;
  actionType: ActionType;
  updatedAt: string;
  publishedAt: string;
  topics: TopicSummary[];
  articles: ArticleSummary[];
};
