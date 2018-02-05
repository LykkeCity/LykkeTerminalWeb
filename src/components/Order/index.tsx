import {pathOr} from 'rambda';
import {connect} from '../connect';
import Order from './Order';

export interface OrderState {
  isMarketActive: boolean;
  isSellActive: boolean;
  quantityValue: string;
  pendingOrder: boolean;
  priceValue: string;
}

export interface OrderProps {
  addModal: any;
  ask: number;
  bid: number;
  accuracy: any;
  currency: string;
  placeOrder: any;
  name: string;
  stateFns: any[];
  getAssetById: any;
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
  isDisable: boolean;
  baseName: string;
  quantity: string;
  type: string;
}

export interface OrderActionProps {
  price: number;
  title: string;
  action: string;
  click: any;
  isActive: boolean;
}

export interface OrderFormProps {
  onChange: any;
  onArrowClick: any;
  isMarket: boolean;
  isDisable: boolean;
  action: string;
  onSubmit: any;
  assetName: string;
  quantity: string;
  price: string;
  amount: string;
}

const ConnectedOrder = connect(
  ({
    modalStore: {addModal},
    orderBookStore: {bestAsk, bestBid},
    orderStore: {placeOrder},
    uiStore: {selectedInstrument: instrument, stateFns},
    referenceStore
  }) => ({
    accuracy: {
      priceValue: pathOr(2, ['accuracy'], instrument),
      get quantityValue() {
        const asset = referenceStore.getAssetById(
          pathOr('', ['name'], instrument).split('/')[0]
        );
        return asset ? asset.accuracy : 2;
      }
    },
    addModal,
    ask: bestAsk(),
    bid: bestBid(),
    currency: pathOr('', ['id'], instrument),
    getAssetById: referenceStore.getAssetById,
    name: pathOr('', ['name'], instrument),
    placeOrder,
    stateFns
  }),
  Order
);

export {ConnectedOrder as Order};
