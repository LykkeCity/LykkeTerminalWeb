import * as orderMapper from '..';
import {
  AssetCategoryModel,
  AssetResponseModel,
  DescriptionResponseModel,
  InstrumentModel,
  OrderType,
  Side
} from '../..';
import AssetModel from '../../assetModel';
import {Order} from '../../order';

describe('orderMapper', () => {
  describe('method mapToBarFromRest', () => {
    it('should return mapped object', () => {
      const rawObject = {
        DateTime: Date.now(),
        Close: 1,
        Open: 2,
        High: 3,
        Low: 4
      };

      const mappedObjectWithDefaultVolume = orderMapper.mapToBarFromRest(
        rawObject
      );
      expect(mappedObjectWithDefaultVolume.time).toEqual(
        new Date(rawObject.DateTime).getTime()
      );
      expect(mappedObjectWithDefaultVolume.close).toEqual(rawObject.Close);
      expect(mappedObjectWithDefaultVolume.open).toEqual(rawObject.Open);
      expect(mappedObjectWithDefaultVolume.high).toEqual(rawObject.High);
      expect(mappedObjectWithDefaultVolume.low).toEqual(rawObject.Low);
      expect(mappedObjectWithDefaultVolume.volume).toEqual(0);

      const mappedObjectWithVolume = orderMapper.mapToBarFromRest(
        Object.assign(rawObject, {Volume: 5})
      );
      expect(mappedObjectWithVolume.volume).toEqual(5);
    });
  });

  describe('method mapToBarFromWamp', () => {
    it('should return mapped object', () => {
      const rawObject = {
        t: Date.now(),
        c: 1,
        o: 2,
        h: 3,
        l: 4,
        v: 5
      };

      const mappedObjectWithVolume = orderMapper.mapToBarFromWamp(rawObject);
      expect(mappedObjectWithVolume.close).toEqual(rawObject.c);
      expect(mappedObjectWithVolume.high).toEqual(rawObject.h);
      expect(mappedObjectWithVolume.low).toEqual(rawObject.l);
      expect(mappedObjectWithVolume.open).toEqual(rawObject.o);
      expect(mappedObjectWithVolume.time).toEqual(
        new Date(rawObject.t).getTime()
      );
      expect(mappedObjectWithVolume.volume).toEqual(rawObject.v);
    });
  });

  describe('method mapToLimitOrder', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        CreateDateTime: Date.now(),
        OrderAction: Side.Buy,
        Voume: 1,
        Volume: 2,
        RemainingVolume: 3,
        Price: 4,
        AssetPairId: '5'
      };

      const mappedObject = orderMapper.mapToLimitOrder(rawObject);
      expect(mappedObject.createdAt).toEqual(
        new Date(rawObject.CreateDateTime)
      );
      expect(mappedObject.id).toEqual(rawObject.Id);
      expect(mappedObject.price).toEqual(Number(rawObject.Price));
      expect(mappedObject.side).toEqual(rawObject.OrderAction);
      expect(mappedObject.symbol).toEqual(rawObject.AssetPairId);
      expect(mappedObject.volume).toEqual(rawObject.Volume);
      expect(mappedObject.remainingVolume).toEqual(rawObject.RemainingVolume);
    });
  });

  describe('method filterByInstrumentsAndMapToLimitOrder', () => {
    it('should filter orders by asset pair id', () => {
      const instruments = [
        new InstrumentModel({id: '1'}),
        new InstrumentModel({id: '2'}),
        new InstrumentModel({id: '3'})
      ];
      const orders = [
        {AssetPairId: '1'},
        {AssetPairId: '2'},
        {AssetPairId: '4'}
      ];

      const filteredOrders = orderMapper.filterByInstrumentsAndMapToLimitOrder(
        instruments,
        orders
      );
      expect(filteredOrders).toHaveLength(2);
      expect(filteredOrders[0].symbol).toBe('1');
      expect(filteredOrders[1].symbol).toBe('2');
    });
  });

  describe('method mapToWatchlist', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        Name: 'Test',
        AssetPairIds: '2',
        ReadOnly: false,
        Order: new Order()
      };

      const mappedObject = orderMapper.mapToWatchlist(rawObject);
      expect(mappedObject.assetPairIds).toEqual(rawObject.AssetPairIds);
      expect(mappedObject.id).toEqual(rawObject.Id);
      expect(mappedObject.name).toEqual(rawObject.Name);
      expect(mappedObject.readOnly).toEqual(rawObject.ReadOnly);
      expect(mappedObject.order).toEqual(rawObject.Order);
    });
  });

  describe('method mapHistoryTypeToOrderType', () => {
    it('should return Market order type for Market and Trade', () => {
      expect(orderMapper.mapHistoryTypeToOrderType('Market')).toBe(
        OrderType.Market
      );
      expect(orderMapper.mapHistoryTypeToOrderType('Trade')).toBe(
        OrderType.Market
      );
    });

    it('should return Limit order type for Limit and LimitTrade', () => {
      expect(orderMapper.mapHistoryTypeToOrderType('Limit')).toBe(
        OrderType.Limit
      );
      expect(orderMapper.mapHistoryTypeToOrderType('LimitTrade')).toBe(
        OrderType.Limit
      );
    });

    it('should return undefined for incorrect type', () => {
      expect(orderMapper.mapHistoryTypeToOrderType('MarketLimir')).toBe(
        undefined
      );
    });
  });

  describe('method mapToAsset', () => {
    it('should return mapped object', () => {
      const rawObject = Object.assign(new AssetResponseModel(), {
        Id: '1',
        Name: 'Test',
        DisplayId: '2',
        CategoryId: '3',
        Accuracy: 8,
        IconUrl: '#',
        CanBeBase: true
      });
      const description = Object.assign(new DescriptionResponseModel(), {
        FullName: 'Test'
      });

      const mappedAssetModel = orderMapper.mapToAsset(
        rawObject,
        [],
        description
      );
      expect(mappedAssetModel.accuracy).toEqual(rawObject.Accuracy);
      expect(mappedAssetModel.category).toEqual(AssetCategoryModel.Other());
      expect(mappedAssetModel.iconUrl).toEqual(rawObject.IconUrl);
      expect(mappedAssetModel.id).toEqual(rawObject.Id);
      expect(mappedAssetModel.canBeBase).toEqual(rawObject.CanBeBase);
      expect(mappedAssetModel.name).toEqual(rawObject.DisplayId);

      const assetCategoryModel = new AssetCategoryModel({id: '3'});
      const mappedAssetModelWithCetegories = orderMapper.mapToAsset(
        rawObject,
        [assetCategoryModel],
        description
      );
      expect(mappedAssetModelWithCetegories.category).toEqual(
        assetCategoryModel
      );
    });
  });

  describe('method mapToAssetCategory', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        Name: 'Test'
      };

      const mappedObject = orderMapper.mapToAssetCategory(rawObject);
      expect(mappedObject.id).toEqual(rawObject.Id);
      expect(mappedObject.name).toEqual(rawObject.Name);
    });
  });

  describe('method mapToInstrument', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        Accuracy: 8,
        BaseAssetId: '2',
        InvertedAccuracy: 8,
        Name: 'Test',
        QuotingAssetId: '3'
      };
      const getAssetById = (value: string) => new AssetModel({id: value});

      const mappedObject = orderMapper.mapToInstrument(rawObject, getAssetById);
      expect(mappedObject.id).toEqual(rawObject.Id);
      expect(mappedObject.name).toEqual(rawObject.Name);
      expect(mappedObject.baseAsset.id).toEqual(rawObject.BaseAssetId);
      expect(mappedObject.quoteAsset.id).toEqual(rawObject.QuotingAssetId);
      expect(mappedObject.accuracy).toEqual(rawObject.Accuracy);
      expect(mappedObject.invertedAccuracy).toEqual(rawObject.InvertedAccuracy);
    });
  });

  describe('method mapToPublicInstrument', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        Accuracy: 8,
        BaseAssetId: '2',
        InvertedAccuracy: 8,
        Name: 'Test',
        QuotingAssetId: '3'
      };
      const getAssetById = (value: string) => new AssetModel({id: value});

      const mappedObject = orderMapper.mapToPublicInstrument(
        rawObject,
        getAssetById
      );
      expect(mappedObject.id).toEqual(rawObject.Id);
      expect(mappedObject.name).toEqual(rawObject.Name);
      expect(mappedObject.baseAsset.id).toEqual(rawObject.BaseAssetId);
      expect(mappedObject.quoteAsset.id).toEqual(rawObject.QuotingAssetId);
      expect(mappedObject.accuracy).toEqual(rawObject.Accuracy);
      expect(mappedObject.invertedAccuracy).toEqual(rawObject.InvertedAccuracy);
    });
  });
});
