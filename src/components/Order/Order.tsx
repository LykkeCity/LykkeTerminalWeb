import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import keys from '../../constants/storageKeys';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import OrderType from '../../models/orderType';
import {StorageUtils, StringHelpers} from '../../utils/index';
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
  margin-top: ${rem(10)};
`;

const StyledActionChoice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: ${rem(10)};
`;

const StyledContentWrap = styled.div`
  padding: 15px 15px;
`;

const StyledSplitBlock = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: ${rem(14)};
  color: #13b72a;
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isMarketActive: true,
      isSellActive: true,
      pendingOrder: false,
      priceValue: '0',
      quantityValue: '0'
    };

    this.props.stateFns.push(this.handleChangeInstrument);
  }

  handleChangeInstrument = (instrument: InstrumentModel) => {
    const priceAccuracy = pathOr(2, ['accuracy'], instrument);
    const asset = this.props.getAssetById(
      pathOr('', ['name'], instrument).split('/')[0]
    );
    const quantityAccuracy = asset ? asset.accuracy : 2;

    this.setState({
      priceValue: parseFloat(this.state.priceValue).toFixed(priceAccuracy),
      quantityValue: parseFloat(this.state.quantityValue).toFixed(
        quantityAccuracy
      )
    });
  };

  handleActionClick = (action: string) => () => {
    this.setState({
      isSellActive: action === orderAction.sell.action
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
      .then(() => this.disableButton(false));
  };

  cancelOrder = () => {
    this.disableButton(false);
  };

  handleButtonClick = (action: string) => {
    this.disableButton(true);
    const baseName = this.props.name.split('/')[0];
    const quoteName = this.props.name.split('/')[1];
    const {quantityValue, priceValue} = this.state;
    const currentPrice = (
      parseFloat(quantityValue) * parseFloat(priceValue)
    ).toFixed(this.props.accuracy.priceValue);

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      return this.applyOrder(action, quantityValue, baseName, currentPrice);
    }
    const message = `${action} ${quantityValue} ${baseName} at ${currentPrice} ${quoteName}`;
    this.props.addModal(
      message,
      () => this.applyOrder(action, quantityValue, baseName, currentPrice),
      this.cancelOrder,
      Types.Confirm
    );
  };

  onArrowClick = (operation: string, field: string) => () => {
    const tempObj = {};
    const accuracy = this.props.accuracy[field];

    switch (operation) {
      case 'up':
        tempObj[field] = (
          parseFloat(this.state[field]) + Math.pow(10, -1 * accuracy)
        ).toFixed(accuracy);
        break;
      case 'down':
        let newVal =
          parseFloat(this.state[field]) - Math.pow(10, -1 * accuracy);
        newVal = newVal < 0 ? 0 : newVal;
        tempObj[field] = newVal.toFixed(accuracy);
        break;
    }
    this.setState(tempObj);
  };

  onChange = (field: string) => (e: any) => {
    let value = e.target.value;
    const accuracy = this.props.accuracy[field];
    if (!StringHelpers.isOnlyNumbers(value)) {
      return;
    }
    value = StringHelpers.substringZero(value);
    value = StringHelpers.substringMinus(value);

    if (StringHelpers.getPostDecimalsLength(value) > accuracy) {
      value = StringHelpers.substringLast(value);
    }
    value = value === '' ? '0' : value;

    const tempObj = {};
    tempObj[field] = value;
    this.setState(tempObj);
  };

  isInvalidValues = () => {
    return this.state.isMarketActive
      ? !+this.state.quantityValue
      : !+this.state.quantityValue || !+this.state.priceValue;
  };

  fixedAmount = (currentPrice: number) => {
    const amount = currentPrice * parseFloat(this.state.quantityValue);
    return amount === 0
      ? amount.toFixed(2)
      : amount.toFixed(this.props.accuracy.priceValue);
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

    return (
      <div>
        <StyledActionBlock>
          <StyledSplitBlock>
            {!Number.isNaN(spread) &&
              spread.toFixed(this.props.accuracy.priceValue)}
          </StyledSplitBlock>
          <OrderAction
            click={this.handleActionClick(orderAction.sell.action)}
            isActive={this.state.isSellActive}
            price={bid}
            {...orderAction.sell}
          />
          <OrderAction
            click={this.handleActionClick(orderAction.buy.action)}
            isActive={!this.state.isSellActive}
            price={ask}
            {...orderAction.buy}
          />
        </StyledActionBlock>

        <StyledContentWrap>
          <StyledActionChoice>
            <OrderChoiceButton
              title={MARKET}
              isActive={this.state.isMarketActive}
              click={this.handleActionChoiceClick(MARKET)}
            />
            <OrderChoiceButton
              title={LIMIT}
              isActive={!this.state.isMarketActive}
              click={this.handleActionChoiceClick(LIMIT)}
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
            amount={this.fixedAmount(currentPrice)}
            quantity={this.state.quantityValue}
            price={this.state.priceValue}
          />
        </StyledContentWrap>
      </div>
    );
  }
}

export default Order;
