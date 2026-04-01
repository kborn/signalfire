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
    <div className="detailPage">
      <section className="detailHeader">
        <h1 className="pageTitle">{event.title}</h1>
      </section>
      <section className="detailMetaGroup">
        <p>{event.summary}</p>
      </section>
      <section className="topicDetailSections">
        <section className="eventInfoBlock">
          <p className="eventType">{formatEventType(event.eventType)}</p>
          <p className="eventDateTime">{formatEventTime(event.startTime, event.endTime)}</p>
          <p className="eventLocation">{event.locationName}</p>
          <p>{event.addressRaw}</p>
          {locationParts.length > 0 && <p>{locationParts.join(', ')}</p>}
        </section>
        <section>
          <ArticleBody content={event.description} />
        </section>
        {event.topics.length > 0 && (
          <section className="relatedSection">
            <h3>Related Topics</h3>
            <div className="relatedList">
              {event.topics.map((topic) => (
                <TopicSummary key={topic.id} topic={topic} variant="related" />
              ))}
            </div>
          </section>
        )}
        {event.articles.length > 0 && (
          <section className="relatedSection">
            <h3>Articles</h3>
            <div className="relatedList">
              {event.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} variant="related" />
              ))}
            </div>
          </section>
        )}
        {event.actions.length > 0 && (
          <section className="relatedSection">
            <h3>Actions</h3>
            <div className="relatedList">
              {event.actions.map((action) => (
                <ActionSummary key={action.id} action={action} variant="related" />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
