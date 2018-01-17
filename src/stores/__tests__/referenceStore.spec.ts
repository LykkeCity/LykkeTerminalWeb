import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel
} from '../../models/index';
import {ReferenceStore, RootStore} from '../index';

// tslint:disable:object-literal-sort-keys
describe('referenceStore', () => {
  const api: any = {
    fetchAll: jest.fn(),
    fetchAssetCategories: jest.fn(),
    fetchAssetInstruments: jest.fn(),
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

      assetStore.fetchAssets();

      expect(api.fetchAll).toHaveBeenCalled();
      expect(api.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should map empty but valid response to assets', () => {
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => ({Assets: []}));

      assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(0);
    });

    it('should map valid response to assets', async () => {
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => ({
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
      }));

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(2);
    });
  });

  describe('fetch categories', () => {
    it('should call api get categories', () => {
      jest.resetAllMocks();

      assetStore.fetchCategories();

      expect(api.fetchAssetCategories).toHaveBeenCalled();
      expect(api.fetchAssetCategories).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to categories', async () => {
      jest.resetAllMocks();
      api.fetchAssetCategories = jest.fn(() => ({
        AssetCategories: [{Id: '1', Name: 'Lykke'}]
      }));

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
        category: ctg
      });
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => ({
        Assets: [
          {
            Id: '1',
            DisplayId: 'LKK',
            Accuracy: 2,
            CategoryId: '1',
            IsBase: false,
            IconUrl: ''
          }
        ]
      }));
      api.fetchAssetCategories = jest.fn(() => ({
        AssetCategories: [{Id: '1', Name: 'Lykke'}]
      }));

      await assetStore.fetchCategories();
      await assetStore.fetchAssets();

      expect(assetStore.getAssets()[0]).toEqual(expectedAsset);
    });

    it('should use Name if DisplayId is not provided', async () => {
      const name = 'LKK';
      jest.resetAllMocks();
      api.fetchAll = jest.fn(() => ({
        Assets: [
          {
            Id: '1',
            Name: name
          }
        ]
      }));

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
          quotingAsset: expect.any(AssetModel)
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
      expect(assetStore.getInstruments()[0].quotingAsset.id).toBe('CHF');
      expect(assetStore.getInstruments()[0].quotingAsset.id).not.toBe('BTC');
    });
  });
});
