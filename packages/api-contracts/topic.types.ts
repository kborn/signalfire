import { ActionType } from './common.types';

type TopicListItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type TopicListResponse = {
  items: TopicListItem[];
};

type TopicDetailArticle = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

type TopicDetailAction = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
  publishedAt: string;
};

export type TopicDetailResponse = {
  id: number;
  slug: string;
  name: string;
  description: string;
  articles: TopicDetailArticle[];
  actions: TopicDetailAction[];
};
