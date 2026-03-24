import { ActionType, Article, EntityStatus } from '@prisma/client';
import { ArticleListResponse, ArticleDetailResponse } from './article.types';

export const ARTICLE_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');
export const ACTION_TEST_DATE = new Date('2025-12-17T03:24:00.000Z');

export function buildArticleEntity(overrides: Partial<Article> = {}) {
  return {
    id: 1,
    slug: 'protect-voting-rights',
    title: 'Protect Voting Rights',
    summary: 'A short article summary.',
    content: 'Full article content.',
    status: EntityStatus.PUBLISHED,
    author: 'SignalFire Staff',
    createdAt: ARTICLE_TEST_DATE,
    publishedAt: ARTICLE_TEST_DATE,
    updatedAt: ARTICLE_TEST_DATE,
    ...overrides,
  } satisfies Article;
}

export function buildArticleListResponse(
  overrides: Partial<ArticleListResponse> = {},
): ArticleListResponse {
  return {
    items: [
      {
        id: 1,
        slug: 'protect-voting-rights',
        title: 'Protect Voting Rights',
        summary: 'A short article summary.',
        publishedAt: ARTICLE_TEST_DATE.toISOString(),
      },
      {
        id: 2,
        slug: 'how-local-climate-policy-works',
        title: 'How Local Climate Policy Works',
        summary: 'A guide to city-level climate policy.',
        publishedAt: new Date('2025-12-18T03:24:00.000Z').toISOString(),
      },
    ],
    ...overrides,
  };
}

export function buildArticleDetailResponse(
  overrides: Partial<ArticleDetailResponse> = {},
): ArticleDetailResponse {
  return {
    id: 1,
    slug: 'protect-voting-rights',
    title: 'Protect Voting Rights',
    summary: 'A short article summary.',
    author: 'SignalFire Staff',
    content: 'Full article content.',
    publishedAt: ARTICLE_TEST_DATE.toISOString(),
    updatedAt: ARTICLE_TEST_DATE.toISOString(),
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
    ...overrides,
  };
}
