import {compose} from 'rambda';

export const withPercent = (val: any) => `${val}%`;

export const withAccuracy = (num: any, accuracy: number = 2) =>
  num.toFixed(accuracy);

export const withSign = (num: any) => (num > 0 ? `+${num}` : num);

export const asChange = compose(withPercent, withSign, withAccuracy);

export const capitalize = (str: string | undefined | null) =>
  str ? str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase() : '';

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const nextSkip = (skip: number, take: number, skipWamp: number) => {
  return skip + take + skipWamp;
  //   skip =
  //   (!skip ? skip + take : skip + loading) +
  //   skipWamp;
  // skipWamp = 0;
  // return skip;
};
