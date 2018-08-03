import {mount} from 'enzyme';
import React from 'react';
import {AssetModel, InstrumentModel, OrderType, Side} from '../../../models';
import Order from '../Order';

describe('<Order>', () => {
  window.analytics = {
    trackClick: jest.fn()
  };
  let ask: number;
  let bid: number;
  let accuracy: {
    priceAccuracy: number;
    quantityAccuracy: number;
    baseAssetAccuracy: number;
    quoteAssetAccuracy: number;
  };
  let currency: string;
  let placeOrder: any;
  let baseAssetName: string;
  let quoteAssetName: string;
  let baseAssetBalance: any;
  let quoteAssetBalance: any;
  let handlePercentageChange: any;
  let baseAssetId: string;
  let quoteAssetId: string;
  let isLimitInvalid: (
    baseAssetBalance: number,
    quoteAssetBalance: number
  ) => boolean;
  let isMarketInvalid: (
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetBalance: number,
    quoteAssetBalance: number
  ) => boolean;
  let instrument: InstrumentModel;
  let priceValue: string;
  let quantityValue: string;
  let handlePriceArrowClick: (operation: string) => void;
  let handleQuantityArrowClick: (operation: string) => void;
  let handleMarketQuantityArrowClick: (operation: string) => void;
  let handlePriceChange: (value: string) => void;
  let handleQuantityChange: (value: string) => void;
  let setMarket: (value: OrderType) => void;
  let setSide: (side: Side) => void;
  let currentMarket: OrderType;
  let isCurrentSideSell: boolean;
  let resetOrder: () => void;
  let isDisclaimerShown: boolean;
  let disclaimedAssets: string[];
  let setMarketTotal: (
    operationVolume?: any,
    operationType?: string,
    debounce?: boolean
  ) => void;
  let marketTotalPrice: number;
  let isEnoughLiquidity: boolean;
  let resetMarketTotal: () => void;
  let baseAsset: AssetModel;
  let convert: (
    amount: number,
    assetFrom: any,
    assetTo: any,
    getInstrumentById: (id: string) => InstrumentModel | undefined
  ) => number;
  let getInstrumentById: (id: string) => InstrumentModel | undefined;

  const getTestOrder = () => (
    <Order
      ask={ask}
      bid={bid}
      accuracy={accuracy}
      currency={currency}
      placeOrder={placeOrder}
      baseAssetName={baseAssetName}
      quoteAssetName={quoteAssetName}
      baseAssetBalance={baseAssetBalance}
      quoteAssetBalance={quoteAssetBalance}
      handlePercentageChange={handlePercentageChange}
      baseAssetId={baseAssetId}
      quoteAssetId={quoteAssetId}
      isLimitInvalid={isLimitInvalid}
      isMarketInvalid={isMarketInvalid}
      instrument={instrument}
      priceValue={priceValue}
      quantityValue={quantityValue}
      handlePriceArrowClick={handlePriceArrowClick}
      handleQuantityArrowClick={handleQuantityArrowClick}
      handleMarketQuantityArrowClick={handleMarketQuantityArrowClick}
      handlePriceChange={handlePriceChange}
      handleQuantityChange={handleQuantityChange}
      setMarket={setMarket}
      setSide={setSide}
      currentMarket={currentMarket}
      isCurrentSideSell={isCurrentSideSell}
      resetOrder={resetOrder}
      isDisclaimerShown={isDisclaimerShown}
      disclaimedAssets={disclaimedAssets}
      setMarketTotal={setMarketTotal}
      marketTotalPrice={marketTotalPrice}
      isEnoughLiquidity={isEnoughLiquidity}
      resetMarketTotal={resetMarketTotal}
      baseAsset={baseAsset}
      convert={convert}
      getInstrumentById={getInstrumentById}
    />
  );

  beforeEach(() => {
    ask = 1000;
    bid = 1000;
    accuracy = {
      priceAccuracy: 2,
      quantityAccuracy: 2,
      baseAssetAccuracy: 2,
      quoteAssetAccuracy: 2
    };
    currency = 'USD';
    placeOrder = jest.fn();
    baseAssetName = 'USD';
    quoteAssetName = 'BTC';
    baseAssetBalance = 15000;
    quoteAssetBalance = 5;
    handlePercentageChange = jest.fn();
    baseAssetId = '1';
    quoteAssetId = '2';
    isLimitInvalid = jest.fn(() => false);
    isMarketInvalid = jest.fn(() => false);
    instrument = new InstrumentModel({});
    priceValue = '8000';
    quantityValue = '3';
    handlePriceArrowClick = jest.fn();
    handleQuantityArrowClick = jest.fn();
    handleMarketQuantityArrowClick = jest.fn();
    handlePriceChange = jest.fn();
    handleQuantityChange = jest.fn();
    setMarket = jest.fn();
    setSide = jest.fn();
    currentMarket = OrderType.Market;
    isCurrentSideSell = false;
    resetOrder = jest.fn();
    isDisclaimerShown = false;
    disclaimedAssets = [];
    setMarketTotal = jest.fn();
    marketTotalPrice = 1000;
    isEnoughLiquidity = true;
    resetMarketTotal = jest.fn();
    baseAsset = new AssetModel({});
    convert = jest.fn();
    getInstrumentById = jest.fn();
  });

  describe('method render', () => {
    it('should render Buy and Sell option buttons', () => {
      const wrapper = mount(getTestOrder());
      expect(wrapper.find('ActionChoiceButton')).toHaveLength(2);
    });

    it('should render Buy and Sell option buttons in correct order', () => {
      const wrapper = mount(getTestOrder());
      const buttons = wrapper.find('ActionChoiceButton');
      const buyButtonProps = buttons.at(0).props() as any;
      const sellButtonProps = buttons.at(1).props() as any;
      expect(buyButtonProps.title).toBe('Buy');
      expect(sellButtonProps.title).toBe('Sell');
      expect(window.analytics.trackClick).toHaveBeenCalled();
    });
  });
});
