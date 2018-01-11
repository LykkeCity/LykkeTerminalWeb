import {pathOr} from 'rambda';
import {connect} from '../connect';
import Order from './Order';

export interface OrderState {
  isMarketActive: boolean;
  isSellActive: boolean;
  quantityValue: number;
  priceValue: number;
  stopLoss: number;
  takeProfit: number;
}

export interface OrderProps {
  ask: number;
  bid: number;
  accuracy: number;
  currency: string;
  placeOrder: any;
}

export interface OrderOptionProps {
  title: string;
  isOptional: boolean;
  tumblerValues: string[];
  change: any;
  inputValue: number;
}

export interface OrderTumbler {
  tumblers: string[];
}

export interface OrderHeaderProps {
  orderCurrency: string;
  click: any;
}

export interface OrderChoiceButtonProps {
  title: string;
  click: any;
  isActive: boolean;
}

export interface OrderButtonProps {
  action: string;
  price: number;
  click: any;
}

export interface OrderActionProps {
  price: number;
  title: string;
  action: string;
  click: any;
  isActive: boolean;
}

const connectedOrder = connect(
  ({
<<<<<<< HEAD
    orderBookStore: {bestAsk, bestBid},
    orderStore: {placeOrder},
    uiStore: {selectedInstrument: instrument}
  }) => ({
    accuracy: pathOr(2, ['accuracy'], instrument),
    ask: bestAsk(),
    bid: bestBid(),
    currency: pathOr('', ['id'], instrument),
    placeOrder
=======
    orderBookStore: {maxAskValue, maxBidValue, instrument},
    orderStore: {executeOperation},
    uiStore: {selectedInstrument}
  }) => ({
    ask: maxAskValue,
    bid: maxBidValue,
    executeOperation,
    selectedInstrument
>>>>>>> 7fa5301... implement mocks for orders
  }),
  Order
);

export {connectedOrder as Order};
