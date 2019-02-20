import {
  AssetModel,
  DepthArea,
  InstrumentModel,
  Order,
  Side
} from '../../models';
import {
  DEFAULT_DEPTH_CHART_HEIGHT,
  DEFAULT_DEPTH_CHART_WIDTH,
  DEFAULT_SPAN_MULTIPLIER_IDX,
  MULTIPLERS
} from '../depthChartStore';
import {DepthChartStore, RootStore} from '../index';

describe('depth chart store', () => {
  let depthChartStore: DepthChartStore;

  beforeEach(() => {
    depthChartStore = new DepthChartStore(new RootStore());
  });

  describe('default values', () => {
    it('for width', () => {
      expect(depthChartStore.width).toBe(DEFAULT_DEPTH_CHART_WIDTH);
    });

    it('for height', () => {
      expect(depthChartStore.height).toBe(DEFAULT_DEPTH_CHART_HEIGHT);
    });

    it('for multipliers', () => {
      depthChartStore.multiplers.forEach(
        (multiplier: number, index: number) => {
          expect(multiplier).toBe(MULTIPLERS[index]);
        }
      );
    });

    it('for span multiplier id', () => {
      expect(depthChartStore.spanMultiplierIdx).toBe(
        DEFAULT_SPAN_MULTIPLIER_IDX
      );
    });
  });

  describe('span', () => {
    it('should return value for current span index', () => {
      expect(depthChartStore.span).toBe(
        MULTIPLERS[DEFAULT_SPAN_MULTIPLIER_IDX] * 100
      );
    });

    it('should return 0 as a value of seedSpan if instrument is not selected', () => {
      expect(depthChartStore.seedSpan).toBe(0);
    });

    it('should calculate value of seedSpan', () => {
      depthChartStore.rootStore.uiStore.selectedInstrument = new InstrumentModel(
        {
          baseAsset: new AssetModel({name: 'BTC'}),
          id: 'BTCUSD',
          quoteAsset: new AssetModel({name: 'USD'}),
          accuracy: 2
        }
      );
      expect(depthChartStore.seedSpan).toBe(0.01);
    });

    it('should return 0 as a value of instrumentSpan if instrument is not selected', () => {
      expect(depthChartStore.seedSpan).toBe(0);
    });

    it('should calculate value of instrumentSpan', () => {
      depthChartStore.rootStore.uiStore.selectedInstrument = new InstrumentModel(
        {
          baseAsset: new AssetModel({name: 'BTC'}),
          id: 'BTCUSD',
          quoteAsset: new AssetModel({name: 'USD'}),
          accuracy: 2
        }
      );
      expect(depthChartStore.seedSpan).toBe(0.01);
    });
  });

  describe('sizes', () => {
    it('should change width', () => {
      const newWidth = 100;
      depthChartStore.setWidth(newWidth);
      expect(depthChartStore.width).toBe(newWidth);
    });

    it('should change height', () => {
      const newHeight = 100;
      depthChartStore.setHeight(newHeight);
      expect(depthChartStore.height).toBe(newHeight);
    });
  });

  describe('multipliers', () => {
    it('should increase span multiplier id', () => {
      depthChartStore.nextSpan();
      expect(depthChartStore.spanMultiplierIdx).toBe(4);
    });

    it('should decrease span multiplier id', () => {
      depthChartStore.prevSpan();
      expect(depthChartStore.spanMultiplierIdx).toBe(2);
    });

    it('should return true if multiplier is max', () => {
      depthChartStore.spanMultiplierIdx = depthChartStore.multiplers.length - 1;
      expect(depthChartStore.isMaxZoom).toBeTruthy();
    });

    it('should return false if multiplier is not max', () => {
      expect(depthChartStore.isMaxZoom).toBeFalsy();
    });

    it('should return true if multiplier is min', () => {
      depthChartStore.spanMultiplierIdx = 1;
      expect(depthChartStore.isMinZoom).toBeTruthy();
    });

    it('should return false if multiplier is not min', () => {
      expect(depthChartStore.isMinZoom).toBeFalsy();
    });
  });

  describe('orders', () => {
    let bids: Order[];
    let asks: Order[];

    beforeEach(() => {
      bids = [];
      asks = [];
      bids.push(
        Order.create({
          id: '1',
          volume: 100,
          price: 100,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 2,
          orderVolume: 100
        }),
        Order.create({
          id: '2',
          volume: 200,
          price: 150,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 4,
          orderVolume: 200
        }),
        Order.create({
          id: '3',
          volume: 300,
          price: 170,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 6,
          orderVolume: 300
        })
      );
      asks.push(
        Order.create({
          id: '1',
          volume: 100,
          price: 100,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 2,
          orderVolume: 100
        }),
        Order.create({
          id: '2',
          volume: 200,
          price: 150,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 4,
          orderVolume: 200
        }),
        Order.create({
          id: '3',
          volume: 300,
          price: 170,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 6,
          orderVolume: 300
        })
      );
    });

    it('should update bids', () => {
      depthChartStore.updateBids(bids);
      depthChartStore.bids.forEach((bid: Order, index: number) => {
        expect(bid.orderVolume).toBe(bids[index].orderVolume);
        expect(bid.depth).toBe(bids[index].depth);
        expect(bid.side).toBe(bids[index].side);
        expect(bid.timestamp).toBe(bids[index].timestamp);
        expect(bid.volume).toBe(bids[index].volume);
        expect(bid.price).toBe(bids[index].price);
      });
    });

    it('should update asks', () => {
      depthChartStore.updateAsks(asks);
      depthChartStore.asks.forEach((ask: Order, index: number) => {
        expect(ask.orderVolume).toBe(asks[index].orderVolume);
        expect(ask.depth).toBe(asks[index].depth);
        expect(ask.side).toBe(asks[index].side);
        expect(ask.timestamp).toBe(asks[index].timestamp);
        expect(ask.volume).toBe(asks[index].volume);
        expect(ask.price).toBe(asks[index].price);
      });
    });

    it('should find bid in the reverse array by index', () => {
      depthChartStore.updateBids(bids);

      const index = 0;
      const bid = depthChartStore.findBid(index);

      expect(bid.orderVolume).toBe(bids[bids.length - 1].orderVolume);
      expect(bid.depth).toBe(bids[bids.length - 1].depth);
      expect(bid.side).toBe(bids[bids.length - 1].side);
      expect(bid.timestamp).toBe(bids[bids.length - 1].timestamp);
      expect(bid.volume).toBe(bids[bids.length - 1].volume);
      expect(bid.price).toBe(bids[bids.length - 1].price);
    });

    it('should find ask by index', () => {
      depthChartStore.updateAsks(asks);

      const index = 1;
      const ask = depthChartStore.findAsk(index);

      expect(ask.orderVolume).toBe(asks[index - 1].orderVolume);
      expect(ask.depth).toBe(asks[index - 1].depth);
      expect(ask.side).toBe(asks[index - 1].side);
      expect(ask.timestamp).toBe(asks[index - 1].timestamp);
      expect(ask.volume).toBe(asks[index - 1].volume);
      expect(ask.price).toBe(asks[index - 1].price);
    });

    it('should return max depth', () => {
      depthChartStore.updateAsks(asks);
      depthChartStore.updateBids(bids);

      expect(depthChartStore.getMinMaxDepth(Math.max)).toBe(6);
    });

    it('should return min depth', () => {
      depthChartStore.updateAsks(asks);
      depthChartStore.updateBids(bids);

      expect(depthChartStore.getMinMaxDepth(Math.min)).toBe(2);
    });

    it('should reduce bids', () => {
      depthChartStore.spanMultiplierIdx = 5;
      expect(depthChartStore.reduceBidsArray(bids).length).toBe(1);
    });

    it('should reduce asks', () => {
      depthChartStore.spanMultiplierIdx = 3;
      expect(depthChartStore.reduceAsksArray(asks).length).toBe(1);
    });

    describe('labels', () => {
      beforeEach(() => {
        depthChartStore.rootStore.uiStore.selectedInstrument = new InstrumentModel(
          {
            baseAsset: new AssetModel({name: 'BTC'}),
            id: 'BTCUSD',
            quoteAsset: new AssetModel({name: 'USD'}),
            accuracy: 2
          }
        );
      });

      it('should return array with empty strings of ask labels', () => {
        depthChartStore.asksLabels.forEach((label: string) => {
          expect(label).toBe('');
        });
      });

      it('should return array with empty strings of bid labels', () => {
        depthChartStore.bidsLabels.forEach((label: string) => {
          expect(label).toBe('');
        });
      });

      it('should return array of ask labels', () => {
        depthChartStore.updateAsks(asks);
        const labels = depthChartStore.asksLabels;
        expect(labels[0]).toBe('100.00');
        expect(labels[1]).toBe('100.00');
        expect(labels[2]).toBe('100.00');
        expect(labels[3]).toBe('100.00');
      });

      it('should return array of bid labels', () => {
        depthChartStore.updateBids(bids);
        const labels = depthChartStore.bidsLabels;
        expect(labels[0]).toBe('108.75');
        expect(labels[1]).toBe('126.25');
        expect(labels[2]).toBe('143.75');
        expect(labels[3]).toBe('161.25');
      });

      it('should return empty array for depth label', () => {
        expect(depthChartStore.depthLabels.length).toBe(0);
      });
    });
  });

  describe('prices', () => {
    it('should return mid price', async () => {
      const mid = 500;
      depthChartStore.rootStore.orderBookStore.mid = jest.fn(() =>
        Promise.resolve(mid)
      );
      const result = await depthChartStore.mid();
      expect(result).toBe(mid);
    });

    it('should return spread', async () => {
      depthChartStore.rootStore.orderBookStore.getBestAsk = jest.fn(() =>
        Promise.resolve(1000)
      );
      depthChartStore.rootStore.orderBookStore.getBestBid = jest.fn(() =>
        Promise.resolve(500)
      );
      const spread = await depthChartStore.spread();
      expect(spread).toBe(50);
    });

    describe('exact price', () => {
      const bids: Order[] = [];
      const asks: Order[] = [];

      beforeEach(() => {
        bids.push(
          Order.create({
            id: '1',
            volume: 100,
            price: 100,
            timestamp: new Date(),
            side: Side.Buy,
            depth: 2,
            orderVolume: 100
          }),
          Order.create({
            id: '2',
            volume: 200,
            price: 200,
            timestamp: new Date(),
            side: Side.Buy,
            depth: 4,
            orderVolume: 200
          }),
          Order.create({
            id: '3',
            volume: 300,
            price: 300,
            timestamp: new Date(),
            side: Side.Buy,
            depth: 4,
            orderVolume: 300
          })
        );
        asks.push(
          Order.create({
            id: '1',
            volume: 100,
            price: 100,
            timestamp: new Date(),
            side: Side.Sell,
            depth: 2,
            orderVolume: 100
          }),
          Order.create({
            id: '2',
            volume: 200,
            price: 200,
            timestamp: new Date(),
            side: Side.Sell,
            depth: 4,
            orderVolume: 200
          }),
          Order.create({
            id: '3',
            volume: 300,
            price: 300,
            timestamp: new Date(),
            side: Side.Sell,
            depth: 4,
            orderVolume: 300
          })
        );
        depthChartStore.updateBids(bids);
        depthChartStore.updateAsks(asks);
      });

      it('should calculate exact bid price', () => {
        const index = 0;
        expect(depthChartStore.calculateExactBidPrice(index)).toBe(130000);
      });

      it('should calculate exact ask price', () => {
        const index = 2;
        expect(depthChartStore.calculateExactAskPrice(index)).toBe(20000);
      });
    });
  });

  describe('drawing math', () => {
    const bids: Order[] = [];
    const asks: Order[] = [];

    beforeEach(() => {
      bids.push(
        Order.create({
          id: '1',
          volume: 100,
          price: 100,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 2,
          orderVolume: 100
        }),
        Order.create({
          id: '2',
          volume: 200,
          price: 150,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 4,
          orderVolume: 200
        }),
        Order.create({
          id: '3',
          volume: 300,
          price: 170,
          timestamp: new Date(),
          side: Side.Buy,
          depth: 4,
          orderVolume: 300
        })
      );
      asks.push(
        Order.create({
          id: '1',
          volume: 100,
          price: 100,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 2,
          orderVolume: 100
        }),
        Order.create({
          id: '2',
          volume: 200,
          price: 150,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 4,
          orderVolume: 200
        }),
        Order.create({
          id: '3',
          volume: 300,
          price: 170,
          timestamp: new Date(),
          side: Side.Sell,
          depth: 4,
          orderVolume: 300
        })
      );
      depthChartStore.updateBids(bids);
      depthChartStore.updateAsks(asks);
      depthChartStore.spanMultiplierIdx = 1;
    });

    it('should calculate y interval', () => {
      const coefficient = 1;
      const depth = 2;
      expect(depthChartStore.calculateOrderYInterval(coefficient)(depth)).toBe(
        2
      );
    });

    it('should calculate x interval for bid area', () => {
      const width = 100;
      const index = 1;
      expect(
        depthChartStore.calculateOrderXInterval(width, DepthArea.Bid)(index)
      ).toBe(0);
    });

    it('should calculate x interval for ask area', () => {
      const width = 100;
      const index = 2;
      expect(
        depthChartStore.calculateOrderXInterval(width, DepthArea.Ask)(index)
      ).toBe(0);
    });

    it('should return difference between max bid price and price of next bid after current bid', () => {
      const index = 0;
      expect(depthChartStore.getBidPriceDifference(index)).toBe(20);
    });

    it('should return difference between min ask price and price of next ask after current ask', () => {
      const index = 0;
      expect(depthChartStore.getAskPriceDifference(index)).toBe(50);
    });

    it('should return min ask price', () => {
      expect(depthChartStore.getMinAskPrice()).toBe(100);
    });

    it('should return max ask price', () => {
      expect(depthChartStore.getMaxAskPrice()).toBe(170);
    });

    it('should calculate mid x for bids', () => {
      expect(depthChartStore.getMidXBids()).toBe(486);
    });

    it('should calculate mid x for asks', () => {
      expect(depthChartStore.getMidXAsks()).toBe(488);
    });

    it('should calculate ask width', () => {
      expect(depthChartStore.getAskWidth()).toBe(486);
    });

    it('should return coefficient', () => {
      expect(depthChartStore.getCoefficient()).toBe(109.575);
    });
  });

  it('should reset store', () => {
    depthChartStore.spanMultiplierIdx = 3;
    depthChartStore.reset();
    expect(depthChartStore.spanMultiplierIdx).toBe(1);
  });
});
