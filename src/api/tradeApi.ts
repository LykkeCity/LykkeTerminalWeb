import {InstrumentModel, OperationType} from '../models/index';
import {HistoryApi} from './index';
import {RestApi} from './restApi';
import {ApiResponse} from './types';

const filterByType = ({Type}: any) =>
  Type === OperationType.Trade || Type === OperationType.LimitTrade;

const filterByInstrument = (instrument: InstrumentModel) => ({
  AssetPair
}: any) => AssetPair === instrument.id;

export interface TradeApi {
  fetchTrades: (
    instrument: InstrumentModel,
    skip: number,
    take: number
  ) => ApiResponse;
  fetchPublicTrades: (
    instrumentId: string,
    skip: number,
    take: number
  ) => ApiResponse;
}

export class RestTradeApi extends RestApi implements TradeApi {
  fetchTrades = async (
    instrument: InstrumentModel,
    skip: number,
    take: number
  ) => {
    const resp = await HistoryApi.fetchHistory({
      assetId: instrument.baseAsset.id,
      skip,
      take
    });
    return resp.filter(filterByInstrument(instrument)).filter(filterByType);
  };

  fetchPublicTrades = (instrumentId: string, skip: number, take: number) =>
    Promise.resolve([]);
  // HistoryApi.fetchTradesByInstrument(instrumentId, skip, take);
}

export default TradeApi;
