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
import {HBar, VBar} from '../Bar';
import ClickOutside from '../ClickOutside/ClickOutside';
import {FAIcon} from '../Icon/Icon';
import {MyOrders, OrderBookItem} from './';
import OrderBookSwitch from './OrderBookSwitch';
import {
  MidFigures,
  MidOverlay,
  StyledBar,
  StyledBuyOrders,
  StyledGrouping,
  StyledHeader,
  StyledHeaderCell,
  StyledHeaderRow,
  StyledMidPrice,
  StyledOrders,
  StyledSellOrders,
  StyledWrapper
} from './styles';

const confirmStorage = StorageUtils(keys.confirmReminder); // TODO: refactor to withStorage HOC

const mapToDisplayType = (displayType: OrderBookDisplayType) => (o: Order) =>
  o[displayType.toLowerCase()];

const formatNumber = (
  num: number | string,
  accuracy: number,
  options?: object
) =>
  (isFinite(Number(num)) &&
    Number(num).toLocaleString(undefined, {
      maximumFractionDigits: accuracy,
      ...options
    })) ||
  '--';

interface OrderBookProps {
  addModal: any;
  asks: Order[];
  bids: Order[];
  mid: string;
  spread: number;
  spreadRelative: number;
  priceAccuracy: number;
  volumeAccuracy: number;
  updatePrice: any;
  updatePriceAndDepth: any;
  stateFns: any[];
  cancelOrder: any;
  span: number;
  onNextSpan: () => void;
  onPrevSpan: () => void;
  showMyOrders: any;
  lastTradePrice: number;
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
    this.props.updatePriceAndDepth(price, depth);
  };

  handleUpdatePrice = (price: number) => () => {
    this.props.updatePrice(price);
  };

  handleCancelOrder = (connectedLimitOrders: string[]) => () => {
    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.cancelOrders(connectedLimitOrders);
    }

    this.props.showMyOrders({orders: []});

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
      spreadRelative,
      priceAccuracy,
      volumeAccuracy,
      span,
      onNextSpan,
      onPrevSpan,
      showMyOrders,
      lastTradePrice
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
            Grouping:{' '}
            <button onClick={onPrevSpan}>
              <FAIcon name="minus" />
            </button>
            <div>{span}</div>
            <button onClick={onNextSpan}>
              <FAIcon name="plus" />
            </button>
          </StyledGrouping>
          <VBar />
          <OrderBookSwitch
            value={this.displayType}
            onChange={this.handleChange}
          />
        </StyledBar>
        <HBar />
        <StyledHeader>
          <tbody>
            <StyledHeaderRow>
              <StyledHeaderCell align="left">Price</StyledHeaderCell>
              <StyledHeaderCell align="left">Volume</StyledHeaderCell>
              <StyledHeaderCell align="right">Value</StyledHeaderCell>
            </StyledHeaderRow>
          </tbody>
        </StyledHeader>
        <HBar />
        <Scrollbars
          autoHide={true}
          style={{
            width: 'calc(100% + 2rem)',
            marginLeft: '-1rem',
            height: 'calc(100% - 5.2rem)'
          }}
          ref={this.refHandlers.scrollComponent}
        >
          <StyledOrders>
            <StyledSellOrders>
              {asks.map((order, idx) => (
                <OrderBookItem
                  key={idx}
                  valueToShow={withCurrentType(order)}
                  maxValue={maxAskValue}
                  minValue={minAskValue}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onPriceClick={this.handleUpdatePrice}
                  onDepthClick={this.handleUpdatePriceAndDepth}
                  onOrderClick={this.handleCancelOrder}
                  showMyOrders={showMyOrders}
                  {...order}
                  scrollComponent={this.scrollComponent}
                />
              ))}
            </StyledSellOrders>
            <tbody ref={this.refHandlers.midPrice}>
              <tr>
                <StyledMidPrice
                  onClick={this.handleUpdatePrice(Number(mid))}
                  colSpan={3}
                >
                  <MidFigures>
                    <strong>
                      {formatNumber(lastTradePrice, priceAccuracy)}
                    </strong>
                    <small>
                      {formatNumber(mid, priceAccuracy)}
                      <br />
                      <span>Mid price</span>
                    </small>
                    <small>
                      {formatNumber(spreadRelative, priceAccuracy, {
                        style: 'percent'
                      })}
                      <br />
                      <span>Spread</span>
                    </small>
                  </MidFigures>
                  <MidOverlay />
                </StyledMidPrice>
              </tr>
            </tbody>
            <StyledBuyOrders>
              {bids.map((order, idx) => (
                <OrderBookItem
                  key={idx}
                  valueToShow={withCurrentType(order)}
                  maxValue={maxBidValue}
                  minValue={minBidValue}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onPriceClick={this.handleUpdatePrice}
                  onDepthClick={this.handleUpdatePriceAndDepth}
                  onOrderClick={this.handleCancelOrder}
                  showMyOrders={showMyOrders}
                  scrollComponent={this.scrollComponent}
                  {...order}
                />
              ))}
            </StyledBuyOrders>
          </StyledOrders>
        </Scrollbars>
        <ClickOutside
          // tslint:disable-next-line:jsx-no-lambda
          onClickOutside={() =>
            showMyOrders({
              orders: []
            })
          }
        >
          <MyOrders />
        </ClickOutside>
      </StyledWrapper>
    );
  }
}

export default OrderBook;
