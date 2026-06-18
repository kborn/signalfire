import { UnknownSubmissionTopicsError } from '../submission/submission.error';

type TopicSlugRecord = {
  id: number;
  slug: string;
};

type TopicIdLookup = {
  findIdsBySlugs(slugs: string[]): Promise<TopicSlugRecord[]>;
};

export async function getTopicIdsBySlug(
  topicLookup: TopicIdLookup,
  slugs: string[],
): Promise<number[]> {
  const records = await topicLookup.findIdsBySlugs(slugs);
  const foundSlugs = new Set(records.map((record) => record.slug));
  const unknownSlugs = slugs.filter((slug) => !foundSlugs.has(slug));

  if (unknownSlugs.length > 0) {
    throw new UnknownSubmissionTopicsError(unknownSlugs);
  }

  return records.map((record) => record.id);
}
