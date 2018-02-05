import {pathOr} from 'rambda';
import {ChartStore} from '../../stores/index';
import {
  AssetCategoryModel,
  AssetModel,
  InstrumentModel,
  Interval,
  OrderModel,
  Side,
  TradeModel
} from '../index';
import SideDirection from '../sideDirection';
import WatchlistModel from '../watchlistModel';

// tslint:disable:object-literal-sort-keys

export const mapToOrder = (dto: any) => ({
  id: dto.Id,
  price: dto.Price,
  side: dto.IsBuy ? Side.Sell : Side.Buy,
  timestamp: dto.DateTime,
  volume: dto.Volume
});

export const mapToBarFromRest = ({
  DateTime,
  Close,
  Open,
  High,
  Low,
  TradingVolume = 0
}: any) => ({
  close: Close,
  high: High,
  low: Low,
  open: Open,
  time: new Date(DateTime).getTime(),
  volume: TradingVolume
});

export const mapToBarFromWamp = ({t, c, o, h, l, v}: any) => ({
  close: c,
  high: h,
  low: l,
  open: o,
  time: new Date(t).getTime(),
  volume: v
});

export const mapToChartSymbol = ({
  name,
  accuracy,
  invertedAccuracy,
  baseAsset
}: InstrumentModel) => ({
  name,
  minmov: 1,
  pricescale: Math.pow(10, accuracy),
  session: '24x7',
  timezone: 'Europe/Istanbul',
  supported_resolutions: ChartStore.config.supported_resolutions,
  has_intraday: true,
  intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '720'],
  has_empty_bars: true,
  volume_precision: pathOr(0, ['accuracy'], baseAsset)
});

type ResolutionMapper = (resolution: string) => Interval;
export const mapChartResolutionToWampInterval: ResolutionMapper = resolution => {
  switch (resolution) {
    case '1':
      return 'minute';
    case '5':
      return 'min5';
    case '15':
      return 'min15';
    case '30':
      return 'min30';
    case '60':
      return 'hour';
    case '240':
      return 'hour4';
    case '360':
      return 'hour6';
    case '720':
      return 'hour12';
    case '1D':
      return 'day';
    case '1W':
      return 'week';
    case '1M':
      return 'month';

    default:
      return 'day';
  }
};

export const mapToLimitOrder = ({
  Id,
  CreateDateTime,
  OrderAction,
  Voume,
  Price,
  AssetPairId
}: any) =>
  new OrderModel({
    createdAt: new Date(CreateDateTime),
    id: Id,
    price: Number(Price),
    side: OrderAction,
    symbol: AssetPairId,
    volume: Voume
  });

export const mapToTradeFromWamp = ({
  Asset,
  Volume,
  Direction,
  DateTime,
  TradeId
}: any) => {
  const side = Direction === SideDirection.Buy ? Side.Buy : Side.Sell;
  return new TradeModel({
    quantity: Direction === SideDirection.Buy ? Volume : Volume * -1,
    side,
    asset: Asset,
    timestamp: DateTime,
    tradeId: TradeId,
    id: `${TradeId}${Asset}-${side}`
  });
};

export const mapToTradeFromRest = ({Asset, Amount, DateTime, Id}: any) =>
  new TradeModel({
    id: Id,
    quantity: Amount,
    asset: Asset,
    timestamp: DateTime,
    tradeId: Id,
    side: Amount >= 0 ? Side.Buy : Side.Sell
  });

export const mapToWatchList = ({Id, Name, AssetIds, ReadOnly}: any) =>
  new WatchlistModel({
    assetIds: AssetIds,
    id: Id,
    name: Name,
    readOnly: ReadOnly
  });

export const mapToAsset = (
  {Id, Name, DisplayId, CategoryId, Accuracy, IsBase, IconUrl}: any,
  categories: AssetCategoryModel[]
) =>
  new AssetModel({
    accuracy: Accuracy,
    category:
      categories.find(x => x.id === CategoryId) || AssetCategoryModel.Other(),
    iconUrl: IconUrl,
    id: Id,
    isBase: IsBase,
    name: DisplayId || Name
  });

export const mapToAssetCategory = ({Id: id, Name: name}: any) =>
  new AssetCategoryModel({id, name});

export const mapToInstrument = (
  {
    Id,
    Accuracy,
    BaseAssetId,
    IsDisabled,
    InvertedAccuracy,
    Name,
    QuotingAssetId,
    Source,
    Source2
  }: any,
  getAssetById: (assetId: string) => AssetModel | undefined
) =>
  new InstrumentModel({
    id: Id,
    name: Name,
    // tslint:disable-next-line:object-literal-sort-keys
    baseAsset: getAssetById(BaseAssetId),
    quotingAsset: getAssetById(QuotingAssetId),
    accuracy: Accuracy,
    invertedAccuracy: InvertedAccuracy
  });
