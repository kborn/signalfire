import { connection } from 'next/server';
import { getTopicsList } from '@/lib/api/topics';
import { TopicListResponse } from '@signal-fire/api-contracts';
import { EventSubmissionForm } from '@/components/event-submission';

export default async function SubmitEventPage() {
  await connection();
  const topics: TopicListResponse = await getTopicsList();
  return <EventSubmissionForm topics={topics.items} />;
}
