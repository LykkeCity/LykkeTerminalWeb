import {OrderBookStore, RootStore} from '../index';

describe('orderBook store', () => {
  const {
    onUpdate,
    bestBid,
    bestAsk,
    mid,
    bestBids,
    bestAsks
  } = new OrderBookStore(new RootStore(false));

  beforeEach(() => {
    // bids
    onUpdate([
      {
        IsBuy: true,
        Prices: [{Price: 1}, {Price: 2}, {Price: 3}]
      }
    ]);
    // asks
    onUpdate([
      {
        IsBuy: false,
        Prices: [{Price: 5}, {Price: 6}, {Price: 7}]
      }
    ]);
  });

  test('best bid should have highest price', () => {
    expect(bestBid()).toBe(3);
  });

  test('best ask should have lowest price', () => {
    expect(bestAsk()).toBe(5);
  });

  test('mid should be as an average between bestBid and bestAsk', () => {
    expect(mid()).toBe(4);
  });

  test('best bids should return N best bids', () => {
    const bids = bestBids(2);
    expect(bids).toHaveLength(2);
    expect(bids.map(x => x.price)).toEqual([3, 2]);
    expect(bids.map(x => x.price)[0]).toEqual(bestBid());
  });

  test('best asks should return N best asks', () => {
    const asks = bestAsks(2);
    expect(asks).toHaveLength(2);
    expect(asks.map(x => x.price)).toEqual([6, 5]);
    expect(asks.map(x => x.price)[asks.length - 1]).toEqual(bestAsk());
  });

  test('best asks should be sorted by price descending', () => {
    const asks = bestAsks(2).map(o => o.price);
    expect(asks[0]).toBeGreaterThan(asks[asks.length - 1]);
  });

  test('best bids should be sorted by price descending', () => {
    const bids = bestBids(2).map(o => o.price);
    expect(bids[0]).toBeGreaterThan(bids[bids.length - 1]);
  });

  test('best bid should be less that best bid', () => {
    expect(bestBid()).toBeLessThan(bestAsk());
  });
});
