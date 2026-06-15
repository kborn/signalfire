import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { titleCase } from '@/lib/common/utils';
import { TopicSelector } from '@/components/topic-selector';
import { getTopicsList } from '@/lib/api/topics';
import { formatContentDate, parseDate } from '@/lib/common/time';
export const dynamic = 'force-dynamic';
import EventFilters from '@/app/(public)/events/_components/event-filters';

function getNoResultsResponse() {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Events</h1>
      <p>No upcoming events found</p>
    </section>
  );
}

function getNoTopicResultsResponse(topic: string) {
  return (
    <section className="page-section">
      <h1 className="pageTitle">Events</h1>
      <p>No upcoming events found related to {topic}</p>
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

  return {
    startLabel: formatContentDate(startDate.toISOString()) ?? 'today',
    endLabel: formatContentDate(endDate.toISOString()) ?? 'three months from now',
  };
}

async function getContents(params: EventListPageProps) {
  if (!canRequest(params)) {
    return (
      <p className="metaText">
        Select a state to start browsing events. Topic, city, and dates can narrow the results.
      </p>
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
  const { startLabel, endLabel } = resolveDateWindow(params);

  return (
    <section className="page-section">
      <h1 className="pageTitle">Events</h1>
      <p className="page-intro">Browse upcoming events and find ways to participate in person</p>
      <EventFilters params={params} activeDateRangeLabel={`${startLabel} through ${endLabel}`} />
      <TopicSelector topics={topics} basePath="/events" params={params} />
      <div>{await getContents(params)}</div>
    </section>
  );
}
