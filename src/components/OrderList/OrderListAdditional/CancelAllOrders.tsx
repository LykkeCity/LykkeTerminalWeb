import {observer} from 'mobx-react';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {CancelAllOrderProps} from './index';

const StyledSpan = styled.span`
  font-size: ${rem(14)};
  line-height: 1.14;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  margin-right: 5px;
  color: #8c94a0;
  padding: ${rem(8)} ${rem(18)};
  cursor: not-allowed;

  &.clickable {
    color: #f5f6f7;
    cursor: pointer;
  }
`;

const CancelAllOrders: React.SFC<CancelAllOrderProps> = observer(
  ({cancelAll, hasOrders}) => {
    return (
      <StyledSpan
        className={hasOrders ? 'clickable' : ''}
        onClick={hasOrders ? cancelAll : null}
      >
        Cancel all
      </StyledSpan>
    );
  }
);

export default CancelAllOrders;
