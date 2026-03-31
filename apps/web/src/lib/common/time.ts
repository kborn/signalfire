export function formatDateYYYYMMDDHHMMSS(date: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour time
  })
    .format(new Date(date))
    .replace(',', '');
}
export function formatEventTime(startDateString: string, endDateString: string | null): string {
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
