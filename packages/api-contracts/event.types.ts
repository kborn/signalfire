import {
  ActionSummary,
  ArticleSummary,
  EventSummary,
  EventType,
  PaginatedListResponse,
  PaginationParams,
  TopicSummary,
} from './common.types.js';

export type EventListResponse = PaginatedListResponse<EventSummary>;

export type EventDetailResponse = {
  id: number;
  title: string;
  summary: string;
  description: string;
  website: string | null;
  contactEmail: string | null;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  locationName: string;
  publicLocationDescription: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
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

export type EventListRequest = PaginationParams & {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
};
