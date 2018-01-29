import {ChartStore} from '../../stores/index';
import {
  InstrumentModel,
  Interval,
  OrderModel,
  Side,
  TradeModel
} from '../index';
import SideDirection from '../sideDirection';

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
  Volume = 0
}: any) => ({
  close: Close,
  high: High,
  low: Low,
  open: Open,
  time: new Date(DateTime).getTime(),
  volume: Volume
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
  invertedAccuracy
}: InstrumentModel) => ({
  name,
  minmov: 1,
  pricescale: 1,
  session: '24x7',
  timezone: 'Europe/Istanbul',
  supported_resolutions: ChartStore.config.supported_resolutions,
  has_intraday: true,
  intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '720'],
  has_empty_bars: true
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
  Volume,
  Price,
  AssetPairId
}: any) =>
  new OrderModel({
    createdAt: new Date(CreateDateTime),
    id: Id,
    price: Number(Price),
    side: OrderAction,
    symbol: AssetPairId,
    volume: Volume
  });

export const mapToTrade = ({
  Asset,
  Volume,
  Direction,
  DateTime,
  TradeId
}: any) =>
  new TradeModel({
    quantity: Direction === SideDirection.Buy ? Volume : Volume * -1,
    side: Direction === SideDirection.Buy ? Side.Buy : Side.Sell,
    asset: Asset,
    timestamp: DateTime,
    tradeId: `${TradeId}${Asset}`
  });

export const mapToTradeInit = ({Asset, Volume, DateTime, Id}: any) =>
  new TradeModel({
    quantity: Volume,
    asset: Asset,
    timestamp: DateTime,
    tradeId: Id,
    side: Volume >= 0 ? Side.Buy : Side.Sell
  });
