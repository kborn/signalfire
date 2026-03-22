import { ActionType } from '@prisma/client';
import { TopicDetailResponse, TopicListResponse } from './topic.types';

export function buildTopicListResponse(
  overrides: Partial<TopicListResponse> = {},
): TopicListResponse {
  return {
    items: [
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
      },
      {
        id: 2,
        slug: 'climate',
        name: 'Climate',
        description: 'desc',
      },
    ],
    ...overrides,
  };
}

export function buildTopicDetailResponse(
  overrides: Partial<TopicDetailResponse> = {},
): TopicDetailResponse {
  return {
    id: 1,
    slug: 'democracy',
    name: 'Democracy',
    description: 'desc',
    articles: [
      {
        id: 11,
        slug: 'protect-voting-rights',
        title: 'Protect Voting Rights',
        summary: 'A short article summary.',
        publishedAt: '2026-03-20T15:30:00.000Z',
      },
    ],
    actions: [
      {
        id: 21,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        actionType: ActionType.CONTACT,
      },
    ],
    ...overrides,
  };
}
