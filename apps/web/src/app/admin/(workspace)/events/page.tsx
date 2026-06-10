import { Fragment } from 'react';
import Link from 'next/link';
import { type EntityStatus } from '@signal-fire/api-contracts';
import { getAdminEventsList } from '@/lib/api/admin.server';
import { formatEventTypeLabel } from '@/lib/common/utils';
import { withAdminAuthRedirect } from '@/lib/admin/auth-redirect';

export const dynamic = 'force-dynamic';

type EventListPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function parseStatus(value?: string): EntityStatus {
  return value === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}

function buildEventsHref(status: EntityStatus) {
  const params = new URLSearchParams();
  params.set('status', status);
  return `/admin/events?${params.toString()}`;
}

export default async function EventsListPage({ searchParams }: EventListPageProps) {
  const { status } = await searchParams;
  const currentStatus = parseStatus(status);
  const eventList = await withAdminAuthRedirect(buildEventsHref(currentStatus), async () => {
    return await getAdminEventsList({ status: currentStatus });
  });

  return (
    <section className="page-section articleEditorPage">
      <header className="adminHeader">
        <div>
          <h1 className="pageTitle">Events</h1>
          <p className="adminDek">Create and maintain curated public events.</p>
        </div>

        <div className="ctaRow">
          <Link href="/admin/events/new" className="primaryCTA">
            New Event
          </Link>
        </div>
      </header>

      <div className="adminFilterActionLabel">Event status filter</div>
      <nav className="adminSegmentedControl" aria-label="Event status">
        <Link
          href={buildEventsHref('DRAFT')}
          aria-current={currentStatus === 'DRAFT' ? 'page' : undefined}
        >
          Draft
        </Link>
        <Link
          href={buildEventsHref('PUBLISHED')}
          aria-current={currentStatus === 'PUBLISHED' ? 'page' : undefined}
        >
          Published
        </Link>
      </nav>

      <section className="adminPanel" aria-labelledby="admin-events-heading">
        <div className="adminPanelHeader">
          <h2 id="admin-events-heading">Event records</h2>
        </div>

        <table className="adminTable adminRecordTable adminRecordTableEvents">
          <colgroup>
            <col className="adminRecordTablePrimaryCol" />
            <col className="adminRecordTableTypeCol" />
            <col className="adminRecordTableDateCol" />
            <col className="adminRecordTableStatusCol" />
            <col className="adminRecordTableDateCol" />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Start</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {eventList.items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="adminEmptyState">
                    <p className="adminEmptyStateTitle">No events yet.</p>
                    <p>Create an event to populate this list.</p>
                  </div>
                </td>
              </tr>
            ) : (
              eventList.items.map((event) => (
                <Fragment key={event.id}>
                  <tr>
                    <td>
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="adminTableRecordLink"
                        aria-label={`Open event ${event.title}`}
                      >
                        <span className="adminTableRecordTitle">
                          {event.title} <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </td>
                    <td>{formatEventTypeLabel(event.eventType)}</td>
                    <td>{new Date(event.startTime).toLocaleString()}</td>
                    <td>{event.status}</td>
                    <td>{new Date(event.updatedAt).toLocaleString()}</td>
                  </tr>
                  <tr className="adminTableSummaryRow">
                    <td className="adminTableSummaryCell" colSpan={5}>
                      <p className="adminTableCellMeta">{event.summary}</p>
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
