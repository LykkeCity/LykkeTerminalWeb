import {compose} from 'rambda';

export const withPercent = (val: any) => `${val}%`;

export const withAccuracy = (num: any, accuracy: number = 2) =>
  num.toFixed(accuracy);

export const withSign = (num: any) => (num > 0 ? `+${num}` : num);

export const asChange = compose(withPercent, withSign, withAccuracy);
