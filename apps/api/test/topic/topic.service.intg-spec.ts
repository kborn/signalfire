import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { setupIntegrationTest } from '../harness/integration.harness';
import { createTopic } from '../factories/topic.factory';

describe('TopicService', () => {
  const harness = setupIntegrationTest([TopicModule]);

  it('returns seeded topics', async () => {
    const service = harness.module.get(TopicService);
    const topics = await service.getTopics();

    expect(topics.length).toBeGreaterThan(0);
    expect(topics).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: 'democracy', name: 'Democracy' })]),
    );
  });

  it('returns topic by slug', async () => {
    const service = harness.module.get(TopicService);
    const topic = await service.getTopicDetail('democracy');

    expect(topic).toEqual(expect.objectContaining({ name: 'Democracy' }));
  });

  it('returns null when slug not found', async () => {
    const service = harness.module.get(TopicService);
    const topic = await service.getTopicDetail('fail');

    expect(topic).toBeNull();
  });

  it('throws error when trying to create multiple topics with identical slugs', async () => {
    const prisma = harness.prisma;
    await createTopic(prisma, { slug: 'test' });
    await expect(createTopic(prisma, { slug: 'test' })).toThrowUniqueViolation();
  });
});
