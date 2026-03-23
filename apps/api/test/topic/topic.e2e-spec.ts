import { ActionType, EntityStatus } from '@prisma/client';
import request from 'supertest';
import type { TopicDetailResponse, TopicListResponse } from '../../src/topic/topic.types';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import { createTopic } from '../factories/topic.factory';
import { linkTopicAction, linkTopicArticle } from '../factories/relation.factory';
import { setupE2ETest } from '../harness/e2e.harness';

describe('TopicController (e2e)', () => {
  const harness = setupE2ETest();

  it('/topics (GET) returns the topic discovery list', async () => {
    const topic = await createTopic({
      slug: 'topic-with-content',
      name: 'Topic With Content',
      description: 'Topic used for relationship assertions',
    });

    const response = await request(harness.httpServer).get('/topics').expect(200);
    const body = response.body as TopicListResponse;

    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: topic.id,
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
        }),
      ]),
    );
  });

  it('/topics/:slug (GET) returns published related content only', async () => {
    const topic = await createTopic({
      slug: 'topic-detail',
      name: 'Topic Detail',
      description: 'Topic used for topic detail assertions',
    });
    const publishedArticle = await createArticle({
      slug: 'published-article',
      title: 'Published Article',
      summary: 'Published article summary',
      publishedAt: new Date('2026-03-20T15:30:00.000Z'),
    });
    const draftArticle = await createArticle({
      slug: 'draft-article',
      title: 'Draft Article',
      summary: 'Draft article summary',
      status: EntityStatus.DRAFT,
    });
    const publishedAction = await createAction({
      slug: 'published-action',
      title: 'Published Action',
      summary: 'Published action summary',
      actionType: ActionType.CONTACT,
      publishedAt: new Date('2026-03-20T15:30:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      actionType: ActionType.DONATE,
      status: EntityStatus.DRAFT,
    });

    await linkTopicArticle(topic.id, publishedArticle.id);
    await linkTopicArticle(topic.id, draftArticle.id);
    await linkTopicAction(topic.id, publishedAction.id);
    await linkTopicAction(topic.id, draftAction.id);

    const response = await request(harness.httpServer).get(`/topics/${topic.slug}`).expect(200);
    const body = response.body as TopicDetailResponse;

    expect(body).toEqual({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      articles: [
        {
          id: publishedArticle.id,
          slug: publishedArticle.slug,
          title: publishedArticle.title,
          summary: publishedArticle.summary,
          publishedAt: publishedArticle.publishedAt?.toISOString(),
        },
      ],
      actions: [
        {
          id: publishedAction.id,
          slug: publishedAction.slug,
          title: publishedAction.title,
          summary: publishedAction.summary,
          actionType: publishedAction.actionType,
          publishedAt: publishedAction.publishedAt?.toISOString(),
        },
      ],
    });
  });

  it('/topics/:slug (GET) returns 404 when the topic is missing', async () => {
    await request(harness.httpServer).get('/topics/missing-topic').expect(404);
  });
});
