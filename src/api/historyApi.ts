import {HistoryResponseModel} from '../models';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface HistoryApi {
  fetchHistory: (walletId: string, query: any) => ApiResponse;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchHistory = (walletId: string, query: any) =>
    this.getWithQuery<any[]>(`/History/wallet/${walletId}`, query);

  fetchHistoryByWalletId = (
    walletId: string,
    query: any
  ): Promise<HistoryResponseModel[]> =>
    this.getWithQuery<any[]>(`/History/wallet/${walletId}`, query);

  fetchTradesByInstrument = (
    instrumentId: string,
    skip: number,
    take: number
  ) =>
    this.publicWretcher()
      .url(`/trades/${instrumentId}`)
      .query({skip, take})
      .get()
      .json<any[]>();
}

const instance = new RestHistoryApi();
export default instance;
