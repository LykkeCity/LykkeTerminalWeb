import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface HistoryApi {
  fetchHistory: (query: any) => ApiResponse;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchHistory = (query: any) => this.getWithQuery(`/History/client`, query);

  fetchTradesByInstrument = (
    instrumentId: string,
    skip: number,
    take: number
  ) =>
    this.getWithQuery(`/history/trades/${instrumentId}`, {
      take,
      skip
    });
}

const instance = new RestHistoryApi();
export default instance;
