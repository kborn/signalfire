export function titleCase(str: string | undefined): string {
  if (!str) {
    return '';
  }
  const lowercasedStr = str.toLowerCase();
  const wordsArray = lowercasedStr.split('-');
  const capitalizedArray = wordsArray.map((word) => {
    if (word.length === 0) return '';

    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedArray.join(' ');
}

export function formatEnumLabel(value: string | undefined): string {
  return titleCase(value?.toLowerCase().replaceAll('_', '-'));
}

export function formatActionTypeLabel(actionType: string | undefined): string {
  return formatEnumLabel(actionType);
}

export function formatEventTypeLabel(eventType: string | undefined): string {
  return formatEnumLabel(eventType);
}

export function normalizeDisplaySummary(summary: string | undefined): string {
  if (!summary) {
    return '';
  }

  return summary
    .replace(/\s+/g, ' ')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    .trim();
}
