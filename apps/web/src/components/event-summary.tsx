import Link from 'next/link';
import { formatEventTime } from '@/lib/common/time';

type EventSummaryData = {
  id: number;
  title: string;
  summary: string;
  eventType: string;
  startTime: string;
  endTime: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
};

export function EventSummary({ event }: { event: EventSummaryData }) {
  const locationParts = [event.city, event.region, event.country].filter((value): value is string =>
    Boolean(value),
  );

  return (
    <article className="collectionItem">
      <h2 className="collectionItemTitle">
        <Link href={`/events/${event.id}`}>{event.title}</Link>
      </h2>
      <section className="eventMeta">
        <p className="summary">{event.eventType}</p>
        <p className="summary">{event.summary}</p>
        <p className="summary">{formatEventTime(event.startTime, event.endTime)}</p>
        {locationParts.length > 0 && <p className="summary">{locationParts.join(', ')}</p>}
      </section>
    </article>
  );
}
