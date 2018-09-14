import mockAssetApi from '../api/mocks/assetApi';
import {RestApi} from './restApi';

export interface AssetApi {
  fetchAll: () => Promise<any>;
  fetchAssetById: (id: string) => Promise<any>;
  fetchBaseAsset: () => Promise<any>;
  fetchAssetInstruments: () => Promise<any>;
  fetchPublicAssetInstruments: () => Promise<any>;
  setBaseAsset: (body: any) => Promise<any>;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAll = () =>
    this.extendWithMocks(
      () => this.get('/assets'),
      () => mockAssetApi.fetchAll()
    );

  fetchAvailableAssets = () =>
    this.extendWithMocks(
      () => this.get('/assets/available'),
      () => mockAssetApi.fetchAvailableAssets()
    );

  fetchBaseAsset = () =>
    this.extendWithMocks(
      () => this.get('/assets/baseAsset'),
      () => mockAssetApi.fetchBaseAsset()
    );

  fetchAssetInstruments = () =>
    this.extendWithMocks(
      () => this.get('/assetpairs/available'),
      () => mockAssetApi.fetchAssetInstruments()
    );

  fetchPublicAssetInstruments = () =>
    this.extendWithMocks(
      () => this.get('/assetpairs'),
      () => mockAssetApi.fetchPublicAssetInstruments()
    );

  setBaseAsset = (body: any) =>
    this.extendWithMocks(
      () => this.fireAndForget('/assets/baseAsset', body),
      () => mockAssetApi.setBaseAsset()
    );

  fetchAssetById = (id: string) =>
    this.extendWithMocks(
      () => this.get(`/assets/${id}`),
      () => mockAssetApi.fetchAssetById(id)
    );

  fetchMarket = () =>
    this.extendWithMocks(
      () => this.get('/markets'),
      () => mockAssetApi.fetchMarket()
    );

  fetchAssetsDescriptions = () =>
    this.extendWithMocks(
      () => this.get('/assets/description'),
      () => mockAssetApi.fetchAssetsDescriptions()
    );
}

export default AssetApi;
