import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {OrderModel, Side} from '../../models/index';
import Types from '../../models/modals';
import {Icon} from '../Icon/index';
import {ReactStyledTable} from '../Table/index';
import {OrderActions} from './';

interface OrderListProps extends OrderActions {
  orders?: OrderModel[];
  addModal: any;
}

const OrderList: React.SFC<OrderListProps> = ({
  orders = [],
  cancelOrder,
  addModal
}) => {
  const data = [...orders];
  const columns = [
    {
      Header: 'Asset pair',
      accessor: 'symbol',
      className: 'left-align no-border',
      headerClassName: 'left-align header no-border',
      minWidth: 65
    },
    {
      Cell: (props: any) => (
        // tslint:disable-next-line:jsx-no-lambda
        <span onClick={() => cancelOrder!(props.original.id)}>
          <Icon name="cross" />
        </span>
      ),
      Header: 'Cancel order',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 55
    },
    {
      Header: 'OrderID',
      accessor: 'id',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 280
    },
    {
      Cell: (props: any) => {
        const colorSide =
          props.original.side === Side.Buy ? '#fb8f01' : '#d070ff';
        return <span style={{color: colorSide}}>{props.original.side}</span>;
      },
      Header: 'Side',
      accessor: 'side',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40
    },
    {
      Header: 'Volume',
      accessor: 'volume',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 60
    },
    {
      Header: 'Price',
      accessor: 'price',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 45
    },
    {
      Cell: (props: any) => (
        <span>{props.original.createdAt.toLocaleString()}</span>
      ),
      Header: 'Created Date',
      accessor: 'createdAt',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 155
    },
    {
      Cell: (props: any) => (
        // tslint:disable-next-line:jsx-no-lambda
        <span onClick={() => handleEditOrder(props.original)}>
          <Icon name="pencil" />
        </span>
      ),
      Header: 'Edit',
      className: 'right-align no-border',
      headerClassName: 'right-align header no-border',
      minWidth: 40
    }
  ];
  const handleEditOrder = (order: any) => {
    addModal(
      order.id,
      // tslint:disable-next-line:no-empty
      () => {},
      // tslint:disable-next-line:no-empty
      () => {},
      Types.EditOrder,
      order
    );
  };

  return (
    <ReactStyledTable>
      <ReactTable
        data={data}
        columns={columns}
        className={'no-border table'}
        showPagination={false}
        pageSize={data.length}
      />
    </ReactStyledTable>
  );
};

export default OrderList;
