import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { setupIntegrationTest } from '../harness/integration.harness';
import { createTopic } from '../factories/topic.factory';
import { NotFoundException } from '@nestjs/common';
import { createArticle } from '../factories/article.factory';
import { createAction } from '../factories/action.factory';
import { linkTopicAction, linkTopicArticle } from '../factories/relation.factory';
import { ActionType, EntityStatus } from '@prisma/client';

describe('TopicService', () => {
  const harness = setupIntegrationTest([TopicModule]);

  it('returns seeded topics', async () => {
    const service = harness.module.get(TopicService);
    const topics = await service.getTopics();

    expect(topics.items.length).toBeGreaterThan(0);
    expect(topics.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: 'democracy', name: 'Democracy' })]),
    );
  });

  it('returns topic by slug', async () => {
    const service = harness.module.get(TopicService);
    const topic = await service.getTopicDetail('democracy');

    expect(topic).toEqual(expect.objectContaining({ name: 'Democracy' }));
  });

  it('returns shaped published article and action summaries for a topic', async () => {
    const service = harness.module.get(TopicService);
    const topic = await createTopic({
      slug: 'topic-with-content',
      name: 'Topic With Content',
      description: 'Topic used for relationship assertions',
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
      publishedAt: new Date('2026-03-20T16:30:00.000Z'),
    });
    const publishedAction = await createAction({
      slug: 'published-action',
      title: 'Published Action',
      summary: 'Published action summary',
      actionType: ActionType.CONTACT,
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

    const result = await service.getTopicDetail(topic.slug);

    expect(result).toEqual({
      id: topic.id,
      slug: 'topic-with-content',
      name: 'Topic With Content',
      description: 'Topic used for relationship assertions',
      articles: [
        {
          id: publishedArticle.id,
          slug: 'published-article',
          title: 'Published Article',
          summary: 'Published article summary',
          publishedAt: '2026-03-20T15:30:00.000Z',
        },
      ],
      actions: [
        {
          id: publishedAction.id,
          slug: 'published-action',
          title: 'Published Action',
          summary: 'Published action summary',
          actionType: ActionType.CONTACT,
        },
      ],
    });
  });

  it('returns null when slug not found', async () => {
    const service = harness.module.get(TopicService);
    await expect(service.getTopicDetail('fail')).rejects.toThrow(NotFoundException);
  });

  it('throws error when trying to create multiple topics with identical slugs', async () => {
    await createTopic({ slug: 'test' });
    await expect(createTopic({ slug: 'test' })).toThrowUniqueViolation();
  });
});
