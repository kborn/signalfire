import { ActionType, EntityStatus } from '@prisma/client';
import { ActionDetailResponse } from './action.types';
import { ActionDetailRecord } from './action.repository.types';

export const ACTION_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');

export function buildActionEntity(overrides: Partial<ActionDetailRecord> = {}) {
  return {
    id: 1,
    slug: 'call-your-representative',
    title: 'Call Your Representative',
    summary: 'A short action summary.',
    description: 'A longer action description.',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    createdAt: ACTION_TEST_DATE,
    updatedAt: ACTION_TEST_DATE,
    topicActions: [],
    articleActions: [],
    ...overrides,
  } satisfies ActionDetailRecord;
}

export function buildActionDetailRecord(
  overrides: Partial<ActionDetailRecord> = {},
): ActionDetailRecord {
  return buildActionEntity({
    topicActions: [
      {
        topicId: 1,
        actionId: 1,
        assignedAt: ACTION_TEST_DATE,
        assignedBy: 'SignalFire Staff',
        topic: {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'desc',
          createdAt: ACTION_TEST_DATE,
        },
      },
    ],
    articleActions: [
      {
        articleId: 1,
        actionId: 1,
        assignedAt: ACTION_TEST_DATE,
        assignedBy: 'SignalFire Staff',
        article: {
          id: 1,
          slug: 'protect-voting-rights',
          title: 'Protect Voting Rights',
          summary: 'A short article summary.',
          content: 'Full article content.',
          status: EntityStatus.PUBLISHED,
          author: 'SignalFire Staff',
          createdAt: ACTION_TEST_DATE,
          publishedAt: ACTION_TEST_DATE,
          updatedAt: ACTION_TEST_DATE,
        },
      },
    ],
    ...overrides,
  });
}

export function buildActionDetailResponse(
  overrides: Partial<ActionDetailResponse> = {},
): ActionDetailResponse {
  return {
    id: 1,
    slug: 'call-your-representative',
    title: 'Call Your Representative',
    summary: 'A short action summary.',
    description: 'A longer action description.',
    actionType: ActionType.CONTACT,
    updatedAt: ACTION_TEST_DATE.toISOString(),
    topics: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
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
