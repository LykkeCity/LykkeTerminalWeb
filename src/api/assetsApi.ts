import {RestApi} from './restApi';

interface SetBaseAssetInterface {
  BaseAsssetId: string;
}

export interface AssetsApi {
  fetchAll: () => Promise<any>;
  fetchBaseAsset: () => Promise<any>;
  fetchAssetCategories: () => Promise<any>;
  fetchAssetInstruments: () => Promise<any>;
  setBaseAsset: (body: SetBaseAssetInterface) => Promise<any>;
}

export class RestAssetsApi extends RestApi implements AssetsApi {
  fetchAll = () => this.get('/assets');
  fetchBaseAsset = () => this.get('/assets/baseAsset');
  fetchAssetCategories = () => this.get('/assets/categories');
  fetchAssetInstruments = () => this.get('/assetpairs');
  setBaseAsset = (body: SetBaseAssetInterface) =>
    this.post('/assets/baseAsset', body);
}

// tslint:disable-next-line:max-classes-per-file
export class MockAssetsApi implements AssetsApi {
  fetchAll = () => Promise.resolve<any[]>([]);
  fetchBaseAsset = () => Promise.resolve<any[]>([]);
  fetchAssetCategories = () => Promise.resolve<any[]>([]);
  fetchAssetInstruments = () => Promise.resolve<any[]>([]);
  setBaseAsset = () => Promise.resolve<any[]>([]);
}

export default AssetsApi;
