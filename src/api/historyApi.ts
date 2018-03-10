import wretch from 'wretch';
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
    wretch(process.env.REACT_APP_PUBLIC_API_URL)
      .url(`/trades/${instrumentId}`)
      .query({skip, take})
      .get()
      .json();
}

const instance = new RestHistoryApi();
export default instance;
