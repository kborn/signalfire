import { makeRequest } from '@/lib/api/base';
import type { QueryParams } from '@/lib/api/base.shared';

import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

type EventListQuery = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
  page?: string;
  pageSize?: string;
};

export async function getEventsList(req: EventListQuery): Promise<EventListResponse> {
  const endpoint = 'events';
  const params: QueryParams = {
    topicSlug: req.topicSlug,
    startDate: req.startDate,
    endDate: req.endDate,
    city: req.city,
    region: req.region,
    page: req.page != null ? String(req.page) : undefined,
    pageSize: req.pageSize != null ? String(req.pageSize) : undefined,
  };

  return await makeRequest<EventListResponse>(endpoint, params);
}

export async function getEventDetails(id: number): Promise<EventDetailResponse> {
  return await makeRequest<EventDetailResponse>(`events/${id}`);
}
