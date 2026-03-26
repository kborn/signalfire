import { EntityStatus } from '@prisma/client';
import request from 'supertest';
import type { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';
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

  it('/articles (GET) uses ascending id as the tie-breaker when publishedAt matches', async () => {
    const sharedPublishedAt = new Date('2026-01-03T00:00:00.000Z');
    const firstArticle = await createArticle({
      slug: 'first-tie-article',
      title: 'First Tie Article',
      summary: 'First tie article summary',
      publishedAt: sharedPublishedAt,
    });
    const secondArticle = await createArticle({
      slug: 'second-tie-article',
      title: 'Second Tie Article',
      summary: 'Second tie article summary',
      publishedAt: sharedPublishedAt,
    });

    const response = await request(harness.httpServer).get('/articles').expect(200);
    const body = response.body as ArticleListResponse;
    const firstIndex = body.items.findIndex((article) => article.slug === firstArticle.slug);
    const secondIndex = body.items.findIndex((article) => article.slug === secondArticle.slug);

    expect(firstArticle.id).toBeLessThan(secondArticle.id);
    expect(firstIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it('/articles/:slug (GET) returns the published article detail payload', async () => {
    const firstTopic = await createTopic({
      slug: 'article-topic-first',
      name: 'Article Topic First',
      description: 'First topic used for article detail assertions',
    });
    const secondTopic = await createTopic({
      slug: 'article-topic-second',
      name: 'Article Topic Second',
      description: 'Second topic used for article detail assertions',
    });
    const article = await createArticle({
      slug: 'published-article',
      title: 'Published Article',
      summary: 'Published article summary',
      content: 'Published article content',
      author: 'SignalFire Staff',
      publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    });
    const firstPublishedAction = await createAction({
      slug: 'published-action-first',
      title: 'Published Action First',
      summary: 'Published action summary first',
      publishedAt: new Date('2026-03-12T00:00:00.000Z'),
    });
    const secondPublishedAction = await createAction({
      slug: 'published-action-second',
      title: 'Published Action Second',
      summary: 'Published action summary second',
      publishedAt: new Date('2026-03-13T00:00:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'draft-action',
      title: 'Draft Action',
      summary: 'Draft action summary',
      status: EntityStatus.DRAFT,
    });

    await linkTopicArticle(firstTopic.id, article.id);
    await linkTopicArticle(secondTopic.id, article.id);
    await linkArticleAction(article.id, firstPublishedAction.id);
    await linkArticleAction(article.id, secondPublishedAction.id);
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
          id: firstTopic.id,
          slug: firstTopic.slug,
          name: firstTopic.name,
          description: firstTopic.description,
        },
        {
          id: secondTopic.id,
          slug: secondTopic.slug,
          name: secondTopic.name,
          description: secondTopic.description,
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
