import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { titleCase } from '@/lib/common/utils';
import { TopicSelector } from '@/components/topic-selector';
import { getTopicsList } from '@/lib/api/topics';
import { parseDate } from '@/lib/common/time';
export const dynamic = 'force-dynamic';
import EventFilters from '@/app/(public)/events/_components/event-filters';

function getNoResultsResponse() {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No results</p>
      <h2>No upcoming events found</h2>
      <p className="metaText">
        Try a nearby city, broaden the date window, or browse a different topic within this state.
      </p>
    </section>
  );
}

function getNoTopicResultsResponse(topic: string) {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No results</p>
      <h2>No upcoming events found for {topic}</h2>
      <p className="metaText">
        Keep the current location and date range, or switch topics to widen the search.
      </p>
    </section>
  );
}

function canRequest(props: EventListPageProps): boolean {
  return Boolean(props.region?.trim());
}

type EventListPageProps = {
  topicSlug?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  region?: string;
};

type EventListPagePropsWrapper = {
  searchParams?: Promise<EventListPageProps>;
};

function resolveDateWindow(params: EventListPageProps) {
  const startDate = parseDate(params.startDate ?? '') ?? new Date();
  const endDate =
    parseDate(params.endDate ?? '') ??
    (() => {
      const date = new Date(startDate);
      date.setUTCMonth(date.getUTCMonth() + 3);
      return date;
    })();

  return { startDate, endDate };
}

function toLocalDateTimeInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function getContents(params: EventListPageProps) {
  if (!canRequest(params)) {
    return (
      <section className="discoveryEmptyState">
        <p className="section-label">Start here</p>
        <h2>Find upcoming events near you</h2>
        <p className="metaText">
          Select a state to start browsing events. Topic, city, and dates can narrow the results.
        </p>
      </section>
    );
  }

  const { topicSlug } = params;
  const topic = titleCase(topicSlug);

  const data = await getEventsList(params);
  if (data.items.length === 0) {
    if (topicSlug) {
      return getNoTopicResultsResponse(topic);
    }
    return getNoResultsResponse();
  }
  return (
    <section className="collectionList">
      {data.items.map((event) => (
        <EventSummary key={event.id} event={event} />
      ))}
    </section>
  );
}

export default async function EventListPage({ searchParams }: EventListPagePropsWrapper) {
  const params = (await searchParams) ?? {};
  const topics = await getTopicsList();
  const { startDate, endDate } = resolveDateWindow(params);

  return (
    <section className="page-section">
      <h1 className="pageTitle">Events</h1>
      <p className="page-intro">Browse upcoming events and find ways to participate in person</p>
      <EventFilters
        params={params}
        initialStartDate={toLocalDateTimeInputValue(startDate)}
        initialEndDate={toLocalDateTimeInputValue(endDate)}
      />
      <TopicSelector topics={topics} basePath="/events" params={params} />
      <div>{await getContents(params)}</div>
    </section>
  );
}
