import {pathOr} from 'rambda';
import {connect} from '../connect';
import Order from './Order';

export interface OrderState {
  isMarketActive: boolean;
  isSellActive: boolean;
  quantityValue: number;
  pendingOrder: boolean;
  priceValue: number;
  stopLoss: number;
  takeProfit: number;
}

export interface OrderProps {
  addModal: any;
  ask: number;
  bid: number;
  accuracy: any;
  currency: string;
  placeOrder: any;
  name: string;
}

export interface OrderOptionProps {
  title: string;
  amount: string;
  isAmountable: boolean;
  isOptional: boolean;
  tumblerValues: string[];
  change: any;
  inputValue: number;
  quoteName: string;
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
  price: string;
  click: any;
  isDisable: boolean;
  baseName: string;
  quoteName: string;
  quantity: number;
}

export interface OrderActionProps {
  price: number;
  title: string;
  action: string;
  click: any;
  isActive: boolean;
}

const ConnectedOrder = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {bestAsk, bestBid},
    orderStore: {placeOrder},
    uiStore: {selectedInstrument: instrument},
    referenceStore
  }) => ({
    accuracy: {
      priceValue: pathOr(2, ['accuracy'], instrument),
      quantityValue: referenceStore.getBaseAssetAccuracy
    },
    addModal,
    ask: bestAsk(),
    bid: bestBid(),
    currency: pathOr('', ['id'], instrument),
    name: pathOr('', ['name'], instrument),
    placeOrder
  }),
  Order
);

export {ConnectedOrder as Order};
