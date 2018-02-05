import Operations from '../models/operationTypes';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchUserTrade: (skip: number, take: number) => ApiResponse;
  fetchPublicTrade: (skip: number, take: number) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchUserTrade = (skip: number, take: number) =>
    HistoryApi.fetchHistory({
      operationType: Operations.Trade,
      skip,
      take
    });

  fetchPublicTrade = (skip: number, take: number) =>
    this.fetchUserTrade(skip, take);
}

export default TradeApi;
