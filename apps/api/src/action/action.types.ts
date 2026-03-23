import { ActionType } from '@prisma/client';

export type ActionListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
};

export type ActionListResponse = {
  items: ActionListItem[];
};

export type ActionDetailTopic = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type ActionDetailArticle = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type ActionDetailResponse = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  updatedAt: string;
  topics: ActionDetailTopic[];
  articles: ActionDetailArticle[];
};
