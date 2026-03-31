import { makeRequest } from '@/lib/api/base';

import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

export async function getEventsList(topic?: string): Promise<EventListResponse> {
  const endpoint = 'events';
  let params = {};
  if (topic) {
    params = { topicSlug: topic };
  }
  return await makeRequest<EventListResponse>(endpoint, params);
}

export async function getEventDetails(slug: string): Promise<EventDetailResponse> {
  return await makeRequest<EventDetailResponse>(`events/${slug}`);
}
