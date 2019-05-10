import {CsvIdRequestModel, CsvIdResponseModel} from '../models/csvModels';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

type TradeRequest = (
  walletId: string,
  instrumentId: string,
  skip: number,
  take: number,
  from: string,
  tradeType: string
) => ApiResponse;

type PublicTradeRequest = (
  instrumentId: string,
  skip: number,
  take: number
) => ApiResponse;

export interface TradeApi {
  fetchTrades: TradeRequest;
  fetchPublicTrades: PublicTradeRequest;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchTrades = (
    walletId: string,
    instrumentId: string,
    skip: number,
    take: number,
    from: string,
    tradeType: string
  ) =>
    HistoryApi.fetchHistory(walletId, {
      assetPairId: instrumentId,
      skip,
      take,
      from,
      tradeType
    });

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    HistoryApi.fetchTradesByInstrument(instrumentId, skip, take);

  fetchCsvId = (body: CsvIdRequestModel): Promise<CsvIdResponseModel> =>
    HistoryApi.fetchCsvId(body);
}

export default TradeApi;
