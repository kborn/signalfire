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

describe('Article Service Integration Test', () => {
  const harness = setupIntegrationTest([ArticleModule, TopicModule]);

  it('returns draft article by slug from unrestricted lookup', async () => {
    const articleService = harness.module.get(ArticleService);
    const prisma = harness.prisma;

    // test that we don't filter by published status when calling getArticleDetail
    const createdArticle = await createArticle(prisma, { status: EntityStatus.DRAFT });
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
    const prisma = harness.prisma;

    const createdArticle = await createArticle(prisma);
    const article = await articleService.getPublishedArticleDetail(createdArticle.slug);
    expect(article).toEqual(
      expect.objectContaining({
        id: createdArticle.id,
        title: 'Test article',
        summary: 'Summary',
      }),
    );
  });

  it('returns null for draft article from published lookup', async () => {
    const articleService = harness.module.get(ArticleService);
    const prisma = harness.prisma;

    // test that unpublished articles are not returned
    const createdArticle = await createArticle(prisma, { status: EntityStatus.DRAFT });
    const article = await articleService.getPublishedArticleDetail(createdArticle.slug);
    expect(article).toBeNull();
  });

  it('returns published articles by related topic', async () => {
    const articleService = harness.module.get(ArticleService);
    const topicService = harness.module.get(TopicService);
    const prisma = harness.prisma;

    const createdArticle1 = await createArticle(prisma);
    const createdArticle2 = await createArticle(prisma);
    // this article is used to ensure only the published articles linked with the topic are returned
    // it is not otherwise used
    const createdArticle3 = await createArticle(prisma, { status: EntityStatus.DRAFT });
    // this article is used to ensure only the articles linked with the topic are returned
    // it is not otherwise used
    const createdArticle4 = await createArticle(prisma);
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicArticle(prisma, topic.id, createdArticle1.id);
    await linkTopicArticle(prisma, topic.id, createdArticle2.id);
    await linkTopicArticle(prisma, topic.id, createdArticle3.id);

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
    const prisma = harness.prisma;

    const createdArticle1 = await createArticle(prisma);
    const createdArticle2 = await createArticle(prisma);
    // this article is used to ensure only the published articles linked with the action are returned
    // it is not otherwise used
    const createdArticle3 = await createArticle(prisma, { status: EntityStatus.DRAFT });
    // this article is used to ensure only the articles linked with the action are returned
    // it is not otherwise used
    const createdArticle4 = await createArticle(prisma);
    const createdAction = await createAction(prisma);

    await linkArticleAction(prisma, createdArticle1.id, createdAction.id);
    await linkArticleAction(prisma, createdArticle2.id, createdAction.id);
    await linkArticleAction(prisma, createdArticle3.id, createdAction.id);

    const articles = await articleService.getArticlesForAction(createdAction.id);
    const articleIds = articles.map((article) => article.id);

    expect(articleIds).toEqual(expect.arrayContaining([createdArticle1.id, createdArticle2.id]));
    expect(articleIds).not.toContain(createdArticle3.id);
    expect(articleIds).not.toContain(createdArticle4.id);
    expect(articles).toHaveLength(2);
  });

  it('returns an empty array when no articles are related to action', async () => {
    const articleService = harness.module.get(ArticleService);
    const prisma = harness.prisma;

    const createdAction = await createAction(prisma);
    const articles = await articleService.getArticlesForAction(createdAction.id);
    expect(articles.length).toEqual(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link article and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);
    const prisma = harness.prisma;

    const createdArticle1 = await createArticle(prisma);
    const createdArticle2 = await createArticle(prisma);
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicArticle(prisma, topic.id, createdArticle1.id);
    await linkTopicArticle(prisma, topic.id, createdArticle2.id);
    await expect(linkTopicArticle(prisma, topic.id, createdArticle1.id)).toThrowUniqueViolation();
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/event/event.service.intg-spec.ts
  it('throws exception when trying to link article and event redundantly', async () => {
    const prisma = harness.prisma;

    const createdArticle1 = await createArticle(prisma);
    const createdArticle2 = await createArticle(prisma);
    const createdEvent = await createEvent(prisma);
    await linkArticleEvent(prisma, createdArticle1.id, createdEvent.id);
    await linkArticleEvent(prisma, createdArticle2.id, createdEvent.id);
    await expect(
      linkArticleEvent(prisma, createdArticle1.id, createdEvent.id),
    ).toThrowUniqueViolation();
  });

  it('throws exception when trying to create multiple articles with the same slug', async () => {
    const prisma = harness.prisma;

    await createArticle(prisma, { slug: 'test' });
    await expect(createArticle(prisma, { slug: 'test' })).toThrowUniqueViolation();
  });
});
