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
    Promise.resolve([
      {
        Id: Math.random(),
        // tslint:disable-next-line:object-literal-sort-keys
        DateTime: '2018-02-07T21:57:44.100Z',
        Type: 'CashIn',
        State: 'InProgress',
        Amount: 0,
        Asset: 'string',
        AssetPair: 'string',
        Price: 0
      }
    ]);
}

export default TradeApi;
