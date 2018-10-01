import {safeMath} from '@lykkex/lykke.js';
import {add, reject, uniq, without} from 'rambda';
import {FeeType, InstrumentModel, Side, TradeModel} from '.';
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
    ? safeMath.ceil(effectivePrice, accuracy)
    : safeMath.floor(effectivePrice, accuracy);
};

export const aggregateTradesByTimestamp = (
  trades: any[],
  instruments: InstrumentModel[]
) =>
  trades.reduce((acc: any[], curr: any) => {
    const tradesByDate = acc.filter(x => x.timestamp === curr.DateTime);
    if (tradesByDate.length > 0) {
      return acc;
    }
    const twinnedTrades = trades.filter(x => x.DateTime === curr.DateTime);
    const assetIds = uniq(twinnedTrades.map(x => x.Asset));

    if (assetIds.length < 2) {
      return acc;
    }

    const instrument = instruments.find(
      x =>
        x.id === curr.AssetPair ||
        ((x.baseAsset.id === assetIds[0] && x.quoteAsset.id === assetIds[1]) ||
          (x.baseAsset.id === assetIds[1] && x.quoteAsset.id === assetIds[1]))
    );

    if (instrument && twinnedTrades.length !== 1) {
      const mappedTrade = fromRestToTrade(
        instrument.baseAsset.id,
        twinnedTrades
      );
      if (mappedTrade) {
        acc.push({
          ...mappedTrade,
          instrument
        });
      }
    }

    return acc;
  }, []);

export const fromRestToTrade = (baseAssetId: string, trades: any[]) => {
  const tradesByBaseAsset = trades.filter(x => x.Asset === baseAssetId);
  const tradesByQuoteAsset = without(tradesByBaseAsset, trades);

  if (tradesByBaseAsset.length > 0) {
    const {Id, AssetPair, Price, Amount, DateTime, Type} = tradesByBaseAsset[0];

    const fee = trades
      .filter(t => t.FeeType !== FeeType.Unknown)
      .map(feeValueFromRest)
      .reduce(add, 0);

    return new TradeModel({
      id: Id,
      price: Price,
      volume: Math.abs(Amount),
      side: Amount > 0 ? Side.Buy : Side.Sell,
      symbol: AssetPair,
      timestamp: DateTime,
      tradeId: Id,
      oppositeVolume: Math.abs(tradesByQuoteAsset[0].Amount),
      orderType: mapHistoryTypeToOrderType(Type),
      fee
    });
  }
  return null;
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
    symbol: instrument!.displayName,
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
  DateTime
}: any) =>
  new TradeModel({
    id: Id,
    volume: Volume,
    symbol: AssetPairId,
    price: Price,
    side: Side[Action],
    timestamp: DateTime
  });

export const feeAssetFromSide = (instrument: InstrumentModel, side: string) =>
  side === Side.Buy ? instrument.baseAsset : instrument.quoteAsset;

const feeValueFromRest = ({FeeSize, FeeType: FeeTypeDto, Amount}: any) =>
  FeeSize * (FeeTypeDto === FeeType.Absolute ? 1 : Math.abs(Amount) / 100);
