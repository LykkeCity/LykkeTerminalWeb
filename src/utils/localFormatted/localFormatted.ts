export const locale =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  'en-US';
const timezone = 'UTC';

export function formattedNumber(value: any, accuracy?: number): string {
  if (typeof value === 'string') {
    accuracy = !accuracy ? value.length - value.search(/\./) - 1 : accuracy;
    value = +value;
  }
  const result = new Intl.NumberFormat(locale).format(value);

  if (!accuracy) {
    return result;
  } else {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: accuracy,
      maximumFractionDigits: accuracy
    }).format(value);
  }
}

export function formattedDate(date: any): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

export function formattedTime(date: any): string {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: timezone
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formattedDateTime(date: any): string {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: timezone
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}
