import * as React from 'react';
import {OrderModel, SortDirection} from '../../models';
import {HBar} from '../Bar';
import {EditOrder} from '../Modal';
import {
  checkDataForSorting,
  HeaderProps,
  sortData,
  TableHeader,
  TableSortState
} from '../Table';
import {OrderActions, OrderCellWidth, OrderList} from './';
import {CancelAllOrders, ToggleOrders} from './OrderListAdditional';
import OrderListToolbar from './OrderListToolbar';

interface OrdersProps extends OrderActions {
  addModal: any;
  cancelOrder: any;
  orders: OrderModel[];
}

interface OrdersState extends TableSortState {
  isEditModal: boolean;
}

class Blotter extends React.Component<OrdersProps, OrdersState> {
  private currentEditingOrder: OrderModel;

  constructor(props: OrdersProps) {
    super(props);
    this.state = {
      data: this.props.orders,
      sortByParam: '',
      sortDirection: SortDirection.ASC,
      isEditModal: false
    };
  }

  componentWillReceiveProps(args: any) {
    this.setState({
      data: args.orders
    });
  }

  sort = (sortByParam: string, sortDirectionDefault: string) => {
    this.setState(
      sortData(this.props.orders, sortByParam, sortDirectionDefault, this.state)
    );
  };

  handleEditOrder = (order: OrderModel) => (id: string) => {
    this.currentEditingOrder = order;
    this.setState({
      isEditModal: true
    });
  };

  handleCloseEditModal = () => {
    this.setState({
      isEditModal: false
    });
  };

  render() {
    const headers: HeaderProps[] = [
      {
        sortDisabled: checkDataForSorting(this.state.data, 'symbol'),
        key: 'symbol',
        value: 'Asset pair',
        width: OrderCellWidth.Symbol
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'price'),
        className: 'right-align',
        key: 'price',
        value: 'Price'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'volume'),
        className: 'right-align',
        key: 'volume',
        value: 'Amount'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'filled'),
        className: 'right-align',
        key: 'filled',
        value: 'Filled'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'value'),
        className: 'right-align',
        key: 'value',
        value: 'Value'
      },
      {
        sortDisabled: checkDataForSorting(this.state.data, 'createdAt'),
        className: 'right-align',
        key: 'createdAt',
        value: 'Time'
      },
      {
        sortDisabled: true,
        className: 'right-align',
        key: '',
        value: 'Actions',
        width: OrderCellWidth.Actions
      }
    ];

    return (
      <React.Fragment>
        <OrderListToolbar>
          <ToggleOrders />
          <CancelAllOrders />
        </OrderListToolbar>
        <HBar />
        <TableHeader
          currentSortDirection={this.state.sortDirection}
          currentSortByParam={this.state.sortByParam}
          headers={headers}
          onSort={this.sort}
        />
        <OrderList
          orders={this.state.data}
          onEditOrder={this.handleEditOrder}
          onCancelOrder={this.props.cancelOrder}
        />
        {this.state.isEditModal && (
          <EditOrder
            order={this.currentEditingOrder}
            onClose={this.handleCloseEditModal}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Blotter;
