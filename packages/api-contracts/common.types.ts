import { EVENT_TYPES } from './event-type.constants.js';

export type ActionType = 'GUIDE' | 'LINK' | 'CONTACT' | 'DONATE' | 'VOLUNTEER';

export type EventType = (typeof EVENT_TYPES)[number];

export type ActionSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
  publishedAt: string;
};

export type TopicSummary = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

export type ArticleSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type EventSummary = {
  id: number;
  title: string;
  summary: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginatedListResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
