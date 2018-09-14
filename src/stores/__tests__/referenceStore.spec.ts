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
    fetchAssetInstruments: jest.fn(),
    fetchAssetsDescriptions: jest.fn(),
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
      expect(assetStore.getAssets()).toHaveLength(0);
    });
  });

  describe('findAppropriateDescriptionById method', () => {
    it('should find description by id', () => {
      const idToFind = '1';
      const descriptionToFind = {
        Id: idToFind,
        AssetClass: '',
        Description: '',
        IssuerName: '',
        NumberOfCoins: '',
        AssetDescriptionUrl: '',
        FullName: 'Lykke'
      };

      const foundDescription = assetStore.findAppropriateDescriptionById(
        [descriptionToFind],
        idToFind
      );

      expect(foundDescription).toBeDefined();
    });
  });

  describe('fetch assets', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call api to get assets & descriptions', async () => {
      api.fetchAll = jest.fn(() => Promise.resolve({Assets: []}));
      api.fetchAssetsDescriptions = jest.fn(() =>
        Promise.resolve({Descriptions: []})
      );

      await assetStore.fetchAssets();

      expect(api.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to assets', async () => {
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
              AssetClass: '',
              Description: '',
              IssuerName: '',
              NumberOfCoins: '',
              AssetDescriptionUrl: '',
              FullName: 'Lykke'
            },
            {
              Id: '2',
              AssetClass: '',
              Description: '',
              IssuerName: '',
              NumberOfCoins: '',
              AssetDescriptionUrl: '',
              FullName: 'Lykke 2'
            }
          ]
        })
      );

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets()).toHaveLength(2);
    });

    it('should accept response with no Assets & Descriptions fields', async () => {
      api.fetchAll = jest.fn(() =>
        Promise.resolve([
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
        ])
      );
      api.fetchAssetsDescriptions = jest.fn(() =>
        Promise.resolve([
          {
            Id: '1',
            FullName: 'Lykke'
          },
          {
            Id: '2',
            FullName: 'Lykke 2'
          }
        ])
      );

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets()).toHaveLength(2);
    });
  });

  describe('fetch asset by id', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      assetStore.descriptions = [
        {
          Id: '1',
          AssetClass: '',
          Description: '',
          IssuerName: '',
          NumberOfCoins: '',
          AssetDescriptionUrl: '',
          FullName: 'Lykke'
        }
      ];
    });

    it('should call api get asset pairs', async () => {
      api.fetchAssetById = jest.fn(() => Promise.resolve({Asset: []}));

      await assetStore.fetchAssetById('1');

      expect(api.fetchAssetById).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to asset', async () => {
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

      await assetStore.fetchAssetById('1');

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets()).toHaveLength(1);
    });

    it('should accept response with no Asset field', async () => {
      api.fetchAssetById = jest.fn(() =>
        Promise.resolve({
          Id: '1',
          DisplayId: 'LKK',
          Accuracy: 4,
          CategoryId: 'ctg1'
        })
      );

      await assetStore.fetchAssetById('1');

      expect(assetStore.getAssets()).not.toBeNull();
      expect(assetStore.getAssets()).toHaveLength(1);
    });
  });

  describe('map asset from dto', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('correctly maps from dto', async () => {
      const ctg = new AssetCategoryModel({name: 'Other'});
      const expectedAsset = new AssetModel({
        id: '1',
        name: 'LKK',
        accuracy: 2,
        category: ctg,
        fullName: 'Lykke'
      });
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

      await assetStore.fetchAssets();

      expect(assetStore.getAssets()[0]).toEqual(expectedAsset);
    });

    it('should use Name if DisplayId is not provided', async () => {
      const name = 'LKK';
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
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call api get asset pairs', () => {
      assetStore.fetchInstruments();

      expect(api.fetchAssetInstruments).toHaveBeenCalled();
      expect(api.fetchAssetInstruments).toHaveBeenCalledTimes(1);
    });

    it('should map valid response to instruments', async () => {
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
      expect(assetStore.getInstruments()).toHaveLength(1);
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
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should not mess up base and quoting asset', async () => {
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

      expect(refStore.findInstruments('BTC', '')).not.toHaveLength(0);
      expect(refStore.findInstruments('Bitcoin', '')).not.toHaveLength(0);
      expect(refStore.findInstruments('Swiss Franc', '')).toHaveLength(0);
      expect(refStore.findInstruments('Randomness', '')).toHaveLength(0);
    });
  });
});
