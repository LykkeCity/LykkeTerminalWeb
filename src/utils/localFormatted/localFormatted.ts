import {formatNumber} from '@lykkex/lykke.js';

export const formattedNumber = formatNumber(0);
export const formattedNumberWithDashes = (
  value: number | null,
  accuracy: number
) => (value == null ? '--' : formatNumber('--')(value, accuracy));
