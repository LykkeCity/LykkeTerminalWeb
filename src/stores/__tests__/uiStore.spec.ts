import {AssetModel, InstrumentModel, OrderBookDisplayType} from '../../models';
import Watchlists from '../../models/watchlists';
import {RootStore, UiStore} from '../index';

describe('uiStore', () => {
  let uiStore: UiStore;

  beforeEach(() => {
    uiStore = new UiStore(new RootStore());
  });

  it('should set false to showAssetsSelect by default', () => {
    expect(uiStore.showAssetsSelect).toBeFalsy();
  });

  it('should toggle showAssetsSelect', () => {
    expect(uiStore.showAssetsSelect).toBeFalsy();
    uiStore.toggleAssetsSelect();
    expect(uiStore.showAssetsSelect).toBeTruthy();
    uiStore.toggleAssetsSelect();
    expect(uiStore.showAssetsSelect).toBeFalsy();
  });

  it('should set false to showInstrumentPicker by default', () => {
    expect(uiStore.showInstrumentPicker).toBeFalsy();
  });

  it('should toggle showInstrumentPicker', () => {
    expect(uiStore.showInstrumentPicker).toBeFalsy();
    uiStore.toggleInstrumentPicker();
    expect(uiStore.showInstrumentPicker).toBeTruthy();
    uiStore.toggleInstrumentPicker();
    expect(uiStore.showInstrumentPicker).toBeFalsy();
  });

  it('should set false to showInstrumentSelection by default', () => {
    expect(uiStore.showInstrumentSelection).toBeFalsy();
  });

  it('should toggle showInstrumentPicker', () => {
    expect(uiStore.showInstrumentSelection).toBeFalsy();
    uiStore.toggleInstrumentSelection();
    expect(uiStore.showInstrumentSelection).toBeTruthy();
    uiStore.toggleInstrumentSelection();
    expect(uiStore.showInstrumentSelection).toBeFalsy();
  });

  it('should set false to showOrdersSelect by default', () => {
    expect(uiStore.showOrdersSelect).toBeFalsy();
  });

  it('should toggle showOrdersSelect', () => {
    expect(uiStore.showOrdersSelect).toBeFalsy();
    uiStore.toggleOrdersSelect();
    expect(uiStore.showOrdersSelect).toBeTruthy();
    uiStore.toggleOrdersSelect();
    expect(uiStore.showOrdersSelect).toBeFalsy();
  });

  it('should set false to showSessionNotification by default', () => {
    expect(uiStore.showSessionNotification).toBeTruthy();
  });

  it('should toggle showSessionNotification', () => {
    expect(uiStore.showSessionNotification).toBeTruthy();
    uiStore.toggleSessionNotification(false);
    expect(uiStore.showSessionNotification).toBeFalsy();
    uiStore.toggleSessionNotification(true);
    expect(uiStore.showSessionNotification).toBeTruthy();
  });

  it('should set false to showInstrumentPerformanceData by default', () => {
    expect(uiStore.showInstrumentPerformanceData).toBeFalsy();
  });

  it('should toggle showInstrumentPerformanceData', () => {
    expect(uiStore.showInstrumentPerformanceData).toBeFalsy();
    uiStore.toggleInstrumentPerformanceData(true);
    expect(uiStore.showInstrumentPerformanceData).toBeTruthy();
    uiStore.toggleInstrumentPerformanceData(false);
    expect(uiStore.showInstrumentPerformanceData).toBeFalsy();
  });

  it('should set an empty string to searchTerm by default', () => {
    expect(uiStore.searchTerm).toBe('');
  });

  it('should set incoming string to searchTerm', () => {
    const text = 'some text';
    uiStore.search(text);
    expect(uiStore.searchTerm).toBe(text);
  });

  it('should set Watchlists.All to searchWalletName by default', () => {
    expect(uiStore.searchWalletName).toBe(Watchlists.All);
  });

  it('should set incoming wallet name to searchTerm', () => {
    const searchWallet = 'some watchlist';
    uiStore.searchWallet(searchWallet);
    expect(uiStore.searchWalletName).toBe(searchWallet);
  });

  it('should set true to isReadOnlyMode', () => {
    uiStore.runReadOnlyMode();
    expect(uiStore.readOnlyMode).toBeTruthy();
  });

  it('should set false to isReadOnlyMode', () => {
    uiStore.stopReadOnlyMode();
    expect(uiStore.readOnlyMode).toBeFalsy();
  });

  it('should set OrderBookDisplayType.Volume to orderbookDisplayType by default', () => {
    expect(uiStore.orderbookDisplayType).toBe(OrderBookDisplayType.Volume);
  });

  it('should change orderbook display type', () => {
    expect(uiStore.orderbookDisplayType).toBe(OrderBookDisplayType.Volume);
    uiStore.changeOrderbookDisplayType(OrderBookDisplayType.Depth);
    expect(uiStore.orderbookDisplayType).toBe(OrderBookDisplayType.Depth);
  });

  it('should return true if asset is presented in display name', () => {
    const selectedInstrument = new InstrumentModel({
      baseAsset: new AssetModel({name: 'BTC'}),
      id: 'BTCUSD',
      quoteAsset: new AssetModel({name: 'USD'})
    });
    const asset = 'BTC';
    expect(uiStore.hasAsset(selectedInstrument, asset)).toBeTruthy();
  });

  it('should return false if asset is not presented in display name', () => {
    const selectedInstrument = new InstrumentModel({
      baseAsset: new AssetModel({name: 'BTC'}),
      id: 'BTCUSD',
      quoteAsset: new AssetModel({name: 'USD'})
    });
    const asset = 'CHF';
    expect(uiStore.hasAsset(selectedInstrument, asset)).toBeFalsy();
  });

  it('should return return as a default value for isPageVisible', () => {
    expect(uiStore.getPageVisibility()).toBeTruthy();
  });

  it('should change value to false for isPageVisible', () => {
    uiStore.setPageVisibility(false);
    expect(uiStore.getPageVisibility()).toBeFalsy();
  });

  it('should reset value for searchTerm and searchWalletName', () => {
    const text = 'some text';
    uiStore.search(text);
    expect(uiStore.searchTerm).toBe(text);

    const searchWallet = 'some watchlist';
    uiStore.searchWallet(searchWallet);
    expect(uiStore.searchWalletName).toBe(searchWallet);

    uiStore.reset();
    expect(uiStore.searchTerm).toBe('');
    expect(uiStore.searchWalletName).toBe(Watchlists.All);
  });

  describe('change selected instrument', () => {
    beforeEach(() => {
      uiStore.rootStore.orderBookStore.reset = jest.fn();
      uiStore.rootStore.orderBookStore.fetchAll = jest.fn();
      uiStore.rootStore.orderBookStore.subscribe = jest.fn();

      uiStore.rootStore.tradeStore.resetTrades = jest.fn();
      uiStore.rootStore.tradeStore.fetchTrades = jest.fn();
      uiStore.rootStore.tradeStore.resetPublicTrades = jest.fn();
      uiStore.rootStore.tradeStore.fetchPublicTrades = jest.fn();
      uiStore.rootStore.tradeStore.subscribeToPublicTrades = jest.fn();

      uiStore.rootStore.priceStore.fetchLastPrice = jest.fn();
      uiStore.rootStore.priceStore.fetchDailyCandle = jest.fn();
      uiStore.rootStore.priceStore.subscribeToDailyCandle = jest.fn();
      uiStore.rootStore.priceStore.reset = jest.fn();
    });

    it('should change selected instrument', () => {
      const newInstrument = new InstrumentModel({
        baseAsset: new AssetModel({name: 'BTC'}),
        id: 'BTCUSD',
        quoteAsset: new AssetModel({name: 'USD'})
      });
      uiStore.rootStore.referenceStore.getInstrumentById = (id: string) => {
        return [newInstrument].find(i => i.id === id);
      };
      expect(uiStore.selectedInstrument).not.toBeDefined();
      uiStore.selectInstrument('BTCUSD');
      expect(uiStore.selectedInstrument).toBeDefined();
      expect(uiStore.selectedInstrument).toBe(newInstrument);
    });
  });
});
