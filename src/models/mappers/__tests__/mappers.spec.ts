import {filterByInstrumentsAndMapToLimitOrder} from '../';
import {InstrumentModel, OrderModel} from '../../index';

describe('mappers', () => {
  it('should filter by instrument and map to limit order', () => {
    const instruments = [
      new InstrumentModel({
        id: 'BTCUSD',
        name: 'BTC/USD',
        baseAsset: undefined,
        quoteAsset: undefined,
        accuracy: 3,
        invertedAccuracy: 8
      }),
      new InstrumentModel({
        id: 'BTCCHF',
        name: 'BTC/CHF',
        baseAsset: undefined,
        quoteAsset: undefined,
        accuracy: 3,
        invertedAccuracy: 8
      })
    ];

    const orders = [
      {
        AssetPairId: 'BTCCHF',
        CreateDateTime: '2018-01-17T07:17:40.84Z',
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
        OrderAction: 'Buy',
        Price: 1,
        Status: 'InOrderBook',
        Volume: 0.0001,
        RemainingVolume: 0
      },
      {
        AssetPairId: 'BTCUSD',
        CreateDateTime: '2018-01-17T07:17:40.84Z',
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
        OrderAction: 'Buy',
        Price: 1,
        Status: 'InOrderBook',
        Volume: 0.0001,
        RemainingVolume: 0
      },
      {
        AssetPairId: 'BTCBYN',
        CreateDateTime: '2018-01-17T07:17:40.84Z',
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
        OrderAction: 'Buy',
        Price: 1,
        Status: 'InOrderBook',
        Volume: 0.0001,
        RemainingVolume: 0
      }
    ];
    const limitOrders = filterByInstrumentsAndMapToLimitOrder(
      instruments,
      orders
    );
    expect(limitOrders.length).toBe(2);
    expect(limitOrders[0] instanceof OrderModel).toBeTruthy();
  });
});
