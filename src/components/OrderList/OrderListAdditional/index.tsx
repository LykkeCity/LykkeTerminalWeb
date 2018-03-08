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
  ({orderListStore: {hasOrders}, orderStore: {cancelAll}}) => ({
    cancelAll,
    hasOrders
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
