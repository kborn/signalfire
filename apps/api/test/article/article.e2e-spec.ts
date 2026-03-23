import { EntityStatus } from '@prisma/client';
import request from 'supertest';
import type { ArticleDetailResponse, ArticleListResponse } from '../../src/article/article.types';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import { createTopic } from '../factories/topic.factory';
import { linkArticleAction, linkTopicArticle } from '../factories/relation.factory';
import { setupE2ETest } from '../harness/e2e.harness';

describe('ArticleController (e2e)', () => {
  const harness = setupE2ETest();

  it('/articles (GET) returns published articles ordered by newest publishedAt first', async () => {
    const olderArticle = await createArticle({
      slug: 'older-article',
      title: 'Older Article',
      summary: 'Older article summary',
      publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const newerArticle = await createArticle({
      slug: 'newer-article',
      title: 'Newer Article',
      summary: 'Newer article summary',
      publishedAt: new Date('2026-01-02T00:00:00.000Z'),
    });
    const draftArticle = await createArticle({
      slug: 'draft-article',
      title: 'Draft Article',
      summary: 'Draft article summary',
      status: EntityStatus.DRAFT,
    });

    const response = await request(harness.httpServer).get('/articles').expect(200);
    const body = response.body as ArticleListResponse;
    const olderIndex = body.items.findIndex((article) => article.slug === olderArticle.slug);
    const newerIndex = body.items.findIndex((article) => article.slug === newerArticle.slug);

    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: olderArticle.id,
          slug: olderArticle.slug,
          title: olderArticle.title,
          summary: olderArticle.summary,
          publishedAt: olderArticle.publishedAt?.toISOString(),
        }),
        expect.objectContaining({
          id: newerArticle.id,
          slug: newerArticle.slug,
          title: newerArticle.title,
          summary: newerArticle.summary,
          publishedAt: newerArticle.publishedAt?.toISOString(),
        }),
      ]),
    );
    expect(body.items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: draftArticle.slug })]),
    );
    expect(olderIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('/articles/:slug (GET) returns the published article detail payload', async () => {
    const topic = await createTopic({
      slug: 'article-topic',
      name: 'Article Topic',
      description: 'Topic used for article detail assertions',
    });
    const article = await createArticle({
      slug: 'published-article',
      title: 'Published Article',
      summary: 'Published article summary',
      content: 'Published article content',
      author: 'SignalFire Staff',
      publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    });
    const publishedAction = await createAction({
      slug: 'published-action',
      title: 'Published Action',
      summary: 'Published action summary',
      publishedAt: new Date('2026-03-12T00:00:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      status: EntityStatus.DRAFT,
    });

    await linkTopicArticle(topic.id, article.id);
    await linkArticleAction(article.id, publishedAction.id);
    await linkArticleAction(article.id, draftAction.id);

    const response = await request(harness.httpServer).get(`/articles/${article.slug}`).expect(200);
    const body = response.body as ArticleDetailResponse;

    expect(body).toEqual({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      author: article.author,
      content: article.content,
      publishedAt: article.publishedAt?.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      topics: [
        {
          id: topic.id,
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
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

  it('/articles/:slug (GET) returns 404 when the article is missing', async () => {
    await request(harness.httpServer).get('/articles/missing-article').expect(404);
  });

  it('/articles/:slug (GET) returns 404 when the article is unpublished', async () => {
    const article = await createArticle({
      slug: 'draft-article',
      title: 'Draft Article',
      summary: 'Draft article summary',
      status: EntityStatus.DRAFT,
    });

    await request(harness.httpServer).get(`/articles/${article.slug}`).expect(404);
  });
});
