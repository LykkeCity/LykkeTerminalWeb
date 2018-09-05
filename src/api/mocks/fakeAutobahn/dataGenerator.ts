import {Subscription} from 'autobahn';
import randomNumber from '../../../utils/randomNumber';
import * as topics from '../../topics';

export const generateData = (subscription: Subscription) => {
  const topic = subscription.topic;

  if (topic.includes('orderbook.spot.')) {
    return generateOrderbookData();
  } else if (topic.includes('candle.')) {
    return generateCandleData();
  } else if (topic.includes('quote.spot.')) {
    if (topic.includes('.bid')) {
      return generateQuoteSpotBidData();
    } else {
      return generateQuoteSpotAskData();
    }
  } else if (topic.includes('trades.spot.')) {
    return generateTradesSpotData();
  }

  switch (topic) {
    case topics.trades:
      return generateTradesData();
    case topics.balances:
      return generateBalancesData();
    case topics.orders:
      return generateOrdersData();
  }

  return null;
};

const generateOrderbookData = () => {
  const levels = [];
  for (let i = 0; i < Math.random() * 10; i++) {
    levels.push({
      Id: i.toString(),
      Price: randomNumber(1000, 2000),
      Volume: randomNumber(1000, 2000)
    });
  }

  return {
    AssetPair: 'BTCUSD',
    IsBuy: Math.floor(Math.random() * 10) % 2 === 0,
    Levels: levels,
    Timestamp: new Date().toLocaleString()
  };
};

const generateCandleData = () => {
  return {
    a: 'BTCUSD',
    c: randomNumber(1000, 2000),
    h: randomNumber(1000, 2000),
    i: 'Day',
    l: randomNumber(1000, 2000),
    m: 'Spot',
    o: randomNumber(1000, 2000),
    ov: randomNumber(1000, 2000),
    p: 'Trades',
    t: new Date().toLocaleString(),
    v: randomNumber(1000, 2000)
  };
};

const generateQuoteSpotBidData = () => {
  return {
    a: 'BTCUSD',
    m: 'Spot',
    p: randomNumber(1000, 2000),
    pt: 'Bid',
    t: new Date().toLocaleString()
  };
};

const generateQuoteSpotAskData = () => {
  return {
    a: 'BTCUSD',
    m: 'Spot',
    p: randomNumber(1000, 2000),
    pt: 'Ask',
    t: new Date().toLocaleString()
  };
};

const generateTradesSpotData = () => {
  return {
    Action: Math.floor(Math.random() * 10) % 2 === 0 ? 'Buy' : 'Sell',
    AssetPairId: 'BTCUSD',
    DateTime: new Date().toLocaleString(),
    Id: new Date().toLocaleString(),
    Index: 0,
    Price: randomNumber(1000, 2000),
    Volume: randomNumber(1000, 2000)
  };
};

const generateTradesData = () => {
  return [
    {
      Asset: 'BTC',
      DateTime: new Date().toLocaleString(),
      Direction: 1,
      HashedUserId: '0000000000000000000000000000000000000000',
      OppositeAsset: 'USD',
      OppositeOrderId: '00000000-0000-0000-0000-00000000000',
      OppositeVolume: randomNumber(1000, 2000),
      OrderId: '00000000-0000-0000-0000-00000000000',
      OrderType: 'Market',
      Price: randomNumber(1000, 2000),
      TradeId:
        '00000000-0000-0000-0000-000000000000_00000000-0000-0000-0000-000000000000',
      TradeLegId: '00000000-0000-0000-0000-00000000000',
      UserId: '00000000-0000-0000-0000-00000000000',
      Volume: randomNumber(1000, 2000),
      WalletId: '00000000-0000-0000-0000-00000000000',
      WalletType: 'Trading'
    },
    {
      Asset: 'USD',
      DateTime: new Date().toLocaleString(),
      Direction: 0,
      HashedUserId: '0000000000000000000000000000000000000000',
      OppositeAsset: 'BTC',
      OppositeOrderId: '00000000-0000-0000-0000-00000000000',
      OppositeVolume: randomNumber(1000, 2000),
      OrderId: '00000000-0000-0000-0000-00000000000',
      OrderType: 'Market',
      Price: randomNumber(1000, 2000),
      TradeId:
        '00000000-0000-0000-0000-000000000000_00000000-0000-0000-0000-000000000000',
      TradeLegId: '00000000-0000-0000-0000-00000000000',
      UserId: '00000000-0000-0000-0000-00000000000',
      Volume: randomNumber(1000, 2000),
      WalletId: '00000000-0000-0000-0000-00000000000',
      WalletType: 'Trading'
    }
  ];
};

const generateBalancesData = () => {
  return {
    a: 'BTC',
    b: randomNumber(1, 100),
    id: '00000000-0000-0000-0000-00000000000'
  };
};

const generateOrdersData = () => {
  return [
    {
      AssetPairId: 'BTCUSD',
      CreateDateTime: new Date(),
      Id: '00000000-0000-0000-0000-00000000000',
      LowerLimitPrice: null,
      LowerPrice: null,
      OrderAction: Math.floor(Math.random() * 10) % 2 === 0 ? 'Buy' : 'Sell',
      Price: randomNumber(1000, 2000),
      RejectReason: null,
      RemainingVolume: 0,
      Status: 'Matched',
      Straight: true,
      Type: 'Market',
      UpperLimitPrice: null,
      UpperPrice: null,
      Volume: randomNumber(1000, 2000)
    }
  ];
};
