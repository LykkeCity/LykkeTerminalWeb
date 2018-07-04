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
  let price: number = 0;

  const volumeSum = orders.reduce((sum, order) => {
    const remain = volume - sum;

    if (sum < volume) {
      if (order.volume < remain) {
        price += order.volume * order.price;
        return sum + order.volume;
      } else {
        price = price + remain * order.price;
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
