import { ActionType, ArticleSummary, TopicSummary } from './common.types.js';
export type EntityStatus = 'DRAFT' | 'PUBLISHED';

export type AdminActionRequest = {
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  topicSlugs: string[];
  status: EntityStatus;
};

export type AdminActionResponse = {
  id: number;
  slug: string;
};

export type AdminActionSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
  status: EntityStatus;
  updatedAt: string;
  publishedAt: string | null;
};

export type AdminActionDetailResponse = AdminActionSummary & {
  description: string;
  topics: TopicSummary[];
  articles: ArticleSummary[];
};

export type AdminActionListResponse = {
  items: AdminActionSummary[];
};

export type AdminActionListFilters = {
  status?: EntityStatus;
};
