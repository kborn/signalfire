import { ActionType } from '@prisma/client';

export type ArticleListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type ArticleListResponse = {
  items: ArticleListItem[];
};

export type ArticleDetailTopic = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type ArticleDetailAction = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
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
  topics: ArticleDetailTopic[];
  actions: ArticleDetailAction[];
};
