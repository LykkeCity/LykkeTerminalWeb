import {multiply, sortBy, take} from 'rambda';
import {Order} from '../models';

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

export const floorInt = (num: number, span: number, isAsk: boolean) =>
  num % span > 0 ? (isAsk ? num + (span - num % span) : num - num % span) : num;

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
      if (lastOrder.price !== orders[idx - 1].price) {
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
    newOrder.price = floorInt(order.price, span, isAsk);
    newOrders.push(newOrder);
  }
  return groupOrdersByPrice(newOrders);
};
