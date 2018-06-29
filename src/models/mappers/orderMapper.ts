import {Order, Side} from '..';

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

export const mapToMarketEffectivePrice = (volume: number, orders: Order[]) => {
  let price: number = 0;

  const volumeSum = orders.reduce((sum, order) => {
    if (sum < volume) {
      if (order.volume < volume - sum) {
        price += order.volume * order.price;
        return sum + order.volume;
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
