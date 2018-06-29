import {Order} from '../';
import {mapToMarketEffectivePrice} from '../mappers/orderMapper';

describe('mappers', () => {
  const orders: Order[] = [
    {
      connectedLimitOrders: [],
      depth: 0.00016667,
      id: '970fcdd7-8483-4096-a1b3-69f0a7c23dc6',
      orderVolume: 0,
      price: 6148.874,
      side: 'Buy',
      timestamp: undefined,
      volume: 1.2
    },
    {
      connectedLimitOrders: [],
      depth: 0.00137778,
      id: 'ac983f4e-024a-40ab-bc29-319715ba8a7b',
      orderVolume: 0,
      price: 6143.658,
      side: 'Buy',
      timestamp: undefined,
      volume: 0.5
    },
    {
      connectedLimitOrders: [],
      depth: 0.00363334,
      id: '9f4cc3c8-18a7-4471-aeea-6a06a21a2074',
      orderVolume: 0,
      price: 6140.634,
      side: 'Buy',
      timestamp: undefined,
      volume: 1.3
    }
  ].map((a: any) => Order.create(a));

  let volume: number;
  let price: number;

  it('mapToMarketEffectivePrice should be defined', () => {
    expect(mapToMarketEffectivePrice).toBeDefined();
  });

  it('should map orders price to effective price, 2 levels', () => {
    volume = 1.5;
    price = Math.abs(
      orders[0].price * orders[0].volume +
        orders[1].price * (volume - orders[0].volume)
    );

    expect(mapToMarketEffectivePrice(volume, orders)).toBe(price);
  });

  it('should map orders price to effective price, 3 levels', () => {
    volume = 3;
    price = Math.abs(
      orders[0].price * orders[0].volume +
        orders[1].price * orders[1].volume +
        orders[2].price * orders[2].volume
    );

    expect(mapToMarketEffectivePrice(volume, orders)).toBe(price);
  });

  it('should return undefined when requested amount over total orders volume', () => {
    volume = 4;

    expect(mapToMarketEffectivePrice(volume, orders)).toBeUndefined();
  });
});
