import { ArticleModule } from '../../src/article/article.module';
import { ArticleService } from '../../src/article/article.service';
import { EntityStatus } from '@prisma/client';
import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import {
  linkArticleAction,
  linkArticleEvent,
  linkTopicArticle,
} from '../factories/relation.factory';
import { setupIntegrationTest } from '../harness/integration.harness';
import { createEvent } from '../factories/event.factory';
import { NotFoundException } from '@nestjs/common';

describe('Article Service Integration Test', () => {
  const harness = setupIntegrationTest([ArticleModule, TopicModule]);

  it('returns published articles', async () => {
    const service = harness.module.get(ArticleService);
    const createdArticle1 = await createArticle();
    const createdArticle2 = await createArticle();
    const createdDraftArticle = await createArticle({ status: EntityStatus.DRAFT });
    const articles = await service.getArticleList();

    expect(articles.items.length).toBeGreaterThan(0);
    expect(articles.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: createdArticle1.slug }),
        expect.objectContaining({ slug: createdArticle2.slug }),
      ]),
    );
    expect(articles.items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: createdDraftArticle.slug })]),
    );
  });

  it('returns published articles ordered by newest publishedAt first', async () => {
    const service = harness.module.get(ArticleService);
    const olderArticle = await createArticle({
      publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const newerArticle = await createArticle({
      publishedAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    const articles = await service.getArticleList();
    const olderIndex = articles.items.findIndex((article) => article.slug === olderArticle.slug);
    const newerIndex = articles.items.findIndex((article) => article.slug === newerArticle.slug);

    expect(olderIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('returns published article by slug when no status is provided', async () => {
    const articleService = harness.module.get(ArticleService);

    const createdArticle = await createArticle();
    const article = await articleService.getArticleDetail(createdArticle.slug);
    expect(article).toEqual(
      expect.objectContaining({
        id: createdArticle.id,
        title: 'Test article',
        summary: 'Summary',
      }),
    );
  });

  it('returns published article by slug from published lookup', async () => {
    const articleService = harness.module.get(ArticleService);
    const createdArticle = await createArticle();
    const article = await articleService.getArticleDetail(createdArticle.slug);
    expect(article).toEqual(
      expect.objectContaining({
        id: createdArticle.id,
        title: 'Test article',
        summary: 'Summary',
      }),
    );
  });

  it('returns not found for draft article from published lookup', async () => {
    const articleService = harness.module.get(ArticleService);
    // test that unpublished articles are not returned
    const createdArticle = await createArticle({ status: EntityStatus.DRAFT });
    await expect(articleService.getArticleDetail(createdArticle.slug)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns published articles by related topic', async () => {
    const articleService = harness.module.get(ArticleService);
    const topicService = harness.module.get(TopicService);

    const createdArticle1 = await createArticle();
    const createdArticle2 = await createArticle();
    // this article is used to ensure only the published articles linked with the topic are returned
    // it is not otherwise used
    const createdArticle3 = await createArticle({ status: EntityStatus.DRAFT });
    // this article is used to ensure only the articles linked with the topic are returned
    // it is not otherwise used
    const createdArticle4 = await createArticle();
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicArticle(topic.id, createdArticle1.id);
    await linkTopicArticle(topic.id, createdArticle2.id);
    await linkTopicArticle(topic.id, createdArticle3.id);

    const articles = await articleService.getArticlesForTopic(topic.slug);
    const articleIds = articles.map((article) => article.id);

    expect(articleIds).toEqual(expect.arrayContaining([createdArticle1.id, createdArticle2.id]));
    expect(articleIds).not.toContain(createdArticle3.id);
    expect(articleIds).not.toContain(createdArticle4.id);
    expect(articles).toHaveLength(2);
  });

  it('returns an empty array when no articles are related to topic', async () => {
    const articleService = harness.module.get(ArticleService);
    const topicService = harness.module.get(TopicService);

    const topic = await topicService.getTopicDetail('democracy');

    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }

    const articles = await articleService.getArticlesForTopic(topic.slug);
    expect(articles.length).toEqual(0);
  });

  it('returns published articles by related action', async () => {
    const articleService = harness.module.get(ArticleService);

    const createdArticle1 = await createArticle();
    const createdArticle2 = await createArticle();
    // this article is used to ensure only the published articles linked with the action are returned
    // it is not otherwise used
    const createdArticle3 = await createArticle({ status: EntityStatus.DRAFT });
    // this article is used to ensure only the articles linked with the action are returned
    // it is not otherwise used
    const createdArticle4 = await createArticle();
    const createdAction = await createAction();

    await linkArticleAction(createdArticle1.id, createdAction.id);
    await linkArticleAction(createdArticle2.id, createdAction.id);
    await linkArticleAction(createdArticle3.id, createdAction.id);

    const articles = await articleService.getArticlesForAction(createdAction.id);
    const articleIds = articles.map((article) => article.id);

    expect(articleIds).toEqual(expect.arrayContaining([createdArticle1.id, createdArticle2.id]));
    expect(articleIds).not.toContain(createdArticle3.id);
    expect(articleIds).not.toContain(createdArticle4.id);
    expect(articles).toHaveLength(2);
  });

  it('returns an empty array when no articles are related to action', async () => {
    const articleService = harness.module.get(ArticleService);

    const createdAction = await createAction();
    const articles = await articleService.getArticlesForAction(createdAction.id);
    expect(articles.length).toEqual(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link article and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);

    const createdArticle1 = await createArticle();
    const createdArticle2 = await createArticle();
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicArticle(topic.id, createdArticle1.id);
    await linkTopicArticle(topic.id, createdArticle2.id);
    await expect(linkTopicArticle(topic.id, createdArticle1.id)).toThrowUniqueViolation();
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/event/event.service.intg-spec.ts
  it('throws exception when trying to link article and event redundantly', async () => {
    const createdArticle1 = await createArticle();
    const createdArticle2 = await createArticle();
    const createdEvent = await createEvent();
    await linkArticleEvent(createdArticle1.id, createdEvent.id);
    await linkArticleEvent(createdArticle2.id, createdEvent.id);
    await expect(linkArticleEvent(createdArticle1.id, createdEvent.id)).toThrowUniqueViolation();
  });

  it('throws exception when trying to create multiple articles with the same slug', async () => {
    await createArticle({ slug: 'test' });
    await expect(createArticle({ slug: 'test' })).toThrowUniqueViolation();
  });
});
