import ModalModel from '../../models/modalModel';
import OrderModel from '../../models/orderModel';
import {connect} from '../connect';
import EditOrder from './EditOrder';

export interface ConfirmModalProps {
  modal: ModalModel;
}

export interface ModalProps {
  modals: ModalModel[];
}

export interface EditOrderProps {
  modal: ModalModel;
  orders: OrderModel[];
  getInstrumentById: any;
  onArrowClick: any;
  onValueChange: any;
  fixedAmount: any;
  editOrder: any;
  resetPercentage: any;
  handlePercentageChange: any;
  getBalance: any;
  isLimitInvalid: (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) => boolean;
}

export interface EditOrderState {
  pendingOrder: boolean;
  priceValue: string;
  quantityValue: string;
  percents: any[];
}

const ConnectedEditOrderModal = connect(
  ({
    balanceListStore: {tradingWalletBalances: getBalance},
    orderListStore: {limitOrders: orders},
    referenceStore: {getInstrumentById},
    uiOrderStore: {
      onArrowClick,
      onValueChange,
      fixedAmount,
      resetPercentage,
      handlePercentageChange,
      isLimitInvalid
    },
    orderStore: {editOrder}
  }) => ({
    editOrder,
    fixedAmount,
    getBalance,
    getInstrumentById,
    handlePercentageChange,
    onArrowClick,
    onValueChange,
    orders,
    resetPercentage,
    isLimitInvalid
  }),
  EditOrder
);

export {ConnectedEditOrderModal as EditOrder};
