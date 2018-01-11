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
    orderBookStore: {bestAsk, bestBid},
    uiStore: {selectedInstrument: instrument}
  }) => ({
    accuracy: (instrument && instrument!.accuracy) || 2,
    ask: bestAsk(),
    bid: bestBid(),
    currency: (instrument && instrument!.id) || ''
  }),
  Order
);

export {connectedOrder as Order};
