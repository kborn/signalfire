import { ActionModule } from '../../src/action/action.module';
import { ActionService } from '../../src/action/action.service';
import { EntityStatus } from '@prisma/client';
import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import { linkActionEvent, linkArticleAction, linkTopicAction } from '../factories/relation.factory';
import { setupIntegrationTest } from '../harness/integration.harness';
import { createEvent } from '../factories/event.factory';

describe('Action Service Integration test', () => {
  const harness = setupIntegrationTest([ActionModule, TopicModule]);

  it('returns published actions', async () => {
    const actionService = harness.module.get(ActionService);
    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    const createdDraftAction = await createAction({ status: EntityStatus.DRAFT });
    const actions = await actionService.getActionList(EntityStatus.PUBLISHED);

    expect(actions.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: createdAction1.slug }),
        expect.objectContaining({ slug: createdAction2.slug }),
      ]),
    );
    expect(actions.items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: createdDraftAction.slug })]),
    );
  });

  it('returns published actions ordered by newest publishedAt first', async () => {
    const actionService = harness.module.get(ActionService);
    const olderAction = await createAction({
      publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const newerAction = await createAction({
      publishedAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    const actions = await actionService.getActionList(EntityStatus.PUBLISHED);
    const olderIndex = actions.items.findIndex((action) => action.slug === olderAction.slug);
    const newerIndex = actions.items.findIndex((action) => action.slug === newerAction.slug);

    expect(olderIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('returns published actions by related topic', async () => {
    const actionService = harness.module.get(ActionService);
    const topicService = harness.module.get(TopicService);

    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    // this action is used to ensure only the published action linked with the topic are returned
    // it is not otherwise used
    const createdAction3 = await createAction({ status: EntityStatus.DRAFT });
    // this action is used to ensure only the action linked with the article are returned
    // it is not otherwise used
    const createdAction4 = await createAction();
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicAction(topic.id, createdAction1.id);
    await linkTopicAction(topic.id, createdAction2.id);
    await linkTopicAction(topic.id, createdAction3.id);

    const actions = await actionService.getActionsForTopic(topic.slug);
    const actionIds = actions.map((action) => action.id);

    expect(actionIds).toEqual(expect.arrayContaining([createdAction1.id, createdAction2.id]));
    expect(actionIds).not.toContain(createdAction3.id);
    expect(actionIds).not.toContain(createdAction4.id);
    expect(actions).toHaveLength(2);
  });

  it('returns an empty array when no actions are related to topic', async () => {
    const actionService = harness.module.get(ActionService);
    const topicService = harness.module.get(TopicService);

    const topic = await topicService.getTopicDetail('democracy');

    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }

    const actions = await actionService.getActionsForTopic(topic.slug);
    expect(actions).toHaveLength(0);
  });

  it('returns published actions by related article', async () => {
    const actionService = harness.module.get(ActionService);

    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    // this action is used to ensure only the published actions linked with the article are returned
    // it is not otherwise used
    const createdAction3 = await createAction({ status: EntityStatus.DRAFT });
    // this action is used to ensure only the actions linked with the article are returned
    // it is not otherwise used
    const createdAction4 = await createAction();
    const createdArticle = await createArticle();

    await linkArticleAction(createdArticle.id, createdAction1.id);
    await linkArticleAction(createdArticle.id, createdAction2.id);
    await linkArticleAction(createdArticle.id, createdAction3.id);

    const actions = await actionService.getActionsForArticle(createdArticle.id);
    const actionIds = actions.map((action) => action.id);

    expect(actionIds).toEqual(expect.arrayContaining([createdAction1.id, createdAction2.id]));
    expect(actionIds).not.toContain(createdAction3.id);
    expect(actionIds).not.toContain(createdAction4.id);
    expect(actions).toHaveLength(2);
  });

  it('returns an empty array when no actions are related to article', async () => {
    const actionService = harness.module.get(ActionService);
    const article = await createArticle();
    const actions = await actionService.getActionsForArticle(article.id);
    expect(actions).toHaveLength(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link action and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);
    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicAction(topic.id, createdAction1.id);
    await linkTopicAction(topic.id, createdAction2.id);
    await expect(linkTopicAction(topic.id, createdAction1.id)).toThrowUniqueViolation();
  });
  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/action/action.service.intg-spec.ts
  it('throws exception when trying to link article and action redundantly', async () => {
    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    const createdArticle1 = await createArticle();
    await linkArticleAction(createdArticle1.id, createdAction1.id);
    await linkArticleAction(createdArticle1.id, createdAction2.id);
    await expect(linkArticleAction(createdArticle1.id, createdAction1.id)).toThrowUniqueViolation();
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/event/event.service.intg-spec.ts
  it('throws exception when trying to link action and event redundantly', async () => {
    const createdAction1 = await createAction();
    const createdAction2 = await createAction();
    const createdEvent = await createEvent();
    await linkActionEvent(createdAction1.id, createdEvent.id);
    await linkActionEvent(createdAction2.id, createdEvent.id);
    await expect(linkActionEvent(createdAction1.id, createdEvent.id)).toThrowUniqueViolation();
  });

  it('throws exception when trying to create multiple actions with the same slug', async () => {
    await createAction({ slug: 'test' });
    await expect(createAction({ slug: 'test' })).toThrowUniqueViolation();
  });
});
