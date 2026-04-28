import { getTopicsList } from '@/lib/api/topics';
import { TopicListResponse } from '@signal-fire/api-contracts';
import { ArticleSubmissionForm } from '@/components/article-submission';

export const dynamic = 'force-dynamic';

export default async function SubmitArticlePage() {
  const topics: TopicListResponse = await getTopicsList();
  return <ArticleSubmissionForm topics={topics.items} />;
}
