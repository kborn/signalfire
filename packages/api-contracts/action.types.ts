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
};

export type ActionListResponse = PaginatedListResponse<ActionSummary>;

export type ActionDetailResponse = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  updatedAt: string;
  publishedAt: string;
  topics: TopicSummary[];
  articles: ArticleSummary[];
};
