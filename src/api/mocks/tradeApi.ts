import randomNumber from '../../utils/randomNumber';
import TradeApi from '../tradeApi';

const generateTrades = (instrumentId: string, count: number) => {
  const trades = [];

  const baseAsset = /[\s\S][\s\S][\s\S]/.exec(instrumentId);
  const quoteAsset = /[\s\S]{0,3}$/.exec(instrumentId);
  for (let i = 0; i < count; i++) {
    trades.push({
      Amount: randomNumber(1000, 2000),
      Asset: baseAsset && instrumentId.length ? baseAsset[0] : 'BTC',
      AssetPair: instrumentId,
      DateTime: new Date().valueOf() + i,
      FeeSize: 0,
      FeeType: 'Absolute',
      Id: `${i.toString()}${(
        new Date().valueOf() + i
      ).toLocaleString()}${Math.random()}`,
      Price: randomNumber(1000, 2000),
      State: 'Finished',
      Type: 'Trade'
    });
    trades.push({
      Amount: randomNumber(1000, 2000),
      Asset: quoteAsset && instrumentId.length ? quoteAsset[0] : 'USD',
      AssetPair: instrumentId,
      DateTime: new Date().valueOf() + i,
      FeeSize: 0,
      FeeType: 'Absolute',
      Id: `${i.toString()}${(
        new Date().valueOf() + i
      ).toLocaleString()}${Math.random()}`,
      Price: randomNumber(1000, 2000),
      State: 'Finished',
      Type: 'Trade'
    });
  }

  return trades;
};

const generatePublicTrades = (instrumentId: string, count: number) => {
  const trades = [];

  for (let i = 0; i < count; i++) {
    trades.push({
      id: `${i.toString()}${(
        new Date().valueOf() + i
      ).toLocaleString()}${Math.random()}`,
      assetPairId: instrumentId,
      dateTime: new Date().toLocaleString(),
      volume: randomNumber(1000, 2000),
      index: 0,
      price: randomNumber(1000, 2000),
      action: Math.random() % 2 === 0 ? 'Buy' : 'Sell'
    });
  }

  return trades;
};

export class MockTradeApi implements TradeApi {
  fetchTrades = (
    walletId: string,
    instrumentId: string,
    skip: number,
    take: number
  ) => Promise.resolve<any[]>(generateTrades(instrumentId, take));

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    Promise.resolve<any[]>(generatePublicTrades(instrumentId, take));
}
export default new MockTradeApi();
