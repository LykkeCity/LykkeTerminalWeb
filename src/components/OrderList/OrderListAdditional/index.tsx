import {connect} from '../../connect';
import CancelAllOrders from './CancelAllOrders';
import ToggleOrders from './ToggleOrders';

export interface CancelAllOrderProps {
  cancelAll: any;
  isOrderLength: boolean;
  selectedOrderOptions: string;
}

export interface ToggleOrdersProps {
  selectedOrderOptions: string;
  toggleOrders: any;
  toggleOrdersSelect: any;
  showOrdersSelect: boolean;
}

const ConnectedCancelAllOrders = connect(
  ({
    orderListStore: {hasOrders, selectedOrderOptions},
    orderStore: {cancelAll}
  }) => ({
    cancelAll,
    hasOrders,
    selectedOrderOptions
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
