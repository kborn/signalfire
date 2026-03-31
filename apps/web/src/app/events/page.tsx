import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { titleCase } from '@/lib/common/utils';
export const dynamic = 'force-dynamic';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1>Events</h1>
      <p>No upcoming events found</p>
    </section>
  );
}

function getNoTopicResultsResponse(topic: string) {
  return (
    <section className="page-section">
      <h1>Events</h1>
      <p>No events found for {topic}</p>
    </section>
  );
}

type EventListPageProps = {
  searchParams?: Promise<{ topicSlug?: string }>;
};

export default async function EventListPage({ searchParams }: EventListPageProps) {
  const topicSlug = (await searchParams)?.topicSlug;
  const topic = titleCase(topicSlug);
  const data = await getEventsList(topicSlug);
  if (data.items.length === 0) {
    if (topicSlug) {
      return getNoTopicResultsResponse(topic);
    }
    return getNoResultsResponse();
  }
  return (
    <section className="page-section">
      <h1>Events</h1>
      <p>Find upcoming events to participate in</p>
      {topicSlug && <p>Events related to {topic}</p>}

      {data.items.map((event) => (
        <EventSummary key={event.id} event={event} />
      ))}
    </section>
  );
}
