import {format, subDays, subMonths, subWeeks, subYears} from 'date-fns';

enum TradeFilter {
  CurrentAsset = 'Current asset',
  All = 'All pairs'
}

export const toOptions = () =>
  Object.keys(TradeFilter).map(x => ({
    value: TradeFilter[x],
    label: TradeFilter[x]
  }));

enum TradeFilterPeriods {
  All = 'All time',
  Day = '1 Day',
  Week = '1 Week',
  Month = '1 Month',
  Year = '1 Year'
}

const TradeFilterPeriodValues = {
  [TradeFilterPeriods.All]: '',
  [TradeFilterPeriods.Day]: format(
    subDays(new Date(), 1),
    'YYYY-MM-DD[T]HH:mm:ssZZ'
  ),
  [TradeFilterPeriods.Week]: format(
    subWeeks(new Date(), 1),
    'YYYY-MM-DD[T]HH:mm:ssZZ'
  ),
  [TradeFilterPeriods.Month]: format(
    subMonths(new Date(), 1),
    'YYYY-MM-DD[T]HH:mm:ssZZ'
  ),
  [TradeFilterPeriods.Year]: format(
    subYears(new Date(), 1),
    'YYYY-MM-DD[T]HH:mm:ssZZ'
  )
};

export const periodsToOptions = () =>
  Object.keys(TradeFilterPeriods).map(x => ({
    value: TradeFilterPeriodValues[TradeFilterPeriods[x]],
    label: TradeFilterPeriods[x]
  }));

export enum TradeFilterTypes {
  All = 'All transactions',
  Buy = 'Buy',
  Sell = 'Sell'
}

const TradeFilterTypeValues = {
  [TradeFilterTypes.All]: '',
  [TradeFilterTypes.Buy]: 'Buy',
  [TradeFilterTypes.Sell]: 'Sell'
};

export const typesToOptions = () =>
  Object.keys(TradeFilterTypes).map(x => ({
    value: TradeFilterTypeValues[TradeFilterTypes[x]],
    label: TradeFilterTypes[x]
  }));

export default TradeFilter;
