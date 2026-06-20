import { ActionType } from './common.types.js';
import type { EntityStatus } from './submission-type.js';

export type AdminActionRequest = {
  title: string;
  summary: string;
  description: string;
  externalUrl?: string | null;
  actionType: ActionType;
  topicSlugs: string[];
  status: EntityStatus;
};

export type AdminActionSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  actionType: ActionType;
  status: EntityStatus;
  updatedAt: string;
  publishedAt: string | null;
  topicSlugs: string[];
};

export type AdminActionDetailResponse = AdminActionSummary & {
  description: string;
  externalUrl: string | null;
};

export type AdminActionListResponse = {
  items: AdminActionSummary[];
};

export type AdminActionListFilters = {
  status?: EntityStatus;
};
