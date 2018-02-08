import Operations from '../models/operationTypes';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchUserTrades: (skip: number, take: number) => ApiResponse;
  fetchPublicTrades: (skip: number, take: number) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchUserTrades = (skip: number, take: number) =>
    HistoryApi.fetchHistory({
      operationType: Operations.Trade,
      skip,
      take
    });

  fetchPublicTrades = (skip: number, take: number) =>
    // this.fetchUserTrades(skip, take);
    Promise.resolve([]);
}

export default TradeApi;
