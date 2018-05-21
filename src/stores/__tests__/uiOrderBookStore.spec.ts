import {equals} from 'rambda';
import {RootStore, UiOrderBookStore} from '../index';
import {AssetModel, InstrumentModel, OrderModel} from '../../models';
import Side from '../../models/side';
import OrderBookCellType from '../../models/orderBookCellType';
import {mapToLevelCell} from '../../models/mappers';
import {LevelCellInterface} from '../uiOrderBookStore';
import {precisionFloor} from '../../utils/math';

describe('UiOrderBook store', () => {
  let store: UiOrderBookStore;
  let levelAskCell: any;
  let levelBidCell: any;
  let clickedCoords: any;
  let attrs: any;

  beforeEach(() => {
    store = new UiOrderBookStore(new RootStore());

    store.rootStore.uiStore.selectedInstrument = new InstrumentModel({
      baseAsset: new AssetModel({name: 'BTC', accuracy: 8}),
      id: 'BTCUSD',
      quoteAsset: new AssetModel({name: 'USD', accuracy: 3})
    });

    attrs = {
      order: new OrderModel({
        id: '30707475-9178-4592-b306-fe32c7eabac8',
        price: 8195.718,
        remainingVolume: 1,
        side: Side.Sell,
        symbol: 'BTCUSD',
        volume: 5,
        createdAt: new Date()
      }),
      type: OrderBookCellType.Price
    };

    levelAskCell = {
      getClientRect() {
        return {
          x: 0,
          width: 100,
          y: 0,
          height: 100
        };
      },
      getAttrs() {
        return attrs;
      },
      index: 0,
      parent: {
        index: 0
      }
    };
    levelBidCell = {
      getClientRect() {
        return {
          x: 0,
          width: 100,
          y: 0,
          height: 100
        };
      },
      getAttrs() {
        return attrs;
      },
      index: 0,
      parent: {
        index: 0
      }
    };
    clickedCoords = {
      x: levelAskCell.getClientRect().x + 1,
      y: levelAskCell.getClientRect().y + 1
    };
  });

  it('should store info about level ask cell', () => {
    store.storeAskLevelCellInfo(levelAskCell);
    const cell = store.findAskLevelCellByCoords(
      clickedCoords.x,
      clickedCoords.y
    );
    expect(equals(cell as any, mapToLevelCell(levelAskCell))).toBeTruthy();
  });

  it('should store info about level bid cell', () => {
    store.storeBidLevelCellInfo(levelBidCell);
    const cell = store.findBidLevelCellByCoords(
      levelBidCell.getClientRect().x + 1,
      levelBidCell.getClientRect().y + 1
    );
    expect(equals(cell as any, mapToLevelCell(levelBidCell))).toBeTruthy();
  });

  it('should change the level cell info if cell is already existed', () => {
    store.storeAskLevelCellInfo(levelAskCell);
    const cell = store.findAskLevelCellByCoords(
      clickedCoords.x,
      clickedCoords.y
    );

    attrs.type = OrderBookCellType.Volume;
    store.storeAskLevelCellInfo(levelAskCell);

    const cellWithChangedInfo = store.findAskLevelCellByCoords(
      clickedCoords.x,
      clickedCoords.y
    );
    expect(cell!.type).not.toBe(cellWithChangedInfo!.type);
  });

  it('should add level to array', () => {
    const arr: LevelCellInterface[] = [];
    store.addLevelCellInfo(levelAskCell, arr);
    expect(equals(arr[0] as any, mapToLevelCell(levelBidCell))).toBeTruthy();
  });

  it('should return boolean if cell presented or not', () => {
    const arr: LevelCellInterface[] = [];
    store.addLevelCellInfo(levelAskCell, arr);
    expect(store.isLevelCellInfoPresented(levelAskCell, arr)).toBeTruthy();

    levelAskCell.parent.index = 100;
    levelAskCell.index = 50;
    expect(store.isLevelCellInfoPresented(levelAskCell, arr)).toBeFalsy();
  });

  it('should call handlePriceClickFromOrderBook with order side and price', () => {
    store.rootStore.uiOrderStore.handlePriceClickFromOrderBook = jest.fn();
    store.storeAskLevelCellInfo(levelAskCell);
    const cell = store.findAskLevelCellByCoords(
      clickedCoords.x,
      clickedCoords.y
    );
    store.handleAskLevelCellsClick(clickedCoords.x, clickedCoords.y);

    expect(
      store.rootStore.uiOrderStore.handlePriceClickFromOrderBook
    ).toHaveBeenCalledWith(cell!.order.price, cell!.order.side);
  });

  it('should call handleVolumeClickFromOrderBook for volume type of cell', () => {
    store.rootStore.uiOrderStore.handleVolumeClickFromOrderBook = jest.fn();
    attrs.type = OrderBookCellType.Volume;
    store.storeAskLevelCellInfo(levelAskCell);
    const cell = store.findAskLevelCellByCoords(
      clickedCoords.x,
      clickedCoords.y
    );

    const {order, type: displayType} = cell!;
    const value = precisionFloor(
      order[displayType] * order.price,
      store.rootStore.uiStore.selectedInstrument!.baseAsset.accuracy
    );

    store.handleAskLevelCellsClick(clickedCoords.x, clickedCoords.y);
    expect(
      store.rootStore.uiOrderStore.handleVolumeClickFromOrderBook
    ).toHaveBeenCalledWith(value, cell!.order.side);
  });

  it('should call handleVolumeClickFromOrderBook for depth type of cell', () => {
    store.rootStore.uiOrderStore.handleVolumeClickFromOrderBook = jest.fn();

    attrs.type = OrderBookCellType.Depth;
    store.storeAskLevelCellInfo(levelAskCell);

    let cell = store.findAskLevelCellByCoords(clickedCoords.x, clickedCoords.y);

    const {order, type: displayType} = cell!;
    const value = precisionFloor(
      order[displayType] * order.price,
      store.rootStore.uiStore.selectedInstrument!.baseAsset.accuracy
    );

    store.handleAskLevelCellsClick(clickedCoords.x, clickedCoords.y);
    expect(
      store.rootStore.uiOrderStore.handleVolumeClickFromOrderBook
    ).toHaveBeenCalledWith(value, cell!.order.side);
  });
});
