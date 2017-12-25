import {AssetCategory, AssetModel} from '../../models/index';
import {AssetStore, RootStore} from '../index';

// tslint:disable:object-literal-sort-keys
describe('assetStore', () => {
  const api: any = {
    get: jest.fn()
  };
  let assetStore: AssetStore;

  beforeEach(() => {
    assetStore = new AssetStore(new RootStore(false), api);
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
        category: AssetCategory.Other(),
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

      expect(api.get).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/assets');
    });

    it('should map empty but valid response to assets', () => {
      jest.resetAllMocks();
      api.get = jest.fn(() => ({Assets: []}));

      assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets().length).toBe(0);
    });

    it('should map valid response to assets', async () => {
      jest.resetAllMocks();
      api.get = jest.fn(() => ({
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

      expect(api.get).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/assets/categories');
    });
  });

  describe('map from dto', () => {
    it('correctly maps from dto', async () => {
      const ctg = new AssetCategory({id: '1', name: 'Lykke'});
      const expectedAsset = new AssetModel({
        id: '1',
        name: 'LKK',
        accuracy: 2,
        category: ctg
      });
      jest.resetAllMocks();
      api.get = jest.fn(() => ({
        Assets: [
          {
            Id: '1',
            DisplayId: 'LKK',
            Accuracy: 2,
            CategoryId: '1',
            IsBase: false,
            IconUrl: ''
          }
        ],
        AssetCategories: [{Id: '1', Name: 'Lykke'}]
      }));

      await assetStore.fetchCategories();
      await assetStore.fetchAssets();

      expect(assetStore.getAssets()[0]).toEqual(expectedAsset);
    });
  });
});
