import * as React from 'react';
import {OrderListItem} from '.';
import {OrderModel} from '../../models';
import {sortData, Table, TableHeader, TableSortState} from '../Table';

interface OrderListProps {
  orders: OrderModel[];
  onEditOrder: (order: OrderModel) => (id: string) => void;
  onCancelOrder?: (id: string) => void;
}
class OrderList extends React.Component<OrderListProps, TableSortState> {
  constructor(props: OrderListProps) {
    super(props);
    this.state = {
      data: this.props.orders,
      sortByParam: '',
      sortDirection: 'ASC'
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

  render() {
    const headers: any[] = [
      {key: 'symbol', value: 'Asset pair'},
      {sortDisabled: true, key: '', value: 'Cancel order'},
      {className: 'right-align', key: 'id', value: 'OrderID'},
      {className: 'right-align', key: 'side', value: 'Side'},
      {className: 'right-align', key: 'volume', value: 'Volume'},
      {className: 'right-align', key: 'price', value: 'Price'},
      {className: 'right-align', key: 'createdAt', value: 'Created Date'},
      {className: 'right-align', sortDisabled: true, key: '', value: 'Edit'}
    ];

    return (
      <Table>
        <thead>
          <TableHeader
            backgroundColor={'rgb(51, 51, 51)'}
            currentSortDirection={this.state.sortDirection}
            currentSortByParam={this.state.sortByParam}
            headers={headers}
            onSort={this.sort}
          />
        </thead>
        <tbody>
          {this.state.data.map(order => (
            <OrderListItem
              key={order.id}
              cancelOrder={this.props.onCancelOrder}
              onEdit={this.props.onEditOrder(order)}
              {...order}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default OrderList;
