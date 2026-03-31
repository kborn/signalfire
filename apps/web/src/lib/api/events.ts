import { makeRequest } from '@/lib/api/base';

import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

export async function getEventsList(topicSlug?: string): Promise<EventListResponse> {
  const endpoint = 'events';
  const params = topicSlug ? { topicSlug } : undefined;
  return await makeRequest<EventListResponse>(endpoint, params);
}

export async function getEventDetails(id: number): Promise<EventDetailResponse> {
  return await makeRequest<EventDetailResponse>(`events/${id}`);
}
