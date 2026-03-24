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
    const firstTopic = await createTopic({
      slug: 'topic-first',
      name: 'Topic First',
      description: 'First topic used for ordering assertions',
    });
    const secondTopic = await createTopic({
      slug: 'topic-second',
      name: 'Topic Second',
      description: 'Second topic used for ordering assertions',
    });

    const response = await request(harness.httpServer).get('/topics').expect(200);
    const body = response.body as TopicListResponse;
    const firstIndex = body.items.findIndex((topic) => topic.slug === firstTopic.slug);
    const secondIndex = body.items.findIndex((topic) => topic.slug === secondTopic.slug);

    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstTopic.id,
          slug: firstTopic.slug,
          name: firstTopic.name,
          description: firstTopic.description,
        }),
        expect.objectContaining({
          id: secondTopic.id,
          slug: secondTopic.slug,
          name: secondTopic.name,
          description: secondTopic.description,
        }),
      ]),
    );
    expect(firstIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(firstTopic.id).toBeLessThan(secondTopic.id);
    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it('/topics/:slug (GET) returns published related content only', async () => {
    const topic = await createTopic({
      slug: 'topic-detail',
      name: 'Topic Detail',
      description: 'Topic used for topic detail assertions',
    });
    const firstPublishedArticle = await createArticle({
      slug: 'published-article-first',
      title: 'Published Article First',
      summary: 'Published article summary first',
      publishedAt: new Date('2026-03-20T15:30:00.000Z'),
    });
    const secondPublishedArticle = await createArticle({
      slug: 'published-article-second',
      title: 'Published Article Second',
      summary: 'Published article summary second',
      publishedAt: new Date('2026-03-21T15:30:00.000Z'),
    });
    const draftArticle = await createArticle({
      slug: 'draft-article',
      title: 'Draft Article',
      summary: 'Draft article summary',
      status: EntityStatus.DRAFT,
    });
    const firstPublishedAction = await createAction({
      slug: 'published-action-first',
      title: 'Published Action First',
      summary: 'Published action summary first',
      actionType: ActionType.CONTACT,
      publishedAt: new Date('2026-03-20T15:30:00.000Z'),
    });
    const secondPublishedAction = await createAction({
      slug: 'published-action-second',
      title: 'Published Action Second',
      summary: 'Published action summary second',
      actionType: ActionType.DONATE,
      publishedAt: new Date('2026-03-21T15:30:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      actionType: ActionType.DONATE,
      status: EntityStatus.DRAFT,
    });

    await linkTopicArticle(topic.id, firstPublishedArticle.id);
    await linkTopicArticle(topic.id, secondPublishedArticle.id);
    await linkTopicArticle(topic.id, draftArticle.id);
    await linkTopicAction(topic.id, firstPublishedAction.id);
    await linkTopicAction(topic.id, secondPublishedAction.id);
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
          id: firstPublishedArticle.id,
          slug: firstPublishedArticle.slug,
          title: firstPublishedArticle.title,
          summary: firstPublishedArticle.summary,
          publishedAt: firstPublishedArticle.publishedAt?.toISOString(),
        },
        {
          id: secondPublishedArticle.id,
          slug: secondPublishedArticle.slug,
          title: secondPublishedArticle.title,
          summary: secondPublishedArticle.summary,
          publishedAt: secondPublishedArticle.publishedAt?.toISOString(),
        },
      ],
      actions: [
        {
          id: firstPublishedAction.id,
          slug: firstPublishedAction.slug,
          title: firstPublishedAction.title,
          summary: firstPublishedAction.summary,
          actionType: firstPublishedAction.actionType,
          publishedAt: firstPublishedAction.publishedAt?.toISOString(),
        },
        {
          id: secondPublishedAction.id,
          slug: secondPublishedAction.slug,
          title: secondPublishedAction.title,
          summary: secondPublishedAction.summary,
          actionType: secondPublishedAction.actionType,
          publishedAt: secondPublishedAction.publishedAt?.toISOString(),
        },
      ],
    });
  });

  it('/topics/:slug (GET) returns 404 when the topic is missing', async () => {
    await request(harness.httpServer).get('/topics/missing-topic').expect(404);
  });
});
