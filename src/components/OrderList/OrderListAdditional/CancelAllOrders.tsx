import {observer} from 'mobx-react';
import * as React from 'react';
import OrdersDefaultSelection from '../../../models/ordersDefaultSelection';
import {CancelAllOrderProps} from './index';
import {CancelAllButton} from './styles';

const CancelAllOrders: React.SFC<CancelAllOrderProps> = observer(
  ({cancelAll, hasOrders, selectedOrderOptions}) => {
    const handleCancelAll = () => {
      const isCurrentAsset =
        selectedOrderOptions === OrdersDefaultSelection.CurrentAsset;

      cancelAll(isCurrentAsset);
    };

    return (
      <CancelAllButton
        className={hasOrders ? 'clickable' : ''}
        onClick={hasOrders ? handleCancelAll : null}
      >
        Cancel all
      </CancelAllButton>
    );
  }
);

export default CancelAllOrders;
