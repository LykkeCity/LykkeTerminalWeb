import {observable} from 'mobx';
import {curry} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ModalMessages from '../../constants/modalMessages';
import keys from '../../constants/storageKeys';
import {InstrumentModel, Order, OrderBookDisplayType} from '../../models';
import Types from '../../models/modals';
import {StorageUtils} from '../../utils/index';
import {minOrMaxFromList} from '../../utils/math';
import {HBar, VBar} from '../Bar';
import ClickOutside from '../ClickOutside/ClickOutside';
import {FAIcon} from '../Icon/Icon';
import {LoaderProps} from '../Loader/withLoader';
import {MyOrders, OrderBookItem} from './';
import OrderBookSwitch from './OrderBookSwitch';
import {
  Figure,
  FigureHint,
  FigureList,
  FigureValue,
  LastPriceValue,
  Levels,
  MidOverlay,
  MidOverlayBackground,
  MidPrice,
  Spread,
  StyledBar,
  StyledGrouping,
  StyledHeader,
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

export interface OrderBookProps extends LoaderProps {
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
  isAuth: boolean;
  selectedInstrument: InstrumentModel;
}

class OrderBook extends React.Component<OrderBookProps> {
  @observable displayType = OrderBookDisplayType.Volume;

  private scrollComponent: any;
  private askLevel: any;

  private nextScrollTop: number | undefined;
  private prevAsksHeight: number | undefined;

  componentWillReceiveProps(nextProps: OrderBookProps) {
    if (
      this.props.selectedInstrument &&
      this.props.selectedInstrument.id !== nextProps.selectedInstrument.id
    ) {
      this.nextScrollTop = undefined;
      this.prevAsksHeight = undefined;
    }
  }

  componentDidUpdate() {
    const asksHeight = this.askLevel.scrollHeight;
    const diff = asksHeight - (this.prevAsksHeight || 0);
    this.prevAsksHeight = this.askLevel.scrollHeight;
    const clientHeight = this.scrollComponent.getClientHeight();
    const midScrollTop = asksHeight - clientHeight / 2 + 30;
    if (clientHeight / 2 < asksHeight) {
      if (this.nextScrollTop !== undefined) {
        this.scrollComponent.scrollTop(this.nextScrollTop + diff);
      } else {
        this.scrollComponent.scrollToTop();
        this.scrollComponent.scrollTop(midScrollTop);
      }
    }
  }

  handleStopScroll = () => {
    this.nextScrollTop = this.scrollComponent.getScrollTop();
  };

  handleChangeDisplayType = (displayType: OrderBookDisplayType) => {
    this.displayType = displayType;
  };

  cancelOrders = (connectedOrders: string[]) => {
    connectedOrders.forEach(id => this.props.cancelOrder(id));
  };

  handleUpdatePriceAndDepth = (price: number, depth: number) => () => {
    if (this.props.isAuth) {
      this.props.updatePriceAndDepth(price, depth);
    }
  };

  handleUpdatePrice = (price: number) => (e: React.SyntheticEvent<any>) => {
    if (this.props.isAuth) {
      this.props.updatePrice(price);
      e.stopPropagation();
    }
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
    this.props.showMyOrders({orders: []});
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
      lastTradePrice,
      loading,
      isAuth
    } = this.props;

    const withCurrentType = mapToDisplayType(this.displayType);
    const fromOrders = curry(minOrMaxFromList)(
      [...bids, ...asks].map(withCurrentType)
    );
    const maxValue = fromOrders('max');
    const minValue = fromOrders('min');

    return (
      <StyledWrapper>
        <StyledBar>
          <StyledGrouping>
            Grouping:{' '}
            <button onClick={onPrevSpan}>
              <FAIcon name="minus" />
            </button>
            <div>
              {span.toLocaleString(undefined, {
                maximumFractionDigits: priceAccuracy
              })}
            </div>
            <button onClick={onNextSpan}>
              <FAIcon name="plus" />
            </button>
          </StyledGrouping>
          <VBar />
          <OrderBookSwitch
            value={this.displayType}
            onChange={this.handleChangeDisplayType}
          />
        </StyledBar>
        <HBar />
        <StyledHeader>
          <tbody>
            <tr>
              <th>Price</th>
              <th>Volume</th>
              <th>Value</th>
            </tr>
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
          ref={el => (this.scrollComponent = el)}
          onScrollStop={this.handleStopScroll}
        >
          <div>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <Levels innerRef={(el: any) => (this.askLevel = el)}>
              <tbody>
                {asks.map((order, idx) => (
                  <OrderBookItem
                    key={idx}
                    valueToShow={withCurrentType(order)}
                    maxValue={maxValue}
                    minValue={minValue}
                    priceAccuracy={priceAccuracy}
                    volumeAccuracy={volumeAccuracy}
                    onPriceClick={this.handleUpdatePrice}
                    onDepthClick={this.handleUpdatePriceAndDepth}
                    onOrderClick={this.handleCancelOrder}
                    showMyOrders={showMyOrders}
                    scrollComponent={this.scrollComponent}
                    prevPrice={
                      idx === asks.length - 1
                        ? order.price
                        : asks[idx + 1].price
                    }
                    isAuth={isAuth}
                    {...order}
                  />
                ))}
              </tbody>
            </Levels>
            {loading || (
              <React.Fragment>
                <FigureList>
                  <Figure
                    isAuth={isAuth}
                    onClick={this.handleUpdatePrice(Number(lastTradePrice))}
                  >
                    <LastPriceValue>
                      {formatNumber(lastTradePrice, priceAccuracy)}
                    </LastPriceValue>
                    <FigureHint>Last price</FigureHint>
                  </Figure>
                  <MidPrice
                    isAuth={isAuth}
                    onClick={this.handleUpdatePrice(Number(mid))}
                  >
                    <FigureValue>
                      {formatNumber(mid, priceAccuracy)}
                    </FigureValue>
                    <FigureHint>Mid price</FigureHint>
                  </MidPrice>
                  <Spread>
                    <FigureValue>
                      {formatNumber(spreadRelative, priceAccuracy, {
                        style: 'percent'
                      })}
                    </FigureValue>
                    <FigureHint>Spread</FigureHint>
                  </Spread>
                  <MidOverlay />
                  <MidOverlayBackground />
                </FigureList>
              </React.Fragment>
            )}
            <Levels>
              <tbody>
                {bids.map((order, idx) => (
                  <OrderBookItem
                    key={idx}
                    valueToShow={withCurrentType(order)}
                    maxValue={maxValue}
                    minValue={minValue}
                    priceAccuracy={priceAccuracy}
                    volumeAccuracy={volumeAccuracy}
                    onPriceClick={this.handleUpdatePrice}
                    onDepthClick={this.handleUpdatePriceAndDepth}
                    onOrderClick={this.handleCancelOrder}
                    showMyOrders={showMyOrders}
                    scrollComponent={this.scrollComponent}
                    askLevel={this.askLevel}
                    prevPrice={idx === 0 ? order.price : bids[idx - 1].price}
                    isAuth={isAuth}
                    {...order}
                  />
                ))}
              </tbody>
            </Levels>
          </div>
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
