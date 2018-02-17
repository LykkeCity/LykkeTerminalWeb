import Operations from '../models/operationTypes';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

export interface TradeApi {
  fetchUserTrades: (skip: number, take: number) => ApiResponse;
  fetchPublicTrades: (skip: number, take: number) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchUserTrades = async (skip: number, take: number) => {
    const trades = (await HistoryApi.fetchHistory({
      operationType: Operations.Trade,
      skip,
      take
    })) as any[];
    const limitTrades = (await HistoryApi.fetchHistory({
      operationType: Operations.LimitTrade,
      skip,
      take
    })) as any[];
    return [...trades, ...limitTrades];
  };

  fetchPublicTrades = (skip: number, take: number) =>
    // this.fetchUserTrades(skip, take);
    Promise.resolve([]);
}

export default TradeApi;
