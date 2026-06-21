import { connection } from 'next/server';
import { EventSummary } from '@/components/event-summary';
import { getEventsList } from '@/lib/api/events';
import { TopicSelector } from '@/components/topic-selector';
import { getTopicsList } from '@/lib/api/topics';
import { parseDate } from '@/lib/common/time';
import EventFilters from '@/app/(public)/events/_components/event-filters';
import { PageSizeSelector } from '@/components/page-size-selector';
import { Pagination } from '@/components/pagination';
import Link from 'next/link';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import type { EventSearchParams, ResolvedEventSearchParams } from './event-search-params';

export const revalidate = 60;

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

type EventSearchParamsWrapper = {
  searchParams?: Promise<EventSearchParams>;
};

function addUTCMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const targetMonth = result.getUTCMonth() + months;
  result.setUTCMonth(targetMonth);
  // Roll back to last day of intended month if day overflowed (e.g. Jan 31 + 3 → May 2)
  if (result.getUTCMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setUTCDate(0);
  }
  return result;
}

function resolveDateWindow(params: EventSearchParams) {
  const startDate = parseDate(params.startDate ?? '') ?? new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = parseDate(params.endDate ?? '') ?? addUTCMonths(startDate, 3);

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

async function getContents(params: ResolvedEventSearchParams) {
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

export default async function EventListPage({ searchParams }: EventSearchParamsWrapper) {
  await connection();
  const params = (await searchParams) ?? {};
  const topics = await getTopicsList();
  const resolvedParams: ResolvedEventSearchParams = { ...params, ...resolveDateWindow(params) };
  return (
    <section className="page-section discoveryPage">
      <div className="discoveryPageHeader">
        <p className="section-label">Browse</p>
        <h1 className="pageTitle">Events</h1>
        <p className="page-intro">
          Find upcoming events by issue, location, and date — protests, town halls, volunteer
          opportunities, and more.
        </p>
        {isDemoModeEnabled() && (
          <p className="metaText">
            Demo events are seeded across NY, PA, CA, TX, and PR — use the region selector to find
            them.
          </p>
        )}
      </div>
      <EventFilters params={resolvedParams} />
      <TopicSelector topics={topics} basePath="/events" params={params} />
      <div>{await getContents(resolvedParams)}</div>
    </section>
  );
}
