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

  it('returns draft action by slug from unrestricted lookup', async () => {
    const actionService = harness.module.get(ActionService);
    const prisma = harness.prisma;

    // test that we don't filter by published status when calling getActionDetail
    const createdAction = await createAction(prisma, { status: EntityStatus.DRAFT });
    const action = await actionService.getActionDetail(createdAction.slug);
    expect(action).toEqual(
      expect.objectContaining({
        id: createdAction.id,
        title: 'Test action',
        summary: 'Summary',
      }),
    );
  });

  it('returns published action by slug from published lookup', async () => {
    const actionService = harness.module.get(ActionService);
    const prisma = harness.prisma;

    const createdAction = await createAction(prisma);
    const action = await actionService.getPublishedActionDetail(createdAction.slug);
    expect(action).toEqual(
      expect.objectContaining({
        id: createdAction.id,
        title: 'Test action',
        summary: 'Summary',
      }),
    );
  });

  it('returns null for draft action from published lookup', async () => {
    const actionService = harness.module.get(ActionService);
    const prisma = harness.prisma;

    // test that unpublished articles are not returned
    const createdAction = await createAction(prisma, { status: EntityStatus.DRAFT });
    const action = await actionService.getPublishedActionDetail(createdAction.slug);
    expect(action).toBeNull();
  });

  it('returns published actions by related topic', async () => {
    const actionService = harness.module.get(ActionService);
    const topicService = harness.module.get(TopicService);
    const prisma = harness.prisma;

    const createdAction1 = await createAction(prisma);
    const createdAction2 = await createAction(prisma);
    // this action is used to ensure only the published action linked with the topic are returned
    // it is not otherwise used
    const createdAction3 = await createAction(prisma, { status: EntityStatus.DRAFT });
    // this action is used to ensure only the action linked with the article are returned
    // it is not otherwise used
    const createdAction4 = await createAction(prisma);
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicAction(prisma, topic.id, createdAction1.id);
    await linkTopicAction(prisma, topic.id, createdAction2.id);
    await linkTopicAction(prisma, topic.id, createdAction3.id);

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
    const prisma = harness.prisma;

    const createdAction1 = await createAction(prisma);
    const createdAction2 = await createAction(prisma);
    // this action is used to ensure only the published actions linked with the article are returned
    // it is not otherwise used
    const createdAction3 = await createAction(prisma, { status: EntityStatus.DRAFT });
    // this action is used to ensure only the actions linked with the article are returned
    // it is not otherwise used
    const createdAction4 = await createAction(prisma);
    const createdArticle = await createArticle(prisma);

    await linkArticleAction(prisma, createdArticle.id, createdAction1.id);
    await linkArticleAction(prisma, createdArticle.id, createdAction2.id);
    await linkArticleAction(prisma, createdArticle.id, createdAction3.id);

    const actions = await actionService.getActionsForArticle(createdArticle.id);
    const actionIds = actions.map((action) => action.id);

    expect(actionIds).toEqual(expect.arrayContaining([createdAction1.id, createdAction2.id]));
    expect(actionIds).not.toContain(createdAction3.id);
    expect(actionIds).not.toContain(createdAction4.id);
    expect(actions).toHaveLength(2);
  });

  it('returns an empty array when no actions are related to article', async () => {
    const actionService = harness.module.get(ActionService);
    const prisma = harness.prisma;

    const article = await createArticle(prisma);
    const actions = await actionService.getActionsForArticle(article.id);
    expect(actions).toHaveLength(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link action and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);
    const prisma = harness.prisma;

    const createdAction1 = await createAction(prisma);
    const createdAction2 = await createAction(prisma);
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicAction(prisma, topic.id, createdAction1.id);
    await linkTopicAction(prisma, topic.id, createdAction2.id);
    await expect(linkTopicAction(prisma, topic.id, createdAction1.id)).toThrowUniqueViolation();
  });
  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/action/action.service.intg-spec.ts
  it('throws exception when trying to link article and action redundantly', async () => {
    const prisma = harness.prisma;

    const createdAction1 = await createAction(prisma);
    const createdAction2 = await createAction(prisma);
    const createdArticle1 = await createArticle(prisma);
    await linkArticleAction(prisma, createdArticle1.id, createdAction1.id);
    await linkArticleAction(prisma, createdArticle1.id, createdAction2.id);
    await expect(
      linkArticleAction(prisma, createdArticle1.id, createdAction1.id),
    ).toThrowUniqueViolation();
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/event/event.service.intg-spec.ts
  it('throws exception when trying to link action and event redundantly', async () => {
    const prisma = harness.prisma;

    const createdAction1 = await createAction(prisma);
    const createdAction2 = await createAction(prisma);
    const createdEvent = await createEvent(prisma);
    await linkActionEvent(prisma, createdAction1.id, createdEvent.id);
    await linkActionEvent(prisma, createdAction2.id, createdEvent.id);
    await expect(
      linkActionEvent(prisma, createdAction1.id, createdEvent.id),
    ).toThrowUniqueViolation();
  });
});
