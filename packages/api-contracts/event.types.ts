import {
  ActionSummary,
  ArticleSummary,
  EventSummary,
  EventType,
  TopicSummary,
} from './common.types.js';

export type EventListResponse = {
  items: EventSummary[];
};

export type EventDetailResponse = {
  id: number;
  title: string;
  summary: string;
  description: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  locationName: string;
  addressRaw: string;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  publishedAt: string;
  updatedAt: string;
  topics: TopicSummary[];
  articles: ArticleSummary[];
  actions: ActionSummary[];
};
