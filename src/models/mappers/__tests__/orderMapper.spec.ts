import {Order, OrderBookDisplayType, Side} from '../../';
import {mapToMarketEffectivePrice} from '../orderMapper';

describe('orderMapper', () => {
  describe('method mapToMarketEffectivePrice', () => {
    const orders: Order[] = [
      {
        connectedLimitOrders: [''],
        depth: 0.00016667,
        id: '970fcdd7-8483-4096-a1b3-69f0a7c23dc6',
        orderVolume: 0,
        price: 6148.874,
        side: Side.Buy,
        timestamp: undefined,
        volume: 1.2
      },
      {
        connectedLimitOrders: [''],
        depth: 0.00137778,
        id: 'ac983f4e-024a-40ab-bc29-319715ba8a7b',
        orderVolume: 0,
        price: 6143.658,
        side: Side.Buy,
        timestamp: undefined,
        volume: 0.5
      },
      {
        connectedLimitOrders: [''],
        depth: 0.00363334,
        id: '9f4cc3c8-18a7-4471-aeea-6a06a21a2074',
        orderVolume: 0,
        price: 6140.634,
        side: Side.Buy,
        timestamp: undefined,
        volume: 1.3
      }
    ].map((a: Partial<Order>) => Order.create(a));

    it('mapToMarketEffectivePrice should be defined', () => {
      expect(mapToMarketEffectivePrice).toBeDefined();
    });

    it('should map orders price to effective price, 2 levels', () => {
      const volume = 1.5;
      const displayType = OrderBookDisplayType.Volume;
      const price = 9221.7462;

      expect(mapToMarketEffectivePrice(volume, displayType, orders)).toBe(
        price
      );
    });

    it('should map orders price to effective price, 3 levels', () => {
      const volume = 3;
      const displayType = OrderBookDisplayType.Volume;
      const price = 18433.302;

      expect(mapToMarketEffectivePrice(volume, displayType, orders)).toBe(
        price
      );
    });

    it('should return undefined when requested amount over total orders volume', () => {
      const volume = 4;
      const displayType = OrderBookDisplayType.Volume;

      expect(
        mapToMarketEffectivePrice(volume, displayType, orders)
      ).toBeUndefined();
    });
  });
});
