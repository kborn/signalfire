import { ActionSummary, ActionType, ArticleSummary, TopicSummary } from './common.types.js';

export type ActionListResponse = {
  items: ActionSummary[];
};

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
