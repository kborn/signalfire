import { ActionType } from '@prisma/client';

export type TopicListItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type TopicListResponse = {
  items: TopicListItem[];
};

export type TopicDetailArticle = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type TopicDetailAction = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
};

export type TopicDetailResponse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  articles: TopicDetailArticle[];
  actions: TopicDetailAction[];
};
