import {curry, ifElse} from 'rambda';
import {OrderModel} from '../models';
import {mapToLevelCell} from '../models/mappers';
import OrderBookCellType from '../models/orderBookCellType';
import Side from '../models/side';
import {switchcase} from '../utils/fn';
import {BaseStore, RootStore} from './index';

export interface LevelCellInterface {
  order: OrderModel;
  type: string;
  x: {start: number; end: number};
  y: {start: number; end: number};
  parentIndex: number;
  cellIndex: number;
}
class UiOrderBookStore extends BaseStore {
  storeAskLevelCellInfo: (level: any) => void;
  storeBidLevelCellInfo: (level: any) => void;
  findAskLevelCellByCoords: (
    x: number,
    y: number
  ) => LevelCellInterface | undefined;
  findBidLevelCellByCoords: (
    x: number,
    y: number
  ) => LevelCellInterface | undefined;
  private askLevelsCells: LevelCellInterface[] = [];
  private bidLevelsCells: LevelCellInterface[] = [];

  constructor(store: RootStore) {
    super(store);

    this.storeAskLevelCellInfo = curry(this.storeLevelCellInfo)(
      this.askLevelsCells
    );
    this.storeBidLevelCellInfo = curry(this.storeLevelCellInfo)(
      this.bidLevelsCells
    );
    this.findAskLevelCellByCoords = curry(this.findLevelCellByCoords)(
      this.askLevelsCells
    );
    this.findBidLevelCellByCoords = curry(this.findLevelCellByCoords)(
      this.bidLevelsCells
    );
  }

  setOrderPrice = (cell: LevelCellInterface) => {
    const {order} = cell;
    this.rootStore.uiOrderStore.handlePriceClickFromOrderBook(
      order.price,
      order.side
    );
  };

  setOrderVolume = (cell: LevelCellInterface) => {
    const {order} = cell;
    const orderSide = order.side === Side.Sell ? Side.Buy : Side.Sell;
    this.rootStore.uiOrderStore.handleVolumeClickFromOrderBook(
      order[OrderBookCellType.Depth],
      orderSide
    );
  };

  changeLevelCellInfo = (level: any, levelsCells: LevelCellInterface[]) => {
    const index = levelsCells.findIndex(
      cell =>
        cell.parentIndex === level.parent.index &&
        cell.cellIndex === level.index
    );
    levelsCells[index] = mapToLevelCell(level);
  };

  addLevelCellInfo = (level: any, levelsCells: LevelCellInterface[]) =>
    levelsCells.push(mapToLevelCell(level));

  isLevelCellInfoPresented = (level: any, levelsCells: LevelCellInterface[]) =>
    !!levelsCells.find(
      cell =>
        cell.parentIndex === level.parent.index &&
        cell.cellIndex === level.index
    );

  storeLevelCellInfo = (levelsCells: LevelCellInterface[], level: any) => {
    if (level) {
      ifElse(
        l => this.isLevelCellInfoPresented(l, levelsCells),
        l => this.changeLevelCellInfo(l, levelsCells),
        l => this.addLevelCellInfo(l, levelsCells)
      )(level);
    }
  };

  findLevelCellByCoords = (
    levelsCells: LevelCellInterface[],
    x: number,
    y: number
  ) =>
    levelsCells.find(
      c => c.x.start <= x && x <= c.x.end && c.y.start <= y && y <= c.y.end
    );

  triggerOrderUpdate = (cell: LevelCellInterface | undefined) => {
    if (cell) {
      switchcase({
        [OrderBookCellType.Price]: this.setOrderPrice,
        [OrderBookCellType.Volume]: this.setOrderVolume,
        [OrderBookCellType.Depth]: this.setOrderVolume
      })(cell.type)(cell);
    }
  };

  handleAskLevelCellsClick = (x: number, y: number) =>
    this.triggerOrderUpdate(this.findAskLevelCellByCoords(x, y));

  handleBidLevelCellsClick = (x: number, y: number) =>
    this.triggerOrderUpdate(this.findBidLevelCellByCoords(x, y));

  reset = () => {
    this.askLevelsCells = [];
    this.bidLevelsCells = [];
  };
}

export default UiOrderBookStore;
