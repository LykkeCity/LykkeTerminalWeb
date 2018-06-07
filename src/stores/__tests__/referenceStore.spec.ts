import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel
} from '../../models/index';
import {ReferenceStore, RootStore} from '../index';
import WatchlistStore from '../watchlistStore';

// tslint:disable:object-literal-sort-keys
describe('referenceStore', () => {
  const api: any = {
    fetchAll: jest.fn(),
    fetchAssetById: jest.fn(),
    fetchAssetCategories: jest.fn(),
    fetchAssetInstruments: jest.fn(),
    fetchAssetsDescriptions: jest.fn(),
    fetchAssetDescriptionById: jest.fn(),
    fetchBaseAsset: jest.fn()
  };
  let assetStore: ReferenceStore;

  beforeEach(() => {
    assetStore = new ReferenceStore(new RootStore(false), api);
  });

  describe('asset list', () => {
    it('should be defined', () => {
      expect(assetStore.getAssets()).toBeDefined();
      expect(assetStore.getAssets()).not.toBeNull();
    });

    it('should be empty after store instantiation', () => {
      expect(assetStore.getAssets().length).toBe(0);
    });
  });

  describe('categories list', () => {
    it('should be defined', () => {
      expect(assetStore.getCategories()).toBeDefined();
      expect(assetStore.getCategories()).not.toBeNull();
    });

    it('should be empty after store instantiation', () => {
      expect(assetStore.getCategories().length).toBe(0);
    });
  });

  describe('find asset by id', () => {
    it('should find and return known asset by id provided', () => {
      // arrange
      const newAsset = new AssetModel({
        id: '1',
        name: 'LKK',
        category: AssetCategoryModel.Other(),
        accuracy: 2
      });
      assetStore.fetchAssets = jest.fn(() => assetStore.addAsset(newAsset));

      // act
      assetStore.fetchAssets();

      // assert
      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets()).toContainEqual(newAsset);
      expect(assetStore.getAssetById('1')).toBe(newAsset);
    });
  });

  describe('fetch assets', () => {
    it('should call api get assets', () => {
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => Promise.resolve());

      assetStore.fetchAssets();

      expect(api.fetchAll).toHaveBeenCalled();
      expect(api.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should map empty but valid response to assets', () => {
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => Promise.resolve({Assets: []}));

      assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(0);
    });

    it('should map valid response to assets', async () => {
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() =>
        Promise.resolve({
          Assets: [
            {
              Id: '1',
              DisplayId: 'LKK',
              Accuracy: 4,
              CategoryId: 'ctg1'
            },
            {
              Id: '2',
              DisplayId: 'LKK2',
              Accuracy: 0,
              CategoryId: null
            }
          ]
        })
      );
      api.fetchAssetsDescriptions = jest.fn(() =>
        Promise.resolve({
          Descriptions: [
            {
              Id: '1',
              FullName: 'Lykke'
            },
            {
              Id: '2',
              FullName: 'Lykke 2'
            }
          ]
        })
      );

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(2);
    });
  });

  describe('fetch asset by id', () => {
    it('should call api get asset pairs', () => {
      jest.resetAllMocks();

      assetStore.fetchAssetById('1');

      expect(api.fetchAssetById).toHaveBeenCalled();
      expect(api.fetchAssetDescriptionById).toHaveBeenCalled();
      expect(api.fetchAssetById).toHaveBeenCalledTimes(1);
      expect(api.fetchAssetDescriptionById).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to asset', async () => {
      jest.resetAllMocks();
      api.fetchAssetById = jest.fn(() =>
        Promise.resolve({
          Asset: {
            Id: '1',
            DisplayId: 'LKK',
            Accuracy: 4,
            CategoryId: 'ctg1'
          }
        })
      );
      api.fetchAssetDescriptionById = jest.fn(() =>
        Promise.resolve({
          Id: '1',
          FullName: 'Lykke'
        })
      );

      await assetStore.fetchAssetById('1');

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(1);
    });
  });

  describe('fetch categories', () => {
    it('should call api get categories', () => {
      jest.resetAllMocks();
      api.fetchAssetCategories = jest.fn(() => Promise.resolve());

      assetStore.fetchCategories();

      expect(api.fetchAssetCategories).toHaveBeenCalled();
      expect(api.fetchAssetCategories).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to categories', async () => {
      jest.resetAllMocks();
      api.fetchAssetCategories = jest.fn(() =>
        Promise.resolve({
          AssetCategories: [{Id: '1', Name: 'Lykke'}]
        })
      );

      await assetStore.fetchCategories();

      expect(assetStore.getCategories()).not.toBeNull();
      expect(assetStore.getCategories().length).toBe(1);
      expect(assetStore.getCategories()[0]).toEqual(
        new AssetCategoryModel({id: '1', name: 'Lykke'})
      );
    });
  });

  describe('map asset from dto', () => {
    it('correctly maps from dto', async () => {
      const ctg = new AssetCategoryModel({id: '1', name: 'Lykke'});
      const expectedAsset = new AssetModel({
        id: '1',
        name: 'LKK',
        accuracy: 2,
        category: ctg,
        fullName: 'Lykke'
      });
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() =>
        Promise.resolve({
          Assets: [
            {
              Id: '1',
              DisplayId: 'LKK',
              Accuracy: 2,
              CategoryId: '1',
              CanBeBase: false,
              IconUrl: ''
            }
          ]
        })
      );
      api.fetchAssetsDescriptions = jest.fn(() =>
        Promise.resolve({
          Descriptions: [
            {
              Id: '1',
              FullName: 'Lykke'
            }
          ]
        })
      );

      api.fetchAssetCategories = jest.fn(() =>
        Promise.resolve({
          AssetCategories: [{Id: '1', Name: 'Lykke'}]
        })
      );

      await assetStore.fetchCategories();
      await assetStore.fetchAssets();

      expect(assetStore.getAssets()[0]).toEqual(expectedAsset);
    });

    it('should use Name if DisplayId is not provided', async () => {
      const name = 'LKK';
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() =>
        Promise.resolve({
          Assets: [
            {
              Id: '1',
              Name: name
            }
          ]
        })
      );
      api.fetchAssetsDescriptions = jest.fn(() =>
        Promise.resolve({
          Descriptions: [
            {
              Id: '1',
              FullName: 'Lykke'
            }
          ]
        })
      );

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()[0].name).toEqual(name);
    });
  });

  describe('fetch instruments', () => {
    it('should call api get asset pairs', () => {
      jest.resetAllMocks();

      assetStore.fetchInstruments();

      expect(api.fetchAssetInstruments).toHaveBeenCalled();
      expect(api.fetchAssetInstruments).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to instruments', async () => {
      jest.resetAllMocks();
      api.fetchAssetInstruments = jest.fn(() => ({
        AssetPairs: [
          {
            Id: 'BTCCHF',
            Accuracy: 3,
            BaseAssetId: 'BTC',
            IsDisabled: false,
            InvertedAccuracy: 8,
            Name: 'BTC/CHF',
            QuotingAssetId: 'CHF',
            Source: 'BTCUSD',
            Source2: 'USDCHF'
          }
        ]
      }));
      assetStore.fetchAssets = jest.fn(() => {
        assetStore.addAsset(new AssetModel({id: 'BTC'}));
        assetStore.addAsset(new AssetModel({id: 'CHF'}));
      });

      await assetStore.fetchAssets();
      await assetStore.fetchInstruments();

      expect(assetStore.getInstruments()).not.toBeNull();
      expect(assetStore.getInstruments().length).toBe(1);
      expect(assetStore.getInstruments()[0]).toEqual(
        new InstrumentModel({
          id: 'BTCCHF',
          name: 'BTC/CHF',
          accuracy: 3,
          invertedAccuracy: 8,
          baseAsset: expect.any(AssetModel),
          quoteAsset: expect.any(AssetModel)
        })
      );
    });
  });

  describe('map instrument from dto', () => {
    it('should not mess up base and quoting asset', async () => {
      jest.resetAllMocks();
      api.fetchAssetInstruments = jest.fn(() => ({
        AssetPairs: [
          {
            Id: 'BTCCHF',
            Accuracy: 3,
            BaseAssetId: 'BTC',
            IsDisabled: false,
            InvertedAccuracy: 8,
            Name: 'BTC/CHF',
            QuotingAssetId: 'CHF',
            Source: 'BTCUSD',
            Source2: 'USDCHF'
          }
        ]
      }));
      assetStore.fetchAssets = jest.fn(() => {
        assetStore.addAsset(new AssetModel({id: 'BTC'}));
        assetStore.addAsset(new AssetModel({id: 'CHF'}));
      });

      await assetStore.fetchAssets();
      await assetStore.fetchInstruments();

      expect(assetStore.getInstruments()[0].baseAsset.id).toBe('BTC');
      expect(assetStore.getInstruments()[0].baseAsset.id).not.toBe('CHF');
      expect(assetStore.getInstruments()[0].quoteAsset.id).toBe('CHF');
      expect(assetStore.getInstruments()[0].quoteAsset.id).not.toBe('BTC');
    });
  });

  describe('search for an instrument', () => {
    it('should find instruments', async () => {
      jest.resetAllMocks();
      const rootStore = new RootStore(false);
      const watchlistApi: any = {
        fetchAll: jest.fn()
      };
      watchlistApi.getWatchlistByName = jest.fn();
      rootStore.watchlistStore = new WatchlistStore(rootStore, watchlistApi);
      const refStore = new ReferenceStore(rootStore, api);
      refStore.addInstrument(
        new InstrumentModel({
          id: '1',
          name: 'BTC/CHF',
          baseAsset: {
            id: '1',
            name: 'BTC',
            accuracy: 2,
            category: expect.any(AssetCategoryModel),
            fullName: 'Bitcoin'
          },
          quoteAsset: {
            id: '2',
            name: 'CHF',
            accuracy: 2,
            category: expect.any(AssetCategoryModel),
            fullName: 'Swiss Franc'
          },
          accuracy: 3,
          invertedAccuracy: 8,
          price: 1000,
          bid: 1,
          ask: 1,
          volumeInBase: 0,
          change24h: 0,
          volume: 0
        })
      );

      expect(refStore.findInstruments('BTC', '').length).not.toEqual(0);
      expect(refStore.findInstruments('Bitcoin', '').length).not.toEqual(0);
      expect(refStore.findInstruments('Swiss Franc', '').length).toEqual(0);
      expect(refStore.findInstruments('Randomness', '').length).toEqual(0);
    });
  });
});
