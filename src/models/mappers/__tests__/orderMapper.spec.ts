import {Order, Side} from '../..';
import {
  getMaxAvailableVolume,
  mapToEffectivePrice,
  toOrder
} from '../orderMapper';

describe('orderMapper', () => {
  describe('method mapToEffectivePrice', () => {
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

    it('mapToEffectivePrice should be defined', () => {
      expect(mapToEffectivePrice).toBeDefined();
    });

    it('should map orders price to effective price, 2 levels', () => {
      const volume = 1.5;
      const price = 9221.7462;

      expect(mapToEffectivePrice(volume, orders)).toBe(price);
    });

    it('should map orders price to effective price, 3 levels', () => {
      const volume = 3;
      const price = 18433.302;

      expect(mapToEffectivePrice(volume, orders)).toBe(price);
    });

    it('should return undefined when requested amount over total orders volume', () => {
      const volume = 4;

      expect(mapToEffectivePrice(volume, orders)).toBe(null);
    });
  });

  describe('method toOrder', () => {
    it('should return mapped object', () => {
      const rawObject = {
        Id: '1',
        Price: 1000,
        DateTime: Date.now(),
        Volume: 1
      };
      const mappedObjectWithDefaultSide = toOrder(rawObject);
      expect(mappedObjectWithDefaultSide.id).toEqual(rawObject.Id);
      expect(mappedObjectWithDefaultSide.price).toEqual(rawObject.Price);
      expect(mappedObjectWithDefaultSide.timestamp).toEqual(rawObject.DateTime);
      expect(mappedObjectWithDefaultSide.volume).toEqual(rawObject.Volume);
      expect(mappedObjectWithDefaultSide.depth).toEqual(0);
      expect(mappedObjectWithDefaultSide.side).toEqual(Side.Buy);
      expect(mappedObjectWithDefaultSide.orderVolume).toEqual(0);
      expect(mappedObjectWithDefaultSide.connectedLimitOrders).toBeInstanceOf(
        Array
      );
      expect(mappedObjectWithDefaultSide.connectedLimitOrders).toHaveLength(0);

      const mappedObjectWithSide = toOrder(rawObject, Side.Sell);
      expect(mappedObjectWithSide.side).toEqual(Side.Sell);
    });
  });

  describe('method getMaxAvailableVolume', () => {
    it('should return 0 is no orders available', () => {
      const maxVolume = getMaxAvailableVolume(4000, []);
      expect(maxVolume).toBe(0);
    });

    it('should return max available volume for passed price with test orders for volume', () => {
      const orders = [
        Order.create({price: 8000, volume: 0.5}),
        Order.create({price: 10000, volume: 1}),
        Order.create({price: 12000, volume: 0.5})
      ];

      let maxVolume = getMaxAvailableVolume(4000, orders);
      expect(maxVolume).toBe(0.5);

      maxVolume = getMaxAvailableVolume(10000, orders);
      expect(maxVolume).toBe(1.1);

      maxVolume = getMaxAvailableVolume(30000, orders);
      expect(maxVolume).toBe(3);
    });

    it('should return max available volume for passed price with real orders', () => {
      const orders = [
        Order.create({price: 6044.23, volume: 0.05}),
        Order.create({price: 6045.985, volume: 0.125}),
        Order.create({price: 6047.25, volume: 0.2}),
        Order.create({price: 6048.293, volume: 0.275}),
        Order.create({price: 6049.201, volume: 0.35}),
        Order.create({price: 6054.945, volume: 0.00000166}),
        Order.create({price: 6109.89, volume: 1.00016354}),
        Order.create({price: 6217.642, volume: 0.01}),
        Order.create({price: 8000, volume: 0.17706688}),
        Order.create({price: 9000, volume: 5.09697945})
      ];

      const convertVolumeToString = (volume: number) => volume.toFixed(8);

      let maxVolume = getMaxAvailableVolume(98828.14, orders);
      expect(convertVolumeToString(maxVolume)).toBe('12.09680740');

      maxVolume = getMaxAvailableVolume(2500, orders);
      expect(convertVolumeToString(maxVolume)).toBe('0.41345554');

      maxVolume = getMaxAvailableVolume(1000, orders);
      expect(convertVolumeToString(maxVolume)).toBe('0.16541353');

      maxVolume = getMaxAvailableVolume(200, orders);
      expect(convertVolumeToString(maxVolume)).toBe('0.03308941');

      maxVolume = getMaxAvailableVolume(10, orders);
      expect(convertVolumeToString(maxVolume)).toBe('0.00165447');
    });
  });
});
