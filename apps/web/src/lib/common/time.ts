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
