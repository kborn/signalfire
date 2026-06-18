import Link from 'next/link';
import type { EventSummary as EventSummaryData } from '@signal-fire/api-contracts';
import { formatEventTime } from '@/lib/common/time';
import { formatEventTypeLabel } from '@/lib/common/utils';

export function EventSummary({ event }: { event: EventSummaryData }) {
  const locationParts = [event.city, event.region, event.country].filter((value): value is string =>
    Boolean(value),
  );

  return (
    <Link href={`/events/${event.id}`} className="collectionItem">
      <h2 className="collectionItemTitle">{event.title}</h2>
      <p className="eventMeta">{formatEventTypeLabel(event.eventType)}</p>
      <p className="collectionItemSummary">{event.summary}</p>
      <p className="eventMeta">
        {formatEventTime(event.startTime, event.endTime, {
          city: event.city,
          region: event.region,
          country: event.country,
        })}
      </p>
      {locationParts.length > 0 && <p className="eventMeta">{locationParts.join(', ')}</p>}
    </Link>
  );
}
