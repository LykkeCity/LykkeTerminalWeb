import * as React from 'react';
import {StyledBar, StyledGrouping, StyledWrapper} from '../OrderBook/styles';

class OrderBookChart extends React.Component {
  render() {
    return (
      <StyledWrapper>
        <StyledBar>
          <StyledGrouping>
            Grouping: <button>-</button>
            <strong>1</strong>
            <button>+</button>
          </StyledGrouping>
        </StyledBar>
      </StyledWrapper>
    );
  }
}

export default OrderBookChart;
