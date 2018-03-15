import {observable} from 'mobx';
import {curry} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ModalMessages from '../../constants/modalMessages';
import keys from '../../constants/storageKeys';
import {Order, OrderBookDisplayType} from '../../models';
import Types from '../../models/modals';
import {StorageUtils} from '../../utils/index';
import {minOrMaxFromList} from '../../utils/math';
import Bar, {VBar} from '../Bar/Bar';
import {Table} from '../Table/index';
import {OrderBookItem} from './';
import OrderBookSwitch from './OrderBookSwitch';
import {
  StyledBar,
  StyledBuyOrders,
  StyledGrouping,
  StyledHead,
  StyledHeader,
  StyledMidPrice,
  StyledRow,
  StyledSellOrders,
  StyledWrapper
} from './styles';

const confirmStorage = StorageUtils(keys.confirmReminder); // TODO: refactor to withStorage HOC

const mapToDisplayType = (displayType: OrderBookDisplayType) => (o: Order) =>
  o[displayType.toLowerCase()];

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

class OrderBook extends React.Component<OrderBookProps> {
  @observable displayType = OrderBookDisplayType.Volume;
  private scrollComponent: any;
  private midPrice: any;

  private refHandlers = {
    midPrice: (ref: any) => (this.midPrice = ref),
    scrollComponent: (ref: any) => (this.scrollComponent = ref)
  };
  private isScrollSet: boolean = false;

  constructor(props: OrderBookProps) {
    super(props);

    this.props.stateFns.push(this.clearScroll);
  }

  clearScroll = () => {
    this.isScrollSet = false;
  };

  handleChange = (displayType: OrderBookDisplayType) => {
    this.displayType = displayType;
  };

  cancelOrders = (connectedOrders: string[]) => {
    connectedOrders.forEach(id => this.props.cancelOrder(id));
  };

  componentDidUpdate() {
    if (this.isScrollSet) {
      return;
    }

    const scroll =
      this.midPrice.offsetTop - this.scrollComponent.container.offsetHeight / 2;
    this.scrollComponent.scrollTop(scroll);

    if (this.props.asks.length && this.props.bids.length && scroll > 0) {
      this.isScrollSet = true;
    }
  }

  handleUpdatePriceAndDepth = (price: number, depth: number) => () => {
    this.props.setIsOrderBookClicked(true);
    this.props.updatePriceAndDepth(price, depth);
  };

  handleUpdatePrice = (price: number) => () => {
    this.props.setIsOrderBookClicked(true);
    this.props.updatePrice(price);
  };

  handleCancelOrder = (connectedLimitOrders: string[]) => () => {
    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.cancelOrders(connectedLimitOrders);
    }

    const message = ModalMessages.cancelOrder(connectedLimitOrders);
    this.props.addModal(
      message,
      () => this.cancelOrders(connectedLimitOrders),
      // tslint:disable-next-line:no-empty
      () => {},
      Types.Confirm
    );
  };

  render() {
    const {
      bids,
      asks,
      mid,
      priceAccuracy,
      volumeAccuracy,
      span,
      onNextSpan,
      onPrevSpan
    } = this.props;

    const withCurrentType = mapToDisplayType(this.displayType);
    const fromBids = curry(minOrMaxFromList)(bids.map(withCurrentType));
    const maxBidValue = fromBids('max');
    const minBidValue = fromBids('min');

    const fromAsks = curry(minOrMaxFromList)(asks.map(withCurrentType));
    const maxAskValue = fromAsks('max');
    const minAskValue = fromAsks('min');

    return (
      <StyledWrapper>
        <StyledBar>
          <StyledGrouping>
            Grouping: <button onClick={onPrevSpan}>-</button>
            <strong>{span}</strong>
            <button onClick={onNextSpan}>+</button>
          </StyledGrouping>
          <VBar />
          <OrderBookSwitch
            value={this.displayType}
            onChange={this.handleChange}
          />
          {/* <VBar /> */}
        </StyledBar>
        <Bar />
        <Table>
          <StyledHead>
            <StyledRow>
              <StyledHeader align="right">Buy</StyledHeader>
              <StyledHeader align="center">Price</StyledHeader>
              <StyledHeader align="left">Sell</StyledHeader>
            </StyledRow>
          </StyledHead>
        </Table>
        <Scrollbars autoHide={true} ref={this.refHandlers.scrollComponent}>
          <Table>
            <StyledSellOrders>
              {asks.map((order, idx) => (
                <OrderBookItem
                  maxValue={maxAskValue}
                  minValue={minAskValue}
                  key={idx}
                  valueToShow={withCurrentType(order)}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onPriceClick={this.handleUpdatePrice}
                  onDepthClick={this.handleUpdatePriceAndDepth}
                  onOrderClick={this.handleCancelOrder}
                  {...order}
                />
              ))}
            </StyledSellOrders>
            <StyledMidPrice innerRef={this.refHandlers.midPrice}>
              <tr>
                <td onClick={this.handleUpdatePrice(Number(mid))}>
                  {Number.isNaN(Number.parseFloat(mid)) ? '' : mid}
                </td>
              </tr>
            </StyledMidPrice>
            <StyledBuyOrders>
              {bids.map((order, idx) => (
                <OrderBookItem
                  maxValue={maxBidValue}
                  minValue={minBidValue}
                  key={idx}
                  valueToShow={withCurrentType(order)}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onPriceClick={this.handleUpdatePrice}
                  onDepthClick={this.handleUpdatePriceAndDepth}
                  onOrderClick={this.handleCancelOrder}
                  {...order}
                />
              ))}
            </StyledBuyOrders>
          </Table>
        </Scrollbars>
      </StyledWrapper>
    );
  }
}

export default OrderBook;
