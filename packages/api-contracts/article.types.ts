import { ActionSummary, ArticleSummary, TopicSummary } from './common.types.js';

export type ArticleListResponse = {
  items: ArticleSummary[];
};

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
