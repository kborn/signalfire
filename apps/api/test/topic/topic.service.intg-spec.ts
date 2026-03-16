import { TopicService } from '../../src/topic/topic.service';
import { TopicModule } from '../../src/topic/topic.module';
import { Test } from '@nestjs/testing';

describe('TopicService', () => {
  let service: TopicService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TopicModule],
    }).compile();

    service = module.get(TopicService);
  });

  it('return seeded topics', async () => {
    const topics = await service.getTopics();

    expect(topics.length).toBeGreaterThan(0);
    expect(topics).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: 'democracy', name: 'Democracy' })]),
    );
  });

  it('return topic by slug', async () => {
    const topic = await service.getTopicDetail('democracy');
    expect(topic).toEqual(expect.objectContaining({ name: 'Democracy' }));
  });
});
