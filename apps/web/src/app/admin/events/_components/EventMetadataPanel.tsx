import Link from 'next/link';
import { type AdminEventDetailResponse } from '@signal-fire/api-contracts';
import { formatEventTypeLabel } from '@/lib/common/utils';

function formatDateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '--';
}

export default function EventMetadataPanel({ event }: { event: AdminEventDetailResponse }) {
  const livePageHref = event.status === 'PUBLISHED' ? `/events/${event.id}` : null;

  return (
    <section
      className="adminPanel adminMetadataPanel eventMetadataPanel"
      aria-label="Event metadata"
    >
      <dl className="eventMetadataBar">
        <div className="eventMetadataItem">
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

        <div className="eventMetadataItem eventMetadataItem--compact">
          <dt>Status</dt>
          <dd>
            <span className="adminBadge">{event.status}</span>
          </dd>
        </div>

        <div className="eventMetadataItem eventMetadataItem--compact">
          <dt>Event Type</dt>
          <dd>{formatEventTypeLabel(event.eventType)}</dd>
        </div>

        <div className="eventMetadataItem eventMetadataItem--wide">
          <dt>Start</dt>
          <dd>
            <time className="adminMetadataTime" dateTime={event.startTime}>
              {formatDateTime(event.startTime)}
            </time>
          </dd>
        </div>

        <div className="eventMetadataItem eventMetadataItem--compact">
          <dt>ZIP</dt>
          <dd>{event.postalCode}</dd>
        </div>
      </dl>
    </section>
  );
}
