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
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <TableHeader
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'symbol'}
                onSort={this.sort}
              >
                Asset pair
              </TableHeader>
            </th>
            <th>Cancel order</th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'id'}
                onSort={this.sort}
              >
                OrderID
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'side'}
                onSort={this.sort}
              >
                Side
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'volume'}
                onSort={this.sort}
              >
                Volume
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'price'}
                onSort={this.sort}
              >
                Price
              </TableHeader>
            </th>
            <th>
              <TableHeader
                className={'right-align'}
                currentSortDirection={this.state.sortDirection}
                currentSortByParam={this.state.sortByParam}
                sortByParam={'createdAt'}
                onSort={this.sort}
              >
                Created Date
              </TableHeader>
            </th>
            <th>Edit</th>
          </tr>
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
