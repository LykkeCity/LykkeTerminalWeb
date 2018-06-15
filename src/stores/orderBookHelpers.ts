import {Big} from 'big.js';
import {multiply, sortBy, take} from 'rambda';
import {Order, Side} from '../models';

export const getNextIdx = (currIdx: number, list: number[]) =>
  Math.min(++currIdx, list.length);

export const getPrevIdx = (currIdx: number, list: number[]) =>
  Math.max(--currIdx, 0);

export const getMultiplier = (idx: number, list: number[]) =>
  take(idx + 1, list).reduce(multiply);

export const withSamePrice = (price: number) => (x: Order) => x.price === price;

export const priceBetween = (min: number, max: number) => (
  x: Pick<Order, 'price'>
) => x.price >= min && x.price < max;

export const closestPrice = (num: number, span: number, isAsk: boolean) => {
  const bigNum = new Big(num);
  const mod = bigNum.mod(span);
  const price = mod.eq(0)
    ? num
    : isAsk ? bigNum.plus(Big(span).minus(mod)) : bigNum.minus(mod);
  return Number(price);
};

export const groupOrdersByPrice = (orders: Order[]) => {
  sortBy(o => o.price, orders);

  let depth = 0;
  let idx = 0;
  const newOrders = [];

  while (idx < orders.length) {
    const newOrder = {...orders[idx]};
    depth += orders[idx].volume;
    while (idx < orders.length - 1 && newOrder.price === orders[++idx].price) {
      depth += orders[idx].volume;
      newOrder.volume += orders[idx].volume;
    }

    newOrder.depth = depth;
    newOrders.push(newOrder);
    if (idx === orders.length - 1) {
      const lastOrder = orders[idx];
      if (orders[idx - 1] && lastOrder.price !== orders[idx - 1].price) {
        lastOrder.depth = depth + lastOrder.volume;
        newOrders.push(lastOrder);
      }
      break;
    }
  }

  return newOrders;
};

export const aggregateOrders = (
  orders: Order[],
  span: number,
  isAsk: boolean
) => {
  if (span === 0) {
    return orders;
  }

  const newOrders = [];
  for (const order of orders) {
    const newOrder = {...order};
    newOrder.price = closestPrice(order.price, span, isAsk);
    newOrders.push(newOrder);
  }

  return groupOrdersByPrice(newOrders);
};

export const connectLimitOrders = (
  orders: Order[],
  limitOrders: any[],
  span: number,
  isAsk: boolean
) => {
  limitOrders.forEach(limitOrder => {
    if (limitOrder.side === (isAsk ? Side.Buy : Side.Sell)) {
      return;
    }
    orders.forEach((order, idx) => {
      if (order.price === closestPrice(limitOrder.price, span, isAsk)) {
        if (!order.connectedLimitOrders) {
          order.connectedLimitOrders = [];
        }
        order.orderVolume =
          (order.orderVolume || 0) + limitOrder.remainingVolume;
        order.connectedLimitOrders = order.connectedLimitOrders.concat(
          limitOrder.id
        );
      }
    });
  });
  return orders;
};

export const getSortedByPriceLevel = (levels: any, index: number) => {
  return levels.sort((a: any, b: any) => a.price - b.price)[index];
};

export const mapToOrder = (levels: any, side: Side) => {
  return levels.map((l: any) => {
    return {
      id: l.Id,
      price: l.Price,
      timestamp: l.DateTime,
      volume: l.Volume,
      depth: 0,
      side,
      orderVolume: 0,
      connectedLimitOrders: []
    };
  });
};
