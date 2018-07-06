import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface HistoryApi {
  fetchHistory: (query: any) => ApiResponse;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchHistory = (query: any) =>
    this.getWithQuery<any[]>(`/History/client`, query);

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

export default RestHistoryApi;
