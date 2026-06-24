export const revalidate = 3600;

import { getTopicsList } from '@/lib/api/topics';
import { TopicListResponse } from '@signal-fire/api-contracts';
import { ArticleSubmissionForm } from '@/components/article-submission';

export default async function SubmitArticlePage() {
  const topics: TopicListResponse = (await getTopicsList().catch(() => null)) ?? { items: [] };
  return <ArticleSubmissionForm topics={topics.items} />;
}
