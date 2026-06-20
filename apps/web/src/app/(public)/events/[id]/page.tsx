import { connection } from 'next/server';
import { EventDetailResponse } from '@signal-fire/api-contracts';
import { getEventDetails } from '@/lib/api/events';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/error';
import { ArticleSummary } from '@/components/article-summary';
import { ActionSummary } from '@/components/action-summary';
import { formatEventTime } from '@/lib/common/time';
import { TopicSummary } from '@/components/topic-summary';
import { MarkdownContent } from '@/components/markdown-content';
import { formatEventTypeLabel } from '@/lib/common/utils';
import Link from 'next/link';

export const revalidate = 60;

function normalizePlainText(value: string): string {
  return value
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
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

function formatEventArea({
  city,
  region,
  postalCode,
  country,
}: Pick<EventDetailResponse, 'city' | 'region' | 'postalCode' | 'country'>): string | null {
  const cityState = [city, region].filter(Boolean).join(', ');
  const cityStatePostal = [cityState, postalCode].filter(Boolean).join(' ');

  if (!cityStatePostal && !country) {
    return null;
  }

  if (!country || country === 'USA' || country === 'United States') {
    return cityStatePostal || country;
  }

  return [cityStatePostal, country].filter(Boolean).join(', ');
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const event = await fetchEventDetails(params);
  const eventArea = formatEventArea(event);
  const normalizedSummary = normalizePlainText(event.summary);
  const normalizedDescription = normalizePlainText(event.description);
  const shouldRenderSummaryLead =
    normalizedSummary.length > 0 && !normalizedDescription.startsWith(normalizedSummary);

  return (
    <div className="detailPage">
      <nav className="detailBreadcrumb" aria-label="Back" data-topic={event.topics[0]?.slug}>
        {event.topics.length > 0 ? (
          <Link href={`/issues/${event.topics[0].slug}`} className="detailBreadcrumbLink">
            ← {event.topics[0].name}
          </Link>
        ) : (
          <Link href="/events" className="detailBreadcrumbLink">
            ← Events
          </Link>
        )}
      </nav>
      <section className="detailHeader detailHero">
        <h1 className="pageTitle">{event.title}</h1>
      </section>
      <section className="detailContent detailContent--event">
        <section className="detailMetaPanel">
          {shouldRenderSummaryLead ? <p className="detailLead">{event.summary}</p> : null}
          <section className="eventInfoBlock">
            <div className="metaBlock">
              <p className="metaLabel">Event Type</p>
              <p className="metaValue eventType">{formatEventTypeLabel(event.eventType)}</p>
            </div>
            <div className="metaBlock">
              <p className="metaLabel">Date & Time</p>
              <p className="metaValue">
                {formatEventTime(event.startTime, event.endTime, {
                  city: event.city,
                  region: event.region,
                  country: event.country,
                })}
              </p>
            </div>
            <div className="metaBlock">
              <p className="metaLabel">Location</p>
              <p className="metaValue">{event.locationName}</p>
            </div>
            {event.publicLocationDescription && (
              <div className="metaBlock">
                <p className="metaLabel">Location Description</p>
                <p className="metaValue">{event.publicLocationDescription}</p>
              </div>
            )}
            {event.addressLine1 && (
              <div className="metaBlock">
                <p className="metaLabel">Address Line 1</p>
                <p className="metaValue">{event.addressLine1}</p>
              </div>
            )}
            {event.addressLine2 && (
              <div className="metaBlock">
                <p className="metaLabel">Address Line 2</p>
                <p className="metaValue">{event.addressLine2}</p>
              </div>
            )}
            {eventArea && (
              <div className="metaBlock">
                <p className="metaLabel">City, State &amp; ZIP</p>
                <p className="metaValue">{eventArea}</p>
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
        </section>
        <section className="detailNarrativePanel">
          <MarkdownContent content={event.description} />
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
      <div className="detailPageNav">
        <Link href="/events" className="textCTA">
          Browse more events
        </Link>
      </div>
    </div>
  );
}
