import {Interval, PriceType} from '../models/index';

export const orderBook = (asset: string, side: string) =>
  `orderbook.${asset.toLowerCase()}.${side.toLowerCase()}`;

export const candle = (
  market: 'spot' | 'mt',
  pair: string,
  priceType: PriceType,
  interval: Interval
) => `candle.${market}.${pair.toLowerCase()}.${priceType}.${interval}`;
