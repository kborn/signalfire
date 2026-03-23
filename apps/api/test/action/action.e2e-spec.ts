import { ActionType, EntityStatus } from '@prisma/client';
import request from 'supertest';
import type { ActionDetailResponse, ActionListResponse } from '../../src/action/action.types';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import { createTopic } from '../factories/topic.factory';
import { linkArticleAction, linkTopicAction } from '../factories/relation.factory';
import { setupE2ETest } from '../harness/e2e.harness';

describe('ActionController (e2e)', () => {
  const harness = setupE2ETest();

  it('/actions (GET) returns published actions ordered by newest publishedAt first', async () => {
    const olderAction = await createAction({
      slug: 'older-action',
      title: 'Older Action',
      summary: 'Older action summary',
      actionType: ActionType.DONATE,
      publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const newerAction = await createAction({
      slug: 'newer-action',
      title: 'Newer Action',
      summary: 'Newer action summary',
      actionType: ActionType.CONTACT,
      publishedAt: new Date('2026-01-02T00:00:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      actionType: ActionType.GUIDE,
      status: EntityStatus.DRAFT,
    });

    const response = await request(harness.httpServer).get('/actions').expect(200);
    const body = response.body as ActionListResponse;
    const olderIndex = body.items.findIndex((action) => action.slug === olderAction.slug);
    const newerIndex = body.items.findIndex((action) => action.slug === newerAction.slug);

    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: olderAction.id,
          slug: olderAction.slug,
          title: olderAction.title,
          summary: olderAction.summary,
          actionType: olderAction.actionType,
          publishedAt: olderAction.publishedAt?.toISOString(),
        }),
        expect.objectContaining({
          id: newerAction.id,
          slug: newerAction.slug,
          title: newerAction.title,
          summary: newerAction.summary,
          actionType: newerAction.actionType,
          publishedAt: newerAction.publishedAt?.toISOString(),
        }),
      ]),
    );
    expect(body.items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: draftAction.slug })]),
    );
    expect(olderIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('/actions/:slug (GET) returns the published action detail payload', async () => {
    const topic = await createTopic({
      slug: 'action-topic',
      name: 'Action Topic',
      description: 'Topic used for action detail assertions',
    });
    const action = await createAction({
      slug: 'published-action',
      title: 'Published Action',
      summary: 'Published action summary',
      description: 'Published action description',
      actionType: ActionType.CONTACT,
      publishedAt: new Date('2026-03-12T00:00:00.000Z'),
    });
    const publishedArticle = await createArticle({
      slug: 'published-article',
      title: 'Published Article',
      summary: 'Published article summary',
      publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    });
    const draftArticle = await createArticle({
      slug: 'draft-article',
      title: 'Draft Article',
      summary: 'Draft article summary',
      status: EntityStatus.DRAFT,
    });

    await linkTopicAction(topic.id, action.id);
    await linkArticleAction(publishedArticle.id, action.id);
    await linkArticleAction(draftArticle.id, action.id);

    const response = await request(harness.httpServer).get(`/actions/${action.slug}`).expect(200);
    const body = response.body as ActionDetailResponse;

    expect(body).toEqual({
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      description: action.description,
      actionType: action.actionType,
      updatedAt: action.updatedAt.toISOString(),
      publishedAt: action.publishedAt?.toISOString(),
      topics: [
        {
          id: topic.id,
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
        },
      ],
      articles: [
        {
          id: publishedArticle.id,
          slug: publishedArticle.slug,
          title: publishedArticle.title,
          summary: publishedArticle.summary,
          publishedAt: publishedArticle.publishedAt?.toISOString(),
        },
      ],
    });
  });

  it('/actions/:slug (GET) returns 404 when the action is missing', async () => {
    await request(harness.httpServer).get('/actions/missing-action').expect(404);
  });

  it('/actions/:slug (GET) returns 404 when the action is unpublished', async () => {
    const action = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      actionType: ActionType.DONATE,
      status: EntityStatus.DRAFT,
    });

    await request(harness.httpServer).get(`/actions/${action.slug}`).expect(404);
  });
});
