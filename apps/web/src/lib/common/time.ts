function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatUtcDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatUtcTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date);
}

function isSameUtcDay(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

export function formatEventTime(startDateString: string, endDateString: string | null): string {
  const startDate = parseDate(startDateString);

  if (!startDate) {
    return 'Unable to determine event time';
  }

  const startDateLabel = formatUtcDate(startDate);
  const startTimeLabel = formatUtcTime(startDate);

  if (!endDateString) {
    return `${startDateLabel}, ${startTimeLabel} UTC`;
  }

  const endDate = parseDate(endDateString);

  if (!endDate) {
    return 'Unable to determine event time';
  }

  const endTimeLabel = formatUtcTime(endDate);

  if (isSameUtcDay(startDate, endDate)) {
    return `${startDateLabel}, ${startTimeLabel} - ${endTimeLabel} UTC`;
  }

  const endDateLabel = formatUtcDate(endDate);

  return `${startDateLabel}, ${startTimeLabel} UTC - ${endDateLabel}, ${endTimeLabel} UTC`;
}
