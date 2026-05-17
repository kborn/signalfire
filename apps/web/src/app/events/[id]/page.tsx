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
      <section className="detailContent">
        <section className="eventInfoBlock">
          <div className="metaBlock">
            <p className="metaLabel">Event Type</p>
            <p className="metaValue eventType">{formatEventType(event.eventType)}</p>
          </div>
          <div className="metaBlock">
            <p className="metaLabel">Date & Time</p>
            <p className="metaValue eventDateTime">
              {formatEventTime(event.startTime, event.endTime)}
            </p>
          </div>
          <div className="metaBlock">
            <p className="metaLabel">Location</p>
            <p className="metaValue eventLocation">{event.locationName}</p>
          </div>
          <div className="metaBlock">
            <p className="metaLabel">Location Description</p>
            <p className="metaValue">{event.publicLocationDescription}</p>
          </div>
          <div className="metaBlock">
            <p className="metaLabel">Address Line 1</p>
            <p className="metaValue">{event.addressLine1}</p>
          </div>
          <div className="metaBlock">
            <p className="metaLabel">Address Line 2</p>
            <p className="metaValue">{event.addressLine2}</p>
          </div>
          {locationParts.length > 0 && (
            <div className="metaBlock">
              <p className="metaLabel">Region</p>
              <p className="metaValue">{locationParts.join(', ')}</p>
            </div>
          )}
          {event.website && (
            <div className="metaBlock">
              <p className="metaLabel">Website</p>
              <p className="metaValue">
                <a href={event.website} target="_blank" rel="noreferrer">
                  {event.website}
                </a>
              </p>
            </div>
          )}
          {event.contactEmail && (
            <div className="metaBlock">
              <p className="metaLabel">Contact</p>
              <p className="metaValue">{event.contactEmail}</p>
            </div>
          )}
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
            <h3>Learn More</h3>
            <div className="relatedList">
              {event.articles.map((article) => (
                <ArticleSummary key={article.id} article={article} variant="related" />
              ))}
            </div>
          </section>
        )}
        {event.actions.length > 0 && (
          <section className="relatedSection">
            <h3>Take Action</h3>
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
