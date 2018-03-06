import {RestApi} from './restApi';
import {ApiResponse} from './types/index';

export interface AssetApi {
  fetchAll: () => Promise<any>;
  fetchAssetById: (id: string) => Promise<any>;
  fetchBaseAsset: () => Promise<any>;
  fetchAssetCategories: () => Promise<any>;
  fetchAssetInstruments: () => Promise<any>;
  fetchPublicAssetInstruments: () => Promise<any>;
  setBaseAsset: (body: any) => Promise<any>;
  fetchRates: () => ApiResponse;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAll = () => this.get('/assets');
  fetchAvailableAssets = () => this.get('/assets/available');
  fetchBaseAsset = () => this.get('/assets/baseAsset');
  fetchAssetCategories = () => this.get('/assets/categories');
  fetchAssetInstruments = () => this.get('/assetpairs');
  fetchPublicAssetInstruments = () =>
    this.getPublic('/AssetPairs/dictionary/Spot');
  setBaseAsset = (body: any) => this.fireAndForget('/assets/baseAsset', body);
  fetchAssetById = (id: string) => this.get(`/assets/${id}`);
  fetchRates = () => this.get('/assetpairs/rates');
}

// tslint:disable-next-line:max-classes-per-file
export class MockAssetApi implements AssetApi {
  fetchAll = () => Promise.resolve<any[]>([]);
  fetchAssetById = () => Promise.resolve<any[]>([]);
  fetchBaseAsset = () => Promise.resolve<any[]>([]);
  fetchAssetCategories = () => Promise.resolve<any[]>([]);
  fetchAssetInstruments = () => Promise.resolve<any[]>([]);
  setBaseAsset = () => Promise.resolve<any[]>([]);
  fetchRates = () => Promise.resolve([]);
  fetchPublicAssetInstruments = () => Promise.resolve([]);
}

export default AssetApi;
