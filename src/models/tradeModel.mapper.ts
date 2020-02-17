import {add, reject} from 'rambda';
import {
  InstrumentModel,
  OrderType as OrderTypeModel,
  Side,
  TradeModel
} from '.';
import {precisionCeil, precisionFloor} from '../utils/math';
import {mapHistoryTypeToOrderType} from './mappers';
import SideDirection from './sideDirection';

// TODO: move it to the mappers directory

interface TradeValue {
  volume: number;
  oppositeVolume: number;
  assetId: string;
  price: number;
}

const hasEmptyVolume = (x: TradeValue) =>
  x.volume === 0 || x.oppositeVolume === 0;

export const mapToEffectivePrice = (
  trades: TradeValue[] = [],
  baseAssetId: string,
  accuracy: number = 0,
  side: SideDirection
) => {
  if (trades.length === 0) {
    return undefined;
  }

  const tradesWithVolumes = reject(hasEmptyVolume, trades);
  const volumeSum = tradesWithVolumes.map(x => x.volume).reduce(add, 0);
  const oppositeVolumeSum = tradesWithVolumes
    .map(x => x.oppositeVolume)
    .reduce(add, 0);

  if (tradesWithVolumes.length === 0) {
    return trades[0].price;
  }
  if (tradesWithVolumes.length === 1) {
    return tradesWithVolumes[0].price;
  }

  const effectivePrice =
    baseAssetId === trades[0].assetId
      ? oppositeVolumeSum / volumeSum
      : volumeSum / oppositeVolumeSum;

  return side === SideDirection.Buy
    ? precisionCeil(effectivePrice, accuracy)
    : precisionFloor(effectivePrice, accuracy);
};

export const fromRestToTrade = (
  trades: any[],
  instruments: InstrumentModel[]
) => {
  return trades.map(trade => {
    const {
      Id,
      AssetPairId,
      BaseVolume,
      BaseAssetName,
      QuoteAssetName,
      Direction,
      Price,
      Timestamp,
      QuoteVolume
    } = trade;

    return new TradeModel({
      id: Id,
      price: Price,
      volume: BaseVolume,
      baseAssetName: BaseAssetName,
      quoteAssetName: QuoteAssetName,
      side: Direction,
      symbol: AssetPairId,
      timestamp: Timestamp,
      tradeId: Id,
      oppositeVolume: QuoteVolume,
      orderType: OrderTypeModel.Market,
      instrument: instruments.find(instrument => instrument.id === AssetPairId)
    });
  });
};

export const fromWampToTrade = (dto: any[], instruments: InstrumentModel[]) => {
  const instrument = instruments.find(
    i =>
      (i.baseAsset.id === dto[0].Asset &&
        i.quoteAsset.id === dto[0].OppositeAsset) ||
      (i.baseAsset.id === dto[0].OppositeAsset &&
        i.quoteAsset.id === dto[0].Asset)
  );
  const baseAssetId = instrument!.baseAsset.id;
  const tradesByBaseAsset = dto.filter(x => x.Asset === baseAssetId);
  const {
    TradeId,
    DateTime,
    OrderType,
    Direction,
    WalletId
  } = tradesByBaseAsset[0];
  const effectivePrice = mapToEffectivePrice(
    tradesByBaseAsset.map(({Volume, OppositeVolume, Asset, Price}) => ({
      volume: Volume,
      oppositeVolume: OppositeVolume,
      assetId: Asset,
      price: Price
    })),
    baseAssetId,
    instrument!.accuracy,
    Direction
  );

  const fee = dto
    .filter(t => t.Fee)
    .map(t => t.Fee.Volume)
    .reduce(add, 0);

  return new TradeModel({
    id: TradeId,
    price: effectivePrice,
    volume: Math.abs(tradesByBaseAsset.map(t => t.Volume).reduce(add)),
    side: Direction === SideDirection.Buy ? Side.Buy : Side.Sell,
    symbol: instrument!.id,
    timestamp: DateTime,
    tradeId: TradeId,
    oppositeVolume: Math.abs(
      tradesByBaseAsset.map(t => t.OppositeVolume).reduce(add)
    ),
    orderType: mapHistoryTypeToOrderType(OrderType),
    instrument: instrument!,
    fee,
    walletId: WalletId
  });
};

export const fromRestToPublicTrade = ({
  id,
  index,
  assetPairId,
  volume,
  price,
  action,
  dateTime
}: any) =>
  new TradeModel({
    id,
    index,
    volume,
    symbol: assetPairId,
    price,
    side: Side[action],
    timestamp: dateTime
  });

export const fromWampToPublicTrade = ({
  Id,
  AssetPairId,
  Volume,
  Price,
  Action,
  DateTime,
  Index
}: any) =>
  new TradeModel({
    id: Id,
    volume: Volume,
    symbol: AssetPairId,
    price: Price,
    side: Side[Action],
    timestamp: DateTime,
    index: Index
  });

export const feeAssetFromSide = (instrument: InstrumentModel, side: string) =>
  side === Side.Buy ? instrument.baseAsset : instrument.quoteAsset;
