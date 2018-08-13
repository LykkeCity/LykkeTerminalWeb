import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface HistoryApi {
  fetchHistory: (walletId: string, query: any) => ApiResponse;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchHistory = (walletId: string, query: any) =>
    this.getWithQuery<any[]>(`/History/wallet/${walletId}`, query);

  fetchCsvLink = (walletId: string): Promise<string> =>
    this.getWithQuery<string>(`/History/client/csv`, {id: walletId});

  fetchCsvId = (body: any): Promise<any> =>
    this.post(`/History/client/csv`, body);

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
