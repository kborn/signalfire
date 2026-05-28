import { getTopicsList } from '@/lib/api/topics';
import { TopicListResponse } from '@signal-fire/api-contracts';
import { EventSubmissionForm } from '@/components/event-submission';

export const dynamic = 'force-dynamic';

export default async function SubmitEventPage() {
  const topics: TopicListResponse = await getTopicsList();
  return <EventSubmissionForm topics={topics.items} />;
}
