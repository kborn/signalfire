const SESSION_DURATION_MINS = 60 * 12;
export function getNextExpiration(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + SESSION_DURATION_MINS);
  return date;
}
