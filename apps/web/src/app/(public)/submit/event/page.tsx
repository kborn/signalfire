export const revalidate = 3600;

import { getTopicsList } from '@/lib/api/topics';
import { TopicListResponse } from '@signal-fire/api-contracts';
import { EventSubmissionForm } from '@/components/event-submission';

export default async function SubmitEventPage() {
  const topics: TopicListResponse = await getTopicsList();
  return <EventSubmissionForm topics={topics.items} />;
}
