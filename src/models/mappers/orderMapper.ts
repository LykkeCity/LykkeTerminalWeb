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

const getOrderExpendedAmount = (amount: number, order: Order) => {
  const orderAmount = order.volume * order.price;
  return amount >= orderAmount ? orderAmount : amount;
};

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
  let expendedAmount: number = 0;
  let totalOrdersAmount: number = 0;
  let totalOrdersVolume: number = 0;

  const ordersVolume = orders.reduce((maxVolume, order) => {
    totalOrdersAmount += order.price * order.volume;
    totalOrdersVolume += order.volume;

    if (expendedAmount >= amount) {
      return maxVolume;
    }

    const amountLeft = amount - expendedAmount;
    const orderExpendedAmount = getOrderExpendedAmount(amountLeft, order);
    expendedAmount += orderExpendedAmount;

    return maxVolume + orderExpendedAmount / order.price;
  }, 0);

  if (ordersVolume && expendedAmount < amount) {
    const averagePrice = totalOrdersAmount / totalOrdersVolume;
    return ordersVolume + (amount - expendedAmount) / averagePrice;
  }

  return ordersVolume;
};
