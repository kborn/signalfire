import { makeRequest } from '@/lib/api/base';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

export async function getEventsList(topic?: string): Promise<EventListResponse> {
  let endpoint = 'events';
  if (topic) {
    endpoint = `events?topicSlug=${topic}`;
  }
  return await makeRequest<EventListResponse>(endpoint);
}

export async function getEventDetails(slug: string): Promise<EventDetailResponse> {
  return await makeRequest<EventDetailResponse>(`events/${slug}`);
}
