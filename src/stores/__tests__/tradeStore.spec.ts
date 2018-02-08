import {RootStore, TradeStore} from '../index';

// tslint:disable:object-literal-sort-keys

describe('trade store', () => {
  let tradeStore: TradeStore;
  const api: any = {
    fetchPublicTrade: jest.fn(),
    fetchUserTrade: jest.fn()
  };

  beforeEach(() => {
    api.fetchUserTrades = jest.fn(() =>
      Promise.resolve([
        {
          Id: '201802081814_8c8b3211-855d-4cdb-b242-68fce3b0c14e',
          DateTime: '2018-02-08T18:14:25.637Z',
          Type: 'Trade',
          State: 'Finished',
          Amount: 0.0001,
          Asset: 'BTC',
          AssetPair: null,
          Price: null
        },
        {
          Id: '201802081814_5037f2da-71d6-4bd5-a633-45432de1ee2e',
          DateTime: '2018-02-08T18:14:25.637Z',
          Type: 'Trade',
          State: 'Finished',
          Amount: -0.85,
          Asset: 'USD',
          AssetPair: null,
          Price: null
        }
      ])
    );
    api.fetchPublicTrades = api.fetchUserTrades;

    tradeStore = new TradeStore(new RootStore(false), api);
  });

  describe('state', () => {
    it('trades should be defined after instantiation', () => {
      expect(tradeStore.getAllTrades).toBeDefined();
      expect(tradeStore.getAllTrades).not.toBeNull();
    });

    it('public trades should be defined after instantiation', () => {
      expect(tradeStore.getPublicTrades).toBeDefined();
      expect(tradeStore.getPublicTrades).not.toBeNull();
    });

    it('trades should be an empty array by default', () => {
      expect(tradeStore.getAllTrades instanceof Array).toBeTruthy();
      expect(tradeStore.getAllTrades.length).toBe(0);
    });

    it('public trades should be an empty array by default', () => {
      expect(tradeStore.getPublicTrades instanceof Array).toBeTruthy();
      expect(tradeStore.getPublicTrades.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear trades', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.getAllTrades.length).toBeGreaterThan(0);
      expect(tradeStore.getPublicTrades.length).toBeGreaterThan(0);

      tradeStore.reset();

      expect(tradeStore.getAllTrades.length).toBe(0);
      expect(tradeStore.getPublicTrades.length).toBe(0);
    });
  });

  describe('fetch trades', () => {
    it('should populate tradeList collection', async () => {
      await tradeStore.fetchAll();
      expect(tradeStore.getAllTrades.length).toBeGreaterThan(0);
      expect(tradeStore.getPublicTrades.length).toBeGreaterThan(0);
    });
  });

  describe('trade item', () => {
    it('should contain the following fields', async () => {
      await tradeStore.fetchAll();
      const trade = tradeStore.getAllTrades[0];
      expect(trade.side).toBeDefined();
      expect(trade.symbol).toBeDefined();
      expect(trade.quantity).toBeDefined();
      expect(trade.timestamp).toBeDefined();
    });
  });

  describe('add public trade', () => {
    it('should add to public trades collection', () => {
      tradeStore.addPublicTrades([
        {
          asset: '',
          symbol: 'LKKUSD',
          quantity: 1,
          timestamp: Date.now().toString(),
          // tslint:disable-next-line:object-literal-sort-keys
          side: 'Buy',
          tradeId: 't1',
          id: '1',
          price: 1
        }
      ]);
      expect(tradeStore.getPublicTrades).toHaveLength(1);
      expect(tradeStore.getAllTrades).toHaveLength(0);
    });
  });
});
