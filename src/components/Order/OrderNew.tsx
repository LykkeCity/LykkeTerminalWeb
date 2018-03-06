import {rem} from 'polished';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import keys from '../../constants/storageKeys';
import InstrumentModel from '../../models/instrumentModel';
import Types from '../../models/modals';
import OrderType from '../../models/orderType';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderActionButton from './OrderActionButton';
import OrderChoiceButton from './OrderChoiceButton';
import {default as OrderForm} from './OrderForm';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const confirmStorage = StorageUtils(keys.confirmReminder);

const percentage = [
  {
    isActive: true,
    percent: 25
  },
  {
    isActive: false,
    percent: 50
  },
  {
    isActive: false,
    percent: 75
  },
  {
    isActive: false,
    percent: 100
  }
];

const MARKET = OrderType.Market;
const LIMIT = OrderType.Limit;

const StyledMarkets = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${rem(16)};
`;

const StyledActions = StyledMarkets.extend`
  justify-content: center;
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      buyValue: '0',
      isMarketActive: false,
      isSellActive: true,
      pendingOrder: false,
      percents: percentage,
      priceValue: '0',
      quantityValue: '0',
      sellValue: '0'
    };

    this.props.stateFns.push(this.handleChangeInstrument);
    this.props.updatePriceFn(this.updatePriceByOrderBook);
    this.props.initPriceFn(this.initPriceUpdate);
  }

  initPriceUpdate = (price: number, instrument: InstrumentModel) => {
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
      buyValue: parseFloat('0').toFixed(quantityAccuracy),
      priceValue: price.toFixed(priceAccuracy),
      sellValue: parseFloat('0').toFixed(quantityAccuracy)
    });
  };

  handleActionClick = (action: string, price: number) => () => {
    this.setState({
      isSellActive: action === orderAction.sell.action,
      priceValue: price.toFixed(this.props.accuracy.priceValue)
    });
  };

  updatePriceByOrderBook = (price: number, quantity: number) => {
    this.setState({
      priceValue: price.toFixed(this.props.accuracy.priceValue),
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

  onArrowClick = (accuracy: number) => (
    operation: string,
    field: string
  ) => () => {
    const tempObj = this.props.onArrowClick({
      accuracy,
      field,
      operation,
      value: this.state[field]
    });
    if (field === 'sellValue') {
      if (this.state.isSellActive) {
        tempObj.buyValue = (tempObj.sellValue * +this.state.priceValue).toFixed(
          accuracy
        );
      } else {
        tempObj.buyValue = (tempObj.sellValue / +this.state.priceValue).toFixed(
          accuracy
        );
      }
    } else {
      if (this.state.isSellActive) {
        tempObj.sellValue = (tempObj.buyValue / +this.state.priceValue).toFixed(
          accuracy
        );
      } else {
        tempObj.sellValue = (tempObj.buyValue * +this.state.priceValue).toFixed(
          accuracy
        );
      }
    }
    this.setState(tempObj);
  };

  onChange = (accuracy: number) => (field: string) => (e: any) => {
    const tempObj = this.props.onValueChange({
      accuracy,
      field,
      value: e.target.value
    });
    if (field === 'sellValue') {
      if (this.state.isSellActive) {
        tempObj.buyValue = (tempObj.sellValue * +this.state.priceValue).toFixed(
          accuracy
        );
      } else {
        tempObj.buyValue = (tempObj.sellValue / +this.state.priceValue).toFixed(
          accuracy
        );
      }
    } else {
      if (this.state.isSellActive) {
        tempObj.sellValue = (tempObj.buyValue / +this.state.priceValue).toFixed(
          accuracy
        );
      } else {
        tempObj.sellValue = (tempObj.buyValue * +this.state.priceValue).toFixed(
          accuracy
        );
      }
    }
    this.setState(tempObj);
  };

  isInvalidValues = () => {
    return this.state.isMarketActive
      ? !+this.state.quantityValue
      : !+this.state.sellValue! ||
          !+this.state.buyValue! ||
          !+this.state.priceValue;
  };

  fixedValue = (value: any) => {
    return parseFloat(value) === 0 ? parseFloat(value).toFixed(2) : value + '';
  };

  handlePercentageChange = (index: number) => () => {
    percentage.forEach((item: any, i: number) => {
      item.isActive = index === i;
    });
    this.setState({
      percents: percentage
    });
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

    return (
      <div>
        <StyledMarkets>
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
        </StyledMarkets>

        <StyledActions>
          <OrderActionButton
            title={orderAction.sell.action}
            click={this.handleActionClick(orderAction.sell.action, bid)}
            isActive={this.state.isSellActive}
          />
          <OrderActionButton
            title={orderAction.buy.action}
            click={this.handleActionClick(orderAction.buy.action, ask)}
            isActive={!this.state.isSellActive}
          />
        </StyledActions>

        <Flex justify={'space-between'}>
          {this.state.percents!.map((item: any, index: number) => (
            <OrderPercentage
              percent={item.percent}
              key={index}
              onClick={this.handlePercentageChange(index)}
              isActive={item.isActive}
            />
          ))}
        </Flex>

        <div>
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
            buy={this.state.buyValue}
            sell={this.state.sellValue}
            quantityAccuracy={this.props.accuracy.quantityValue}
            priceAccuracy={this.props.accuracy.priceValue}
          />
        </div>
      </div>
    );
  }
}

export default Order;
