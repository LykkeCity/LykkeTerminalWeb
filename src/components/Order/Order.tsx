import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import {FormattedNumber} from 'react-intl';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import keys from '../../constants/storageKeys';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import OrderType from '../../models/orderType';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderAction from './OrderAction';
import OrderChoiceButton from './OrderChoiceButton';
import {default as OrderForm} from './OrderForm';

const confirmStorage = StorageUtils(keys.confirmReminder);

const MARKET = OrderType.Market;
const LIMIT = OrderType.Limit;

const StyledActionBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  margin: ${rem(-10)} ${rem(-15)} ${rem(18)};
`;

const StyledActionChoice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${rem(16)};
`;

const StyledContentWrap = styled.div``;

const StyledSplitBlock = styled.div`
  font-family: 'Akrobat', sans-serif;
  position: absolute;
  left: 50%;
  top: 54%;
  transform: translateX(-50%) translateY(-50%);
  font-size: ${rem(24)};
  font-weight: 600;
  line-height: 1;
  color: #fff;
  text-align: center;

  small {
    font-size: ${rem(14)};
    opacity: 0.4;
  }
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isMarketActive: false,
      isSellActive: true,
      pendingOrder: false,
      priceValue: '0',
      quantityValue: '0'
    };

    this.props.stateFns.push(this.handleChangeInstrument);
    this.props.updatePriceFn(this.updatePriceByOrderBook);
    this.props.updateDepthFn(this.updateDepthByOrderBook);
    this.props.initPriceFn(this.initPriceUpdate);
  }

  initPriceUpdate = (price: number = 0, instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    this.setState({
      priceValue: price.toFixed(priceAccuracy)
    });
  };

  handleChangeInstrument = (instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    const asset = this.props.getAssetById(
      pathOr('', ['name'], instrument).split('/')[0]
    );
    const quantityAccuracy = asset ? asset.accuracy : 2;
    const price = instrument.price ? instrument.price : 0;
    this.setState({
      priceValue: price.toFixed(priceAccuracy),
      quantityValue: parseFloat('0').toFixed(quantityAccuracy)
    });
  };

  handleActionClick = (action: string, price: number) => () => {
    const tempObj: any = {
      isSellActive: action === orderAction.sell.action
    };
    this.setState(tempObj);
  };

  updatePriceByOrderBook = (price: number) => {
    this.setState({
      priceValue: price.toFixed(this.props.accuracy.priceValue)
    });
  };

  updateDepthByOrderBook = (quantity: number) => {
    this.setState({
      quantityValue: quantity.toFixed(this.props.accuracy.quantityValue)
    });
  };

  handleActionChoiceClick = (choice: string) => () => {
    this.setState({
      isMarketActive: choice === MARKET
    });
  };

  disableButton = (value: boolean) => {
    this.setState({
      pendingOrder: value
    });
  };

  applyOrder = (
    action: string,
    quantity: string,
    baseName: string,
    price: string
  ) => {
    const orderType = this.state.isMarketActive ? MARKET : LIMIT;
    const body: any = {
      AssetId: baseName,
      AssetPairId: this.props.currency,
      OrderAction: action,
      Volume: parseFloat(quantity)
    };

    if (!this.state.isMarketActive) {
      body.Price = parseFloat(price);
    }

    this.props
      .placeOrder(orderType, body)
      .then(() => this.disableButton(false))
      .catch(() => this.disableButton(false));
  };

  cancelOrder = () => {
    this.disableButton(false);
  };

  handleButtonClick = (action: string) => {
    this.disableButton(true);
    const baseName = this.props.name.split('/')[0];
    const quoteName = this.props.name.split('/')[1];
    const {quantityValue, priceValue} = this.state;
    const currentPrice = parseFloat(priceValue).toFixed(
      this.props.accuracy.priceValue
    );

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(action, quantityValue, baseName, currentPrice);
    }
    const messageSuffix = this.state.isMarketActive
      ? 'at the market price'
      : `at the price of ${currentPrice} ${quoteName}`;
    const message = `${action} ${quantityValue} ${baseName} ${messageSuffix}`;
    this.props.addModal(
      message,
      () => this.applyOrder(action, quantityValue, baseName, currentPrice),
      this.cancelOrder,
      Types.Confirm
    );
  };

  onArrowClick = (operation: string, field: string) => () => {
    this.setState(
      this.props.onArrowClick({
        accuracy: this.props.accuracy[field],
        field,
        operation,
        value: this.state[field]
      })
    );
  };

  onChange = (field: string) => (e: any) => {
    this.setState(
      this.props.onValueChange({
        accuracy: this.props.accuracy[field],
        field,
        value: e.target.value
      })
    );
  };

  isInvalidValues = () => {
    return this.state.isMarketActive
      ? !+this.state.quantityValue
      : !+this.state.quantityValue || !+this.state.priceValue;
  };

  fixedValue = (value: any) => {
    return parseFloat(value) === 0 ? parseFloat(value).toFixed(2) : value + '';
  };

  render() {
    const {action} = this.state.isSellActive
      ? orderAction.sell
      : orderAction.buy;
    const currentPrice =
      (this.state.isMarketActive
        ? this.state.isSellActive ? this.props.bid : this.props.ask
        : parseFloat(this.state.priceValue)) || 0;
    const {bid, ask} = this.props;
    const spread = ask - bid;
    const spreadDiff = (ask - bid) / ask * 100;

    return (
      <div>
        <StyledActionBlock>
          <StyledSplitBlock>
            {Number.isNaN(spread) || (
              <div>
                <FormattedNumber
                  value={+spread.toFixed(this.props.accuracy.priceValue)}
                />
              </div>
            )}
            {Number.isNaN(spreadDiff) || (
              <small>
                <FormattedNumber
                  value={+spreadDiff.toFixed(this.props.accuracy.priceValue)}
                />%
              </small>
            )}
          </StyledSplitBlock>
          <OrderAction
            click={this.handleActionClick(orderAction.sell.action, bid)}
            isActive={this.state.isSellActive}
            price={bid}
            {...orderAction.sell}
          />
          <OrderAction
            click={this.handleActionClick(orderAction.buy.action, ask)}
            isActive={!this.state.isSellActive}
            price={ask}
            {...orderAction.buy}
          />
        </StyledActionBlock>

        <StyledContentWrap>
          <StyledActionChoice>
            <OrderChoiceButton
              title={LIMIT}
              isActive={!this.state.isMarketActive}
              click={this.handleActionChoiceClick(LIMIT)}
            />
            <OrderChoiceButton
              title={MARKET}
              isActive={this.state.isMarketActive}
              click={this.handleActionChoiceClick(MARKET)}
            />
          </StyledActionChoice>

          <OrderForm
            assetName={this.props.name}
            isMarket={this.state.isMarketActive}
            isDisable={this.state.pendingOrder || this.isInvalidValues()}
            action={action}
            onSubmit={this.handleButtonClick}
            onChange={this.onChange}
            onArrowClick={this.onArrowClick}
            amount={this.props.fixedAmount(
              currentPrice,
              this.state.quantityValue,
              this.props.accuracy.priceValue
            )}
            quantity={this.state.quantityValue}
            price={this.state.priceValue}
          />
        </StyledContentWrap>
      </div>
    );
  }
}

export default Order;
