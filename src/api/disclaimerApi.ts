import RestApiV1 from './restApiV1';
import {ApiResponse} from './types';

export interface DisclaimerApi {
  fetchAssetDisclaimers: () => ApiResponse<any>;
  approveAssetDisclaimer: (disclaimerId: string) => ApiResponse<any>;
  declineAssetDisclaimer: (disclaimerId: string) => ApiResponse<any>;
}

export class RestDisclaimerApi extends RestApiV1 implements DisclaimerApi {
  fetchAssetDisclaimers = () => this.get('/AssetDisclaimers');
  approveAssetDisclaimer = (disclaimerId: string) =>
    this.fireAndForget(`/AssetDisclaimers/${disclaimerId}/approve`, null);
  declineAssetDisclaimer = (disclaimerId: string) =>
    this.fireAndForget(`/AssetDisclaimers/${disclaimerId}/decline`, null);
}

export default DisclaimerApi;
