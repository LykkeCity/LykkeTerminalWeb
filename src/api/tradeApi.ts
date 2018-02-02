import Operations from '../models/operationTypes';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchAll: (skip: number, take: number) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchAll = (skip: number, take: number) =>
    HistoryApi.fetchHistory({
      operationType: Operations.Trade,
      skip,
      take
    });
}

export default TradeApi;
