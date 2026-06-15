import { makeRequest } from '@/lib/api/base';

import {
  EventListRequest,
  EventDetailResponse,
  EventListResponse,
} from '@signal-fire/api-contracts';

export async function getEventsList(req: EventListRequest): Promise<EventListResponse> {
  const endpoint = 'events';
  return await makeRequest<EventListResponse>(endpoint, req);
}

export async function getEventDetails(id: number): Promise<EventDetailResponse> {
  return await makeRequest<EventDetailResponse>(`events/${id}`);
}
