import {InstrumentModel, OrderType} from '..';
import SideDirection from '../sideDirection';
import {
  aggregateTradesByTimestamp,
  fromRestToTrade,
  fromWampToTrade,
  mapToEffectivePrice
} from '../tradeModel.mapper';

describe('trade model mapper', () => {
  describe('mapToEffectivePrice', () => {
    it('should calc avg price for many trades', () => {
      const assetId = 'BTC';
      const trades = [
        {
          volume: 1,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 2,
          oppositeVolume: 22000,
          price: 11000,
          assetId
        }
      ];

      expect(
        mapToEffectivePrice(trades, assetId, 3, SideDirection.Buy)
      ).toBeCloseTo(32000 / 3);
    });

    it('should return price of the first trade if the trade is alone', () => {
      const trades = [
        {
          volume: 1,
          oppositeVolume: 10000,
          price: 10000,
          assetId: 'assetId'
        }
      ];
      expect(mapToEffectivePrice(trades, 'BTC', 3, SideDirection.Buy)).toBe(
        10000
      );
    });

    it('should return price of the first trade if volume or oppositeVolume is zero', () => {
      const assetId = 'BTC';
      const trades = [
        {
          volume: 0,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 0,
          oppositeVolume: 20000,
          price: 10000,
          assetId
        }
      ];

      expect(mapToEffectivePrice(trades, 'BTC', 3, SideDirection.Buy)).toBe(
        10000
      );
    });

    it('should return price of the first trade if volume or oppositeVolume is zero', () => {
      const assetId = 'BTC';
      const trades = [
        {
          volume: 0,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 2,
          oppositeVolume: 22000,
          price: 11000,
          assetId
        }
      ];

      expect(mapToEffectivePrice(trades, 'BTC', 3, SideDirection.Buy)).toBe(
        11000
      );
    });

    it('should return price of the first trade with not empty colume if some trades have zero volumes', () => {
      const assetId = 'BTC';
      const trades = [
        {
          volume: 0,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 2,
          oppositeVolume: 22000,
          price: 11000,
          assetId
        }
      ];

      expect(mapToEffectivePrice(trades, 'BTC', 3, SideDirection.Buy)).toBe(
        11000
      );
    });

    it('should return rounded effective price', () => {
      const assetId = 'BTC';
      const buyTrades = [
        {
          volume: 1,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 2,
          oppositeVolume: 22000,
          price: 11000,
          assetId
        }
      ];
      const sellTrades = [
        {
          volume: 1,
          oppositeVolume: 10000,
          price: 10000,
          assetId
        },
        {
          volume: 2,
          oppositeVolume: 22000,
          price: 11000,
          assetId
        }
      ];

      expect(
        mapToEffectivePrice(sellTrades, 'BTC', 3, SideDirection.Sell)
      ).toBe(10666.666);
      expect(mapToEffectivePrice(buyTrades, 'BTC', 3, SideDirection.Buy)).toBe(
        10666.667
      );
    });

    it('should return undefined if trades is an empty array', () => {
      expect(mapToEffectivePrice(undefined, 'BTC', 3, SideDirection.Buy)).toBe(
        undefined
      );
    });
  });

  describe('map to trade from trade list', () => {
    it('should map several trades to a single trade', () => {
      const dto = [
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_cbbd0427-b1c4-4c66-85c4-7f52ae95649d',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 10444.22,
          Price: 10209.399,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'cbbd0427-b1c4-4c66-85c4-7f52ae95649d',
          OppositeAsset: 'BTC',
          OppositeVolume: 1.02299999
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_cbbd0427-b1c4-4c66-85c4-7f52ae95649d',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 1.02299999,
          Price: 10209.399,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'cbbd0427-b1c4-4c66-85c4-7f52ae95649d',
          OppositeAsset: 'USD',
          OppositeVolume: 10444.22
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_fbf1eadd-10aa-416b-a258-5d3a723ec8d9',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 10209.51,
          Price: 10209.503,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'fbf1eadd-10aa-416b-a258-5d3a723ec8d9',
          OppositeAsset: 'BTC',
          OppositeVolume: 1
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_fbf1eadd-10aa-416b-a258-5d3a723ec8d9',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 1,
          Price: 10209.503,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'fbf1eadd-10aa-416b-a258-5d3a723ec8d9',
          OppositeAsset: 'USD',
          OppositeVolume: 10209.51
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_bc1c0066-3453-46cf-9fcb-51bcb7edddbe',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 51.05,
          Price: 10209.712,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'bc1c0066-3453-46cf-9fcb-51bcb7edddbe',
          OppositeAsset: 'BTC',
          OppositeVolume: 0.005
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_bc1c0066-3453-46cf-9fcb-51bcb7edddbe',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 0.005,
          Price: 10209.712,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'bc1c0066-3453-46cf-9fcb-51bcb7edddbe',
          OppositeAsset: 'USD',
          OppositeVolume: 51.05
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_7640a252-4bbb-4ffc-a14b-29d47be76d2d',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 112.33,
          Price: 10211.585,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: '7640a252-4bbb-4ffc-a14b-29d47be76d2d',
          OppositeAsset: 'BTC',
          OppositeVolume: 0.01099999
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_7640a252-4bbb-4ffc-a14b-29d47be76d2d',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 0.01099999,
          Price: 10211.585,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: '7640a252-4bbb-4ffc-a14b-29d47be76d2d',
          OppositeAsset: 'USD',
          OppositeVolume: 112.33
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_d4af70bb-5548-4f47-b39f-5a774c20a9fb',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 112.34,
          Price: 10212.002,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'd4af70bb-5548-4f47-b39f-5a774c20a9fb',
          OppositeAsset: 'BTC',
          OppositeVolume: 0.01099999
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_d4af70bb-5548-4f47-b39f-5a774c20a9fb',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 0.01099999,
          Price: 10212.002,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'd4af70bb-5548-4f47-b39f-5a774c20a9fb',
          OppositeAsset: 'USD',
          OppositeVolume: 112.34
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_c77c2638-43b7-4b3e-aa2c-d16454be5fdb',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 1,
          Asset: 'USD',
          Volume: 14825.67,
          Price: 10224.598,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'c77c2638-43b7-4b3e-aa2c-d16454be5fdb',
          OppositeAsset: 'BTC',
          OppositeVolume: 1.45000005
        },
        {
          Id: 0,
          TradeId:
            '6240cb93-1348-46c5-bf86-1f9c4c57d05c_c77c2638-43b7-4b3e-aa2c-d16454be5fdb',
          UserId: '481fcd96-8952-4031-82dc-fd31c778983a',
          HashedUserId: '43C2A7882182C2619A2728FB28CCB65F23B26617',
          WalletId: '0269b387-09de-40f0-b6a8-ca2950576ac0',
          WalletType: 'Trading',
          OrderId: '6240cb93-1348-46c5-bf86-1f9c4c57d05c',
          OrderType: 'Market',
          Direction: 0,
          Asset: 'BTC',
          Volume: 1.45000005,
          Price: 10224.598,
          DateTime: '2018-03-12T11:24:19.636Z',
          OppositeOrderId: 'c77c2638-43b7-4b3e-aa2c-d16454be5fdb',
          OppositeAsset: 'USD',
          OppositeVolume: 14825.67
        }
      ];

      const trade = fromWampToTrade(dto, [
        {
          baseAsset: {
            id: 'BTC'
          },
          quoteAsset: {
            id: 'USD'
          },
          accuracy: 3
        }
      ] as InstrumentModel[]);
      expect(trade.volume).toBe(3.50000002);
      expect(trade.price).toBe(10215.749);
      expect(trade.oppositeVolume).toBe(35755.12);
      expect(trade.orderType).toBe(OrderType.Market);
    });
  });

  describe('map from rest', () => {
    const dto = [
      {
        Id: '201803271023_91be5d0e-e3e0-4291-a777-28a236693757',
        DateTime: '2018-03-27T10:23:30.074Z',
        Type: 'Trade',
        State: 'Finished',
        Amount: 8.61,
        Asset: 'USD',
        AssetPair: 'BTCUSD',
        Price: 7832.819,
        FeeSize: 1.47,
        FeeType: 'Absolute'
      },
      {
        Id: '201803271023_69dfd912-23da-4baa-9e6d-addba6d9574c',
        DateTime: '2018-03-27T10:23:30.074Z',
        Type: 'Trade',
        State: 'Finished',
        Amount: -0.0011,
        Asset: 'BTC',
        AssetPair: 'BTCUSD',
        Price: 7832.819,
        FeeSize: 0,
        FeeType: 'Unknown'
      }
    ];

    const dtoRelative = [
      {
        Id: '201803271023_91be5d0e-e3e0-4291-a777-28a236693757',
        DateTime: '2018-03-27T10:23:30.074Z',
        Type: 'Trade',
        State: 'Finished',
        Amount: -8.61,
        Asset: 'USD',
        AssetPair: 'BTCUSD',
        Price: 7832.819,
        FeeSize: 0,
        FeeType: 'Unknown'
      },
      {
        Id: '201803271023_69dfd912-23da-4baa-9e6d-addba6d9574c',
        DateTime: '2018-03-27T10:23:30.074Z',
        Type: 'Trade',
        State: 'Finished',
        Amount: 1,
        Asset: 'BTC',
        AssetPair: 'BTCUSD',
        Price: 7832.819,
        FeeSize: 5,
        FeeType: 'Relative'
      }
    ];

    const instruments = [
      {
        id: 'BTCUSD',
        baseAsset: {
          id: 'BTC'
        },
        quoteAsset: {
          id: 'USD'
        },
        accuracy: 3
      }
    ] as InstrumentModel[];

    it('should aggregate twinned trades into one', () => {
      expect(aggregateTradesByTimestamp(dto, instruments)).toHaveLength(1);
    });

    it('should calculate fee', () => {
      expect(aggregateTradesByTimestamp(dto, instruments)[0].fee).toBe(1.47);
      expect(aggregateTradesByTimestamp(dtoRelative, instruments)[0].fee).toBe(
        0.05
      );
    });

    describe('toSingleTrade', () => {
      expect([fromRestToTrade('BTC', dto)]).toHaveLength(1);
    });
  });
});
