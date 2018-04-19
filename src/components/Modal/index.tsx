import styled from 'styled-components';
import ModalModel from '../../models/modalModel';
import OrderModel from '../../models/orderModel';
import {connect} from '../connect';
import EditOrder from './EditOrder';

const StyledModal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: 20px 25px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  border-radius: 12px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 30;
  min-width: 360px;
`;

const Button = styled.button`
  color: #f5f6f7;
  width: 152px;
  height: 49px;
  border-radius: 4px;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

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
    balanceListStore: {availableBalance: getBalance},
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

export {StyledModal, Button};
export {ConnectedEditOrderModal as EditOrder};
