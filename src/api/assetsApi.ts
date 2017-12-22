import {RestApi} from './restApi';

interface SetBaseAssetInterface {
  BaseAsssetId: string;
}

export interface AssetsApi {
  fetchAll: () => Promise<any>;
  fetchBaseAsset: () => Promise<any>;
  setBaseAsset: (body: SetBaseAssetInterface) => Promise<any>;
}

export class RestAssetsApi extends RestApi implements AssetsApi {
  fetchAll = () => this.get('/assets');
  fetchBaseAsset = () => this.get('/assets/baseAsset');
  setBaseAsset = (body: SetBaseAssetInterface) =>
    this.post('/assets/baseAsset', body);
}

// tslint:disable-next-line:max-classes-per-file
export class MockAssetsApi implements AssetsApi {
  fetchAll = () => Promise.resolve<any[]>([]);

  fetchBaseAsset = () => Promise.resolve<any[]>([]);

  setBaseAsset = () => Promise.resolve<any[]>([]);
}

export default AssetsApi;
