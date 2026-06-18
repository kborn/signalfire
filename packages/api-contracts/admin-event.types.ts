import type { EntityStatus } from './submission-type.js';
import { EventType } from './common.types.js';

export type AdminEventRequest = {
  title: string;
  summary: string;
  description: string;
  eventType: EventType;
  startTime: string;
  endTime?: string | null;
  locationName: string;
  publicLocationDescription?: string | null;
  contactEmail?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  website?: string | null;
  topicSlugs: string[];
  status: EntityStatus;
};

export type AdminEventSummary = {
  id: number;
  title: string;
  summary: string;
  eventType: EventType;
  startTime: string;
  endTime: string | null;
  locationName: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  status: EntityStatus;
  updatedAt: string;
  publishedAt: string | null;
  topicSlugs: string[];
};

export type AdminEventDetailResponse = AdminEventSummary & {
  description: string;
  website: string | null;
  contactEmail: string | null;
  publicLocationDescription: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
};

export type AdminEventListResponse = {
  items: AdminEventSummary[];
};

export type AdminEventListFilters = {
  status?: EntityStatus;
};
