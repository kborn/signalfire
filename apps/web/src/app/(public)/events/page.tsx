import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { TopicSelector } from '@/components/topic-selector';
import { getTopicsList } from '@/lib/api/topics';
import { parseDate } from '@/lib/common/time';
export const dynamic = 'force-dynamic';
import EventFilters from '@/app/(public)/events/_components/event-filters';
import { PageSizeSelector } from '@/components/page-size-selector';
import { Pagination } from '@/components/pagination';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="discoveryEmptyState">
      <p>{topicSlug ? 'No events found for this topic yet.' : 'No events available yet.'}</p>
      <p>
        Try a nearby city, broaden the date window, or browse a different topic within this state.
      </p>
    </section>
  );
}

function getEmptyPageResponse() {
  return <p>No events on this page. Try a previous page or change the filters.</p>;
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
  page?: string;
  pageSize?: string;
};

type EventListPagePropsWrapper = {
  searchParams?: Promise<EventListPageProps>;
};

function resolveDateWindow(params: EventListPageProps) {
  const startDate = parseDate(params.startDate ?? '') ?? new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate =
    parseDate(params.endDate ?? '') ??
    (() => {
      const date = new Date(startDate);
      date.setUTCMonth(date.getUTCMonth() + 3);
      return date;
    })();

  return { startDate, endDate };
}

function toDateInputValue(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
  const resp = await getEventsList(params);

  return (
    <div>
      <section className="collectionList">
        {resp.items.length === 0
          ? resp.totalItems === 0
            ? getNoResultsResponse(topicSlug)
            : getEmptyPageResponse()
          : resp.items.map((event) => <EventSummary key={event.id} event={event} />)}
      </section>
      <div className="paginationToolbar">
        <PageSizeSelector basePath="/events" params={params} />
        <Pagination
          basePath="/events"
          page={resp.page}
          totalPages={resp.totalPages}
          params={params}
        />
      </div>
    </div>
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
        initialStartDate={toDateInputValue(startDate)}
        initialEndDate={toDateInputValue(endDate)}
      />
      <TopicSelector topics={topics} basePath="/events" params={params} />
      <div>{await getContents(params)}</div>
    </section>
  );
}
