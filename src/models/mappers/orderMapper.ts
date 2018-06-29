import {Order, OrderBookDisplayType, Side} from '..';

export const toOrder = (dto: any, side: Side = Side.Buy) =>
  Order.create({
    id: dto.Id,
    price: dto.Price,
    timestamp: dto.DateTime,
    volume: dto.Volume,
    depth: 0,
    side,
    orderVolume: 0,
    connectedLimitOrders: []
  });

export const mapToMarketEffectivePrice = (
  volume: number,
  displayType: OrderBookDisplayType,
  orders: Order[]
) => {
  let price: number = 0;
  const type = displayType.toLowerCase();

  const volumeSum = orders.reduce((sum, order) => {
    if (sum < volume) {
      if (order[type] < volume - sum) {
        price += order[type] * order.price;
        return sum + order[type];
      } else {
        price = price + (volume - sum) * order.price;
        return volume;
      }
    } else {
      return sum;
    }
  }, 0);

  if (volumeSum < volume) {
    return undefined;
  }

  return price;
};
