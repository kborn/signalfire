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
