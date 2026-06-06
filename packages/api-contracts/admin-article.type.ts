import type { EntityStatus } from './submission_type.js';

export type AdminArticleRequest = {
  title: string;
  summary: string;
  content: string;
  status: EntityStatus;
  author: string;
  topicSlugs: string[];
};

export type AdminArticleSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  status: EntityStatus;
  author: string;
  updatedAt: string;
  publishedAt: string | null;
  topicSlugs: string[];
};

export type AdminArticleDetailResponse = AdminArticleSummary & {
  content: string;
};

export type AdminArticleListResponse = {
  items: AdminArticleSummary[];
};

export type AdminArticleListFilters = {
  status?: EntityStatus;
};
