import {connect} from '../../connect';
import CancelAllOrders from './CancelAllOrders';
import ToggleOrders from './ToggleOrders';

export interface CancelAllOrderProps {
  cancelAll: any;
  isOrderLength: boolean;
}

export interface ToggleOrdersProps {
  selectedOrderOptions: string;
  toggleOrders: any;
  toggleOrdersSelect: any;
  showOrdersSelect: boolean;
}

const ConnectedCancelAllOrders = connect(
  ({orderListStore: {isOrderLength}, orderStore: {cancelAll}}) => ({
    cancelAll,
    isOrderLength
  }),
  CancelAllOrders
);

const ConnectedToggleOrders = connect(
  ({
    orderListStore: {selectedOrderOptions, toggleOrders},
    uiStore: {toggleOrdersSelect, showOrdersSelect}
  }) => ({
    selectedOrderOptions,
    showOrdersSelect,
    toggleOrders,
    toggleOrdersSelect
  }),
  ToggleOrders
);

export {ConnectedCancelAllOrders as CancelAllOrders};
export {ConnectedToggleOrders as ToggleOrders};
