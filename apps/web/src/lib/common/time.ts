import { resolveEventTimeZone } from './event-timezone';

export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
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

function formatTimeInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);
}

function formatTimeZoneLabel(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date);

  return parts.find((part) => part.type === 'timeZoneName')?.value ?? 'UTC';
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

function isSameDayInTimeZone(left: Date, right: Date, timeZone: string): boolean {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(left) === formatter.format(right);
}

export function formatContentDate(dateString: string): string | null {
  const date = parseDate(dateString);

  if (!date) {
    return null;
  }

  return formatLongUtcDate(date);
}

type EventTimeLocation = {
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

export function formatEventTime(
  startDateString: string,
  endDateString: string | null,
  location?: EventTimeLocation,
): string {
  const startDate = parseDate(startDateString);

  if (!startDate) {
    return 'Unable to determine event time';
  }

  const timeZone = resolveEventTimeZone(location ?? {}) ?? 'UTC';
  const timeZoneLabel = formatTimeZoneLabel(startDate, timeZone);
  const startDateLabel = formatDateInTimeZone(startDate, timeZone);
  const startTimeLabel = formatTimeInTimeZone(startDate, timeZone);

  if (!endDateString) {
    return `${startDateLabel} at ${startTimeLabel} ${timeZoneLabel}`;
  }

  const endDate = parseDate(endDateString);

  if (!endDate) {
    return 'Unable to determine event time';
  }

  const endTimeLabel = formatTimeInTimeZone(endDate, timeZone);

  if (isSameDayInTimeZone(startDate, endDate, timeZone)) {
    return `${startDateLabel} from ${startTimeLabel} to ${endTimeLabel} ${timeZoneLabel}`;
  }

  const endDateLabel = formatDateInTimeZone(endDate, timeZone);

  return `${startDateLabel} at ${startTimeLabel} ${timeZoneLabel} to ${endDateLabel} at ${endTimeLabel} ${timeZoneLabel}`;
}

export function formatAdminDateTime(dateString: string): string {
  const date = parseDate(dateString);

  if (!date) {
    return '--';
  }

  return formatShortLocalDateTime(date);
}
