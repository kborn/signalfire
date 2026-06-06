import Link from 'next/link';
import { type AdminEventDetailResponse } from '@signal-fire/api-contracts';
import { formatEventTypeLabel } from '@/lib/common/utils';

function formatDateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '--';
}

export default function EventMetadataPanel({ event }: { event: AdminEventDetailResponse }) {
  const livePageHref = event.status === 'PUBLISHED' ? `/events/${event.id}` : null;

  return (
    <section className="adminPanel adminMetadataPanel" aria-label="Event metadata">
      <dl className="adminMetadataBar">
        <div className="adminMetadataItem">
          <dt>ID</dt>
          <dd>
            {livePageHref ? (
              <Link href={livePageHref} className="adminMetadataLink">
                {event.id}
              </Link>
            ) : (
              event.id
            )}
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Status</dt>
          <dd>
            <span className="adminBadge">{event.status}</span>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Event Type</dt>
          <dd>{formatEventTypeLabel(event.eventType)}</dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Start</dt>
          <dd>
            <time className="adminMetadataTime" dateTime={event.startTime}>
              {formatDateTime(event.startTime)}
            </time>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Updated</dt>
          <dd>
            <time className="adminMetadataTime" dateTime={event.updatedAt}>
              {formatDateTime(event.updatedAt)}
            </time>
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Published</dt>
          <dd>
            {event.publishedAt ? (
              <time className="adminMetadataTime" dateTime={event.publishedAt}>
                {formatDateTime(event.publishedAt)}
              </time>
            ) : (
              '--'
            )}
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Website</dt>
          <dd>
            {event.website ? (
              <a
                className="adminMetadataLink"
                href={event.website}
                target="_blank"
                rel="noreferrer"
              >
                {event.website}
              </a>
            ) : (
              '--'
            )}
          </dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Public Guidance</dt>
          <dd>{event.publicLocationDescription ?? '--'}</dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Contact</dt>
          <dd>{event.contactEmail ?? '--'}</dd>
        </div>

        <div className="adminMetadataItem">
          <dt>Location</dt>
          <dd>{event.locationName}</dd>
        </div>
      </dl>
    </section>
  );
}
