import { EventDetailResponse } from '@signal-fire/api-contracts';
import { getEventDetails } from '@/lib/api/events';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/error';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import { formatEventTime } from '@/lib/common/time';
import { TopicSummary } from '@/components/topic-summary';
import { ArticleBody } from '@/components/article-body';
import { titleCase } from '@/lib/common/utils';
export const dynamic = 'force-dynamic';

function formatEventType(eventType: string): string {
  return titleCase(eventType.toLowerCase().replaceAll('_', '-'));
}

async function fetchEventDetails(params: Promise<{ id: string }>): Promise<EventDetailResponse> {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId < 1) {
    notFound();
  }

  try {
    return await getEventDetails(eventId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const event = await fetchEventDetails(params);
  const locationParts = [event.city, event.region, event.postalCode, event.country].filter(
    (value): value is string => Boolean(value),
  );

  return (
    <div className="page-section">
      <section>
        <h1>{event.title}</h1>
        <p>{event.summary}</p>
      </section>
      <section>
        <p>{formatEventType(event.eventType)}</p>
        <p>{formatEventTime(event.startTime, event.endTime)}</p>
        <p>{event.locationName}</p>
        <p>{event.addressRaw}</p>
        {locationParts.length > 0 && <p>{locationParts.join(', ')}</p>}
      </section>
      <section>
        <ArticleBody content={event.description} />
      </section>
      <section>
        <h2>Related Topics</h2>
        {event.topics.map((topic) => (
          <TopicSummary key={topic.id} topic={topic} />
        ))}
      </section>
      <section>
        <h2>Articles</h2>
        {event.articles.map((article) => (
          <ArticleSummary key={article.id} article={article} />
        ))}
      </section>
      <section>
        <h2>Actions</h2>
        {event.actions.map((action) => (
          <ActionSummary key={action.id} action={action} />
        ))}
      </section>
    </div>
  );
}
