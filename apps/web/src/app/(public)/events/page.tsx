import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { TopicSelector } from '@/components/topic-selector';
import { getTopicsList } from '@/lib/api/topics';
import { parseDate } from '@/lib/common/time';
export const dynamic = 'force-dynamic';
import EventFilters from '@/app/(public)/events/_components/event-filters';
import { PageSizeSelector } from '@/components/page-size-selector';
import { Pagination } from '@/components/pagination';
import Link from 'next/link';

function getNoResultsResponse(topicSlug?: string) {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No events yet</p>
      <h2>{topicSlug ? 'No events match this issue right now.' : 'No events available yet.'}</h2>
      <p className="metaText">
        Try a nearby city, broaden the date window, or look for an action you can take right away.
      </p>
      <div className="ctaRow">
        <Link href="/actions" className="secondaryCTA">
          Browse Actions
        </Link>
      </div>
    </section>
  );
}

function getEmptyPageResponse() {
  return (
    <section className="discoveryEmptyState">
      <p className="section-label">No results on this page</p>
      <h2>There are matching events, just not on this page.</h2>
      <p className="metaText">Try a previous page or widen the city and date filters.</p>
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
  page?: string;
  pageSize?: string;
};

type ResolvedEventListPageProps = {
  topicSlug?: string;
  startDate: string;
  endDate: string;
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

  return {
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
  };
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
          Select a state or territory to start browsing events. Issue, city, and dates can narrow
          the results.
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
  const resolvedParams: ResolvedEventListPageProps = { ...params, ...resolveDateWindow(params) };
  return (
    <section className="page-section">
      <h1 className="pageTitle">Events</h1>
      <p className="page-intro">
        Browse upcoming events by issue, location, and date to find ways to participate in person.
      </p>
      <EventFilters params={resolvedParams} />
      <TopicSelector topics={topics} basePath="/events" params={params} />
      <div>{await getContents(params)}</div>
    </section>
  );
}
