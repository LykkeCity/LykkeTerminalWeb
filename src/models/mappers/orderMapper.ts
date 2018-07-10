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

const getValueForAvailableVolume = (order: Order) => order.price * order.volume;

const getAvailableVolume = (amount: number, order: Order) =>
  amount * order.volume / order.price;

export const mapToEffectivePrice = (volume: number, orders: Order[]) => {
  let effectivePrice: number = 0;

  const availableVolume = orders.reduce((sum, order) => {
    if (sum > volume) {
      return sum;
    }

    const remainingVolume = volume - sum;
    if (order.volume < remainingVolume) {
      effectivePrice += order.volume * order.price;
      return sum + order.volume;
    } else {
      effectivePrice = effectivePrice + remainingVolume * order.price;
      return volume;
    }
  }, 0);

  if (availableVolume < volume) {
    return null;
  }

  return effectivePrice;
};

export const getMaxAvailableVolume = (amount: number, orders: Order[]) => {
  let expendedPrice: number = 0;

  return orders.reduce((maxVolume, order) => {
    if (expendedPrice >= amount) {
      return maxVolume;
    }

    const amountLeft = amount - expendedPrice;
    const valueForAvailableVolume = getValueForAvailableVolume(order);
    const isValueAvailable = valueForAvailableVolume < amountLeft;
    if (isValueAvailable) {
      expendedPrice += valueForAvailableVolume;
      return maxVolume + order.volume;
    }

    expendedPrice = amount;
    return maxVolume + getAvailableVolume(amountLeft, order);
  }, 0);
};
