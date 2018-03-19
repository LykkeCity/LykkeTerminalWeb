import {observable} from 'mobx';
import * as React from 'react';
import {Order, OrderBookDisplayType} from '../../models';
import {StyledBar, StyledGrouping, StyledWrapper} from '../OrderBook/styles';

interface OrderBookProps {
  addModal: any;
  asks: Order[];
  bids: Order[];
  mid: string;
  priceAccuracy: number;
  volumeAccuracy: number;
  updatePrice: any;
  updatePriceAndDepth: any;
  stateFns: any[];
  cancelOrder: any;
  setIsOrderBookClicked: any;
  span: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
}

class OrderBookChart extends React.Component<OrderBookProps> {
  @observable displayType = OrderBookDisplayType.Volume;

  constructor(props: OrderBookProps) {
    super(props);
  }

  render() {
    const {span, onNextSpan, onPrevSpan} = this.props;

    return (
      <StyledWrapper>
        <StyledBar>
          <StyledGrouping>
            Grouping: <button onClick={onPrevSpan}>-</button>
            <strong>{span}</strong>
            <button onClick={onNextSpan}>+</button>
          </StyledGrouping>
        </StyledBar>
      </StyledWrapper>
    );
  }
}

export default OrderBookChart;
