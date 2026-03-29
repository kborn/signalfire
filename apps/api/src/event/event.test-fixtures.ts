import { ActionType, Event, EventType, EntityStatus } from '@prisma/client';
import { EventListResponse, EventDetailResponse } from '@signal-fire/api-contracts';

export const ARTICLE_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');
export const ACTION_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');
export const EVENT_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');

export function buildEventEntity(overrides: Partial<Event> = {}) {
  return {
    id: 1,
    title: 'Town Hall Meeting',
    summary: 'A short event summary.',
    description: 'A longer event description.',
    eventType: EventType.TOWN_HALL,
    status: EntityStatus.PUBLISHED,
    startTime: EVENT_TEST_DATE,
    endTime: EVENT_TEST_DATE,
    locationName: 'City Hall',
    addressRaw: '123 Main St',
    city: 'Springfield',
    region: 'IL',
    postalCode: '62701',
    country: 'USA',
    latitude: null,
    longitude: null,
    createdAt: EVENT_TEST_DATE,
    publishedAt: EVENT_TEST_DATE,
    updatedAt: EVENT_TEST_DATE,
    ...overrides,
  } satisfies Event;
}

export function buildEventListResponse(
  overrides: Partial<EventListResponse> = {},
): EventListResponse {
  return {
    items: [
      {
        id: 1,
        title: 'Town Hall Meeting',
        summary: 'A short event summary.',
        eventType: EventType.TOWN_HALL,
        startTime: EVENT_TEST_DATE.toISOString(),
        endTime: EVENT_TEST_DATE.toISOString(),
        city: 'Springfield',
        region: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    ],
    ...overrides,
  };
}

export function buildEntityDetailResponse(
  overrides: Partial<EventDetailResponse> = {},
): EventDetailResponse {
  return {
    id: 1,
    title: 'Town Hall Meeting',
    summary: 'A short event summary.',
    description: 'A longer event description.',
    eventType: EventType.TOWN_HALL,
    startTime: EVENT_TEST_DATE.toISOString(),
    endTime: EVENT_TEST_DATE.toISOString(),
    locationName: 'City Hall',
    addressRaw: '123 Main St',
    city: 'Springfield',
    region: 'IL',
    postalCode: '62701',
    country: 'USA',
    latitude: null,
    longitude: null,
    publishedAt: EVENT_TEST_DATE.toISOString(),
    updatedAt: EVENT_TEST_DATE.toISOString(),
    topics: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
    actions: [
      {
        id: 1,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        actionType: ActionType.CONTACT,
        publishedAt: ACTION_TEST_DATE.toISOString(),
      },
    ],
    articles: [
      {
        id: 1,
        slug: 'protect-voting-rights',
        title: 'Protect Voting Rights',
        summary: 'A short article summary.',
        publishedAt: ACTION_TEST_DATE.toISOString(),
      },
    ],
    ...overrides,
  };
}
