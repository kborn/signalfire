import type { ActionSummary, ArticleSummary, TopicSummary } from './common.types.js';

export type TopicListResponse = {
  items: TopicSummary[];
};

export type TopicDetailResponse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  articles: ArticleSummary[];
  actions: ActionSummary[];
};
