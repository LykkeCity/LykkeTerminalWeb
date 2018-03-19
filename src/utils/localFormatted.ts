import {getLocale} from '../index';

const locale = getLocale();
export function formattedNumber(value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formattedNumberWithCurrency(
  value: number,
  currency: string
): string {
  if (currency.length !== 3) currency = 'USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
}
