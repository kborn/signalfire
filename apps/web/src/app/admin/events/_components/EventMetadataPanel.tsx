import Link from 'next/link';
import { type AdminEventDetailResponse } from '@signal-fire/api-contracts';
import AdminMetadataPanel from '../../_components/AdminMetadataPanel';
import { formatEventTypeLabel } from '@/lib/common/utils';

function formatDateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : '--';
}

export default function EventMetadataPanel({ event }: { event: AdminEventDetailResponse }) {
  const livePageHref = event.status === 'PUBLISHED' ? `/events/${event.id}` : null;

  return (
    <AdminMetadataPanel
      className="eventMetadataPanel"
      ariaLabel="Event metadata"
      items={[
        {
          label: 'ID',
          value: livePageHref ? (
            <Link href={livePageHref} className="adminMetadataLink">
              {event.id}
            </Link>
          ) : (
            event.id
          ),
          className: 'adminMetadataItem--id',
        },
        {
          label: 'Status',
          value: <span className="adminBadge">{event.status}</span>,
          className: 'adminMetadataItem--compact',
        },
        {
          label: 'Event Type',
          value: formatEventTypeLabel(event.eventType),
          className: 'adminMetadataItem--type',
        },
        {
          label: 'Start',
          value: (
            <time className="adminMetadataTime" dateTime={event.startTime}>
              {formatDateTime(event.startTime)}
            </time>
          ),
          className: 'adminMetadataItem--date',
        },
        {
          label: 'End',
          value: event.endTime ? (
            <time className="adminMetadataTime" dateTime={event.endTime}>
              {formatDateTime(event.endTime)}
            </time>
          ) : (
            '--'
          ),
          className: 'adminMetadataItem--date',
        },
        {
          label: 'ZIP',
          value: event.postalCode,
          className: 'adminMetadataItem--zip',
        },
      ]}
    />
  );
}
