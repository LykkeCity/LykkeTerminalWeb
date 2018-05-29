import {Side} from '../models';
import {getPercentsOf, precisionFloor} from './math';

export const getPercentOfValueForLimit = (
  getPriceValue: () => string,
  getQuantityAccuracy: () => number,
  percents: number,
  value: number,
  side: Side
) => {
  if (side === Side.Sell) {
    return getPercentsOf(percents, value, getQuantityAccuracy());
  }
  return getPercentsOf(
    percents,
    value / parseFloat(getPriceValue()),
    getQuantityAccuracy()
  );
};

export const isAmountExceedLimitBalance = (
  isSell: boolean,
  quantityValue: string,
  priceValue: string,
  baseAssetBalance: number,
  quoteAssetBalance: number,
  priceAccuracy: number,
  quantityAccuracy: number
) =>
  isSell
    ? +quantityValue > baseAssetBalance
    : parseFloat(priceValue) *
        precisionFloor(parseFloat(quantityValue), quantityAccuracy) >
      quoteAssetBalance;

export const setActivePercentage = (percentage: any[], index?: number) => {
  let percents: number = 0;

  if (index === undefined) {
    percents = 100;
  }

  percentage.forEach((item: any, i: number) => {
    if (index === i) {
      item.isActive = true;
      percents = item.percent;
    } else {
      item.isActive = false;
    }
  });

  return {
    percents,
    updatedPercentage: percentage
  };
};

export const resetPercentage = (percentage: any[]) => {
  percentage.forEach((item: any) => {
    item.isActive = false;
  });
};
