import {compose} from 'rambda';

export const withPercent = (val: any) => `${val}%`;

export const withAccuracy = (num: any, accuracy: number = 2) =>
  num.toFixed(accuracy);

export const withSign = (num: any) => (num > 0 ? `+${num}` : num);

export const asChange = compose(
  withPercent,
  withSign,
  withAccuracy
);

export const capitalize = (str: string | undefined | null) =>
  str ? str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase() : '';

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const normalizeVolume = (min: number, max: number, volume: number) => {
  const length = 300;
  const minLength = 30;

  const minp = minLength;
  const maxp = length;

  const minValue = min === 0 ? 1 : min;

  const minv = Math.log(minValue);
  const maxv = Math.log(max);

  const scale = (maxv - minv) / (maxp - minp);
  if (scale === 0) {
    return minp;
  }
  return (Math.log(volume) - minv) / scale + minp;
};

export const nextSkip = (skip: number, take: number, skipWamp: number) => {
  return skip + take + skipWamp;
};

export const plural = (w: string, count: number) =>
  count > 1 ? w.concat('s') : w;
