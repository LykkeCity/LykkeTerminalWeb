import {locale} from '../index';

export function formattedNumber(value: number, accuracy?: number): string {
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
