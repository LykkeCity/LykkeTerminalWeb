import {observer} from 'mobx-react';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import OrdersDefaultSelection from '../../../models/ordersDefaultSelection';
import {colors, dims, fonts, padding} from '../../styled';
import {CancelAllOrderProps} from './index';

const StyledSpan = styled.span`
  font-size: ${rem(fonts.normal)};
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  color: #8c94a0;
  padding: ${padding(...dims.padding)};
  cursor: not-allowed;

  &.clickable {
    color: ${colors.white};
    cursor: pointer;
  }
` as any;

const CancelAllOrders: React.SFC<CancelAllOrderProps> = observer(
  ({cancelAll, hasOrders, selectedOrderOptions}) => {
    const handleCancelAll = () => {
      const currentAsset =
        selectedOrderOptions === OrdersDefaultSelection.CurrentAsset;

      cancelAll(currentAsset);
    };

    return (
      <StyledSpan
        className={hasOrders ? 'clickable' : ''}
        onClick={hasOrders ? handleCancelAll : null}
      >
        Cancel all
      </StyledSpan>
    );
  }
);

export default CancelAllOrders;
