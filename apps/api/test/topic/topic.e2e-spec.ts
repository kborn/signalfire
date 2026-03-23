import request from 'supertest';
import { createTopic } from '../factories/topic.factory';
import { setupE2ETest } from '../harness/e2e.harness';
import { TopicListResponse } from '../../src/topic/topic.types';
describe('TopicController (e2e)', () => {
  const harness = setupE2ETest();

  it('/topics (GET)', async () => {
    const topic = await createTopic({
      slug: 'topic-with-content',
      name: 'Topic With Content',
      description: 'Topic used for relationship assertions',
    });
    const response = await request(harness.httpServer).get('/topics').expect(200);
    const body = response.body as TopicListResponse;
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
        }),
      ]),
    );
  });
});
