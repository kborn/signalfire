export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatUtcDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatLongUtcDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
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

function formatShortLocalDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function isSameUtcDay(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

export function formatContentDate(dateString: string): string | null {
  const date = parseDate(dateString);

  if (!date) {
    return null;
  }

  return formatLongUtcDate(date);
}

export function formatEventTime(startDateString: string, endDateString: string | null): string {
  const startDate = parseDate(startDateString);

  if (!startDate) {
    return 'Unable to determine event time';
  }

  const startDateLabel = formatUtcDate(startDate);
  const startTimeLabel = formatUtcTime(startDate);

  if (!endDateString) {
    return `${startDateLabel} at ${startTimeLabel} UTC`;
  }

  const endDate = parseDate(endDateString);

  if (!endDate) {
    return 'Unable to determine event time';
  }

  const endTimeLabel = formatUtcTime(endDate);

  if (isSameUtcDay(startDate, endDate)) {
    return `${startDateLabel} from ${startTimeLabel} to ${endTimeLabel} UTC`;
  }

  const endDateLabel = formatUtcDate(endDate);

  return `${startDateLabel} at ${startTimeLabel} UTC to ${endDateLabel} at ${endTimeLabel} UTC`;
}

export function formatAdminDateTime(dateString: string): string {
  const date = parseDate(dateString);

  if (!date) {
    return '--';
  }

  return formatShortLocalDateTime(date);
}
