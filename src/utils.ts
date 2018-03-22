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

export const normalizeVolume = (
  volume: number,
  minVolume: number,
  maxVolume: number
) => {
  const minp = 10;
  const maxp = 100;

  if (volume === minVolume && volume === maxVolume) {
    return maxp;
  }

  if (volume === minVolume && minVolume !== maxVolume) {
    return minp;
  }

  if (volume === maxVolume && minVolume !== maxVolume) {
    return maxp;
  }

  const minv = Math.log(minVolume);
  const maxv = Math.log(maxVolume);

  const scale = (maxv - minv) / (maxp - minp);
  return (Math.log(volume) - minv) / scale + minp;
};
