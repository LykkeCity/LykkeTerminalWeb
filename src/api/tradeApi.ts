import Operations from '../models/operationTypes';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchAll: () => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchAll = () =>
    HistoryApi.fetchHistory({
      operationType: Operations.Trade,
      skip: 0,
      take: 100
    });
}

export default TradeApi;
