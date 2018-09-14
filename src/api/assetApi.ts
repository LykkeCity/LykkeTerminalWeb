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
  fetchAll = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assets'),
      () => mockAssetApi.fetchAll(),
      () => onRefetch()
    );

  fetchAvailableAssets = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assets/available'),
      () => mockAssetApi.fetchAvailableAssets(),
      () => onRefetch()
    );

  fetchBaseAsset = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assets/baseAsset'),
      () => mockAssetApi.fetchBaseAsset(),
      () => onRefetch()
    );

  fetchAssetInstruments = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assetpairs/available'),
      () => mockAssetApi.fetchAssetInstruments(),
      () => onRefetch()
    );

  fetchPublicAssetInstruments = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assetpairs'),
      () => mockAssetApi.fetchPublicAssetInstruments(),
      () => onRefetch()
    );

  setBaseAsset = (body: any) =>
    this.extendForOffline(
      () => this.fireAndForget('/assets/baseAsset', body),
      () => mockAssetApi.setBaseAsset()
    );

  fetchAssetById = (id: string, onRefetch?: any) =>
    this.extendForOffline(
      () => this.get(`/assets/${id}`),
      () => mockAssetApi.fetchAssetById(id),
      () => onRefetch()
    );

  fetchMarket = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/markets'),
      () => mockAssetApi.fetchMarket(),
      () => onRefetch()
    );

  fetchAssetsDescriptions = (onRefetch?: any) =>
    this.extendForOffline(
      () => this.get('/assets/description'),
      () => mockAssetApi.fetchAssetsDescriptions(),
      () => onRefetch()
    );
}

export default AssetApi;
