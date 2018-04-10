import {MarketStore, RootStore} from '../';
import {AssetModel, InstrumentModel} from '../../models/index';

describe('market service', () => {
  let marketStore: MarketStore;

  const instruments = [
    new InstrumentModel({
      id: 'BTCUSD',
      baseAsset: new AssetModel({id: 'BTC'}),
      quoteAsset: new AssetModel({id: 'USD'}),
      price: 9500
    }),
    new InstrumentModel({
      id: 'USDRUB',
      baseAsset: new AssetModel({id: 'USD'}),
      quoteAsset: new AssetModel({id: 'RUB'}),
      price: 55
    }),
    new InstrumentModel({
      id: 'LKKUSD',
      baseAsset: new AssetModel({id: 'LKK'}),
      quoteAsset: new AssetModel({id: 'USD'}),
      price: 0.05
    })
  ];

  const assets = [
    new AssetModel({id: 'BTC'}),
    new AssetModel({id: 'USD'}),
    new AssetModel({id: 'RUB'}),
    new AssetModel({id: 'LKK'}),
    new AssetModel({id: 'TEST'})
  ];

  const find = (id: string) => instruments.find(x => x.id === id)!;

  beforeEach(() => {
    marketStore = new MarketStore(new RootStore(false));
    marketStore.init(instruments, assets);
  });

  describe('convert', () => {
    it('should return initial amount if no conversion needed', async () => {
      const result = marketStore.convert(1, 'BTC', 'BTC', find);
      expect(result).toBe(1);
    });

    it('should return zero if conversion cannot be executed (asset does not exist)', async () => {
      const result = marketStore.convert(1, 'BTC', 'FOO', find);
      expect(result).toBe(0);

      const result2 = marketStore.convert(1, 'FOO', 'BTC', find);
      expect(result2).toBe(0);
    });

    it('should return zero if conversion cannot be executed (no pair for conversion)', async () => {
      const result = marketStore.convert(1, 'BTC', 'TEST', find);
      expect(result).toBe(0);

      const result2 = marketStore.convert(1, 'TEST', 'BTC', find);
      expect(result2).toBe(0);
    });

    it('should be converted', async () => {
      const resultBtcUsd = marketStore.convert(1, 'BTC', 'USD', find);
      expect(resultBtcUsd).toBe(9500);

      const resultBtcRub = marketStore.convert(1.5, 'BTC', 'RUB', find);
      expect(resultBtcRub).toBe(1.5 * 9500 * 55);

      const resultLkkBtc = marketStore.convert(20000, 'LKK', 'BTC', find);
      expect(resultLkkBtc).toBe(20000 * 0.05 * (1 / 9500));

      const resultRubLkk = marketStore.convert(10000, 'RUB', 'LKK', find);
      expect(resultRubLkk).toBe(10000 * (1 / 55) * (1 / 0.05));
    });
  });
});
