import { ActionType } from '@prisma/client';

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
