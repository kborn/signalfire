import Link from 'next/link';
import { formatDateYYYYMMDDHHMMSS } from '@/lib/common/time';

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

function formatEventTime(startDateString: string, endDateString: string | null): string {
  let range: string;
  try {
    range = formatDateYYYYMMDDHHMMSS(startDateString);
  } catch {
    return 'Unable to determine event time';
  }

  if (endDateString) {
    try {
      range += ' - ' + formatDateYYYYMMDDHHMMSS(endDateString);
    } catch {
      return 'Unable to determine event time';
    }
  }

  return `${range}`;
}

export function EventSummary({ event }: { event: EventSummaryData }) {
  return (
    <article>
      <h3>
        <Link href={`/events/${event.id}`}>{event.title}</Link>
      </h3>
      <p className="summary">{event.eventType}</p>
      <p className="summary">{event.summary}</p>
      <p className="summary">{formatEventTime(event.startTime, event.endTime)}</p>
      <p className="summary">
        {event.city}, {event.region}
      </p>
    </article>
  );
}
