import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import orderOptions from '../../constants/orderOptions';
import keys from '../../constants/storageKeys';
import Types from '../../models/modals';
import OrderType from '../../models/orderType';
import {StorageUtils} from '../../utils/index';
import {OrderProps, OrderState} from './index';
import OrderAction from './OrderAction';
import OrderButton from './OrderButton';
import OrderChoiceButton from './OrderChoiceButton';
import OrderOption from './OrderOption';

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

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const StyledSplitBlock = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: ${rem(14)};
  color: #13b72a;
`;

const StyledOrderOptions = styled.div`
  margin-top: ${rem(24)};
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isMarketActive: true,
      isSellActive: true,
      pendingOrder: false,
      priceValue: 0,
      quantityValue: 0,
      stopLoss: 0,
      takeProfit: 0
    };
  }

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

  applyOrder = (action: string) => {
    const orderType = this.state.isMarketActive ? MARKET : LIMIT;
    const body: any = {
      AssetId: this.props.name.split('/')[0],
      AssetPairId: this.props.currency,
      OrderAction: action,
      Volume: this.state.quantityValue
    };

    if (!this.state.isMarketActive) {
      body.Price = this.state.priceValue;
    }

    this.props
      .placeOrder(orderType, body)
      .then(() => this.disableButton(false));
  };

  cancelOrder = () => {
    this.disableButton(false);
  };

  handleButtonClick = (
    action: string,
    currentPrice: string,
    baseName: string,
    quoteName: string
  ) => () => {
    if (this.state.pendingOrder) {
      return;
    }
    this.disableButton(true);

    const isConfirm = confirmStorage.get() as string;
    if (!JSON.parse(isConfirm)) {
      this.applyOrder(action);
      return;
    }
    const message = `${action} ${
      this.state.quantityValue
    } ${baseName} at ${currentPrice} ${quoteName}`;
    this.props.addModal(
      message,
      () => this.applyOrder(action),
      this.cancelOrder,
      Types.Confirm
    );
  };

  handleOnChange = (value: string) => (e: any) => {
    const tempObj = {};
    tempObj[value] = +e.target.value;
    this.setState(tempObj);
  };

  handleCloseOrder = () => {
    alert('close order');
  };

  render() {
    const currentAction = this.state.isSellActive
      ? orderAction.sell
      : orderAction.buy;
    const options = this.state.isMarketActive
      ? orderOptions.filter(opt => opt.isMarketField)
      : orderOptions;
    const currentPrice =
      (this.state.isMarketActive
        ? this.state.isSellActive ? this.props.bid : this.props.ask
        : this.state.priceValue) || 0;
    const price = (this.state.quantityValue * currentPrice).toFixed(
      this.props.accuracy
    );
    const {bid, ask} = this.props;
    const spread = ask - bid;
    const baseName = this.props.name.split('/')[0];
    const quoteName = this.props.name.split('/')[1];
    return (
      <div>
        <StyledActionBlock>
          <StyledSplitBlock>
            {!Number.isNaN(spread) && spread.toFixed(this.props.accuracy)}
          </StyledSplitBlock>
          <OrderAction
            click={this.handleActionClick(orderAction.sell.action)}
            isActive={this.state.isSellActive}
            price={this.props.bid}
            {...orderAction.sell}
          />
          <OrderAction
            click={this.handleActionClick(orderAction.buy.action)}
            isActive={!this.state.isSellActive}
            price={this.props.ask}
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

          <StyledOrderOptions>
            {options.map((opt, index) => {
              return (
                <OrderOption
                  key={index}
                  inputValue={this.state[opt.value]}
                  change={this.handleOnChange(opt.value)}
                  amount={price}
                  quoteName={quoteName}
                  {...opt}
                />
              );
            })}
          </StyledOrderOptions>

          <StyledOrderButton>
            <OrderButton
              action={currentAction.action}
              price={price}
              click={this.handleButtonClick(
                currentAction.action,
                price,
                baseName,
                quoteName
              )}
              quoteName={quoteName}
              baseName={baseName}
              quantity={this.state.quantityValue}
              isDisable={this.state.pendingOrder}
            />
          </StyledOrderButton>
        </StyledContentWrap>
      </div>
    );
  }
}

export default Order;
