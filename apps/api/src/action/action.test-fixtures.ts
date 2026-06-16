import { Action, ActionType, EntityStatus } from '@prisma/client';
import {
  ActionDetailResponse,
  ActionListResponse,
  AdminActionDetailResponse,
  AdminActionListResponse,
} from '@signal-fire/api-contracts';
import type { ActionWithTopics } from './action.repository';

export const ACTION_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');

export function buildActionEntity(overrides: Partial<Action> = {}) {
  return {
    id: 1,
    slug: 'call-your-representative',
    title: 'Call Your Representative',
    summary: 'A short action summary.',
    description: 'A longer action description.',
    actionType: ActionType.CONTACT,
    status: EntityStatus.PUBLISHED,
    createdAt: ACTION_TEST_DATE,
    publishedAt: ACTION_TEST_DATE,
    updatedAt: ACTION_TEST_DATE,
    ...overrides,
  } satisfies Action;
}

export function buildActionListResponse(
  overrides: Partial<ActionListResponse> = {},
): ActionListResponse {
  return {
    items: [
      {
        id: 1,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        actionType: ActionType.CONTACT,
        publishedAt: ACTION_TEST_DATE.toISOString(),
      },
      {
        id: 2,
        slug: 'join-neighborhood-climate-coalition',
        title: 'Join A Neighborhood Climate Coalition',
        summary: 'Work with local residents on recurring climate pressure campaigns.',
        actionType: ActionType.VOLUNTEER,
        publishedAt: ACTION_TEST_DATE.toISOString(),
      },
    ],
    page: 1,
    pageSize: 10,
    totalItems: 2,
    totalPages: 1,
    ...overrides,
  };
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
    publishedAt: ACTION_TEST_DATE.toISOString(),
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

export function buildActionWithTopicsEntity(
  overrides: Partial<ActionWithTopics> = {},
): ActionWithTopics {
  return {
    ...buildActionEntity(),
    topicActions: [
      {
        topicId: 1,
        actionId: 1,
        assignedAt: ACTION_TEST_DATE,
        assignedBy: 'admin',
        topic: {
          id: 1,
          slug: 'democracy',
          name: 'Democracy',
          description: 'desc',
          createdAt: ACTION_TEST_DATE,
        },
      },
    ],
    ...overrides,
  } satisfies ActionWithTopics;
}

export function buildAdminActionListResponse(
  overrides: Partial<AdminActionListResponse> = {},
): AdminActionListResponse {
  return {
    items: [
      {
        id: 1,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        actionType: ActionType.CONTACT,
        status: 'PUBLISHED',
        updatedAt: ACTION_TEST_DATE.toISOString(),
        publishedAt: ACTION_TEST_DATE.toISOString(),
        topicSlugs: ['democracy'],
      },
      {
        id: 2,
        slug: 'join-neighborhood-climate-coalition',
        title: 'Join A Neighborhood Climate Coalition',
        summary: 'Work with local residents on recurring climate pressure campaigns.',
        actionType: ActionType.VOLUNTEER,
        status: 'DRAFT',
        updatedAt: ACTION_TEST_DATE.toISOString(),
        publishedAt: null,
        topicSlugs: ['local-community'],
      },
    ],
    ...overrides,
  };
}

export function buildAdminActionDetailResponse(
  overrides: Partial<AdminActionDetailResponse> = {},
): AdminActionDetailResponse {
  return {
    id: 1,
    slug: 'call-your-representative',
    title: 'Call Your Representative',
    summary: 'A short action summary.',
    description: 'A longer action description.',
    actionType: ActionType.CONTACT,
    status: 'PUBLISHED',
    updatedAt: ACTION_TEST_DATE.toISOString(),
    publishedAt: ACTION_TEST_DATE.toISOString(),
    topicSlugs: ['democracy'],
    ...overrides,
  };
}
