import * as React from 'react';
import styled from 'styled-components';
import orderAction from '../../constants/orderAction';
import orderOptions from '../../constants/orderOptions';
import OrderType from '../../models/orderType';
import {OrderProps, OrderState} from './index';
import OrderAction from './OrderAction';
import OrderButton from './OrderButton';
import OrderChoiceButton from './OrderChoiceButton';
import OrderHeader from './OrderHeader';
import OrderOption from './OrderOption';

const MARKET = OrderType.Market;
const PENDING = OrderType.Pending;

const StyledActionBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`;

const StyledActionChoice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
`;

const StyledContentWrap = styled.div`
  padding: 15px 24px;
`;

const StyledOrderButton = styled.div`
  margin: 24px 0 0 0;
`;

const StyledSplitBlock = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.33;
  color: #13b72a;
`;

const StyledOrderOptions = styled.div`
  margin: 14px 0 0 0;
`;

class Order extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props);
    this.state = {
      isMarketActive: true,
      isSellActive: true,
      priceValue: 0,
      quantityValue: 0,
      stopLoss: 0,
      takeProfit: 0
    };
  }

  actionClickHandler = (action: string) => () => {
    this.setState({
      isSellActive: action === orderAction.sell.action
    });
  };

  actionChoiceClickHandler = (choice: string) => () => {
    this.setState({
      isMarketActive: choice === MARKET
    });
  };

  buttonClickHandler = (action: string) => () => {
    alert(action);
  };

  onChangeHandler = (value: string) => (e: any) => {
    const tempObj = {};
    tempObj[value] = +e.target.value;
    this.setState(tempObj);
  };

  closeOrderHandler = () => {
    alert('close order');
  };

  render() {
    const currentAction = this.state.isSellActive
      ? orderAction.sell
      : orderAction.buy;
    const options = this.state.isMarketActive
      ? orderOptions.filter(opt => opt.isMarketField)
      : orderOptions;
    const {bid, ask} = this.props;
    return (
      <div>
        <OrderHeader
          orderCurrency={this.props.currency}
          click={this.closeOrderHandler}
        />

        <StyledActionBlock>
          <StyledSplitBlock>
            {(this.props.bid + this.props.ask).toFixed(this.props.accuracy)}
          </StyledSplitBlock>
          <OrderAction
            click={this.actionClickHandler(orderAction.sell.action)}
            isActive={this.state.isSellActive}
            price={this.props.bid}
            {...orderAction.sell}
          />
          <OrderAction
            click={this.actionClickHandler(orderAction.buy.action)}
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
              click={this.actionChoiceClickHandler(MARKET)}
            />
            <OrderChoiceButton
              title={PENDING}
              isActive={!this.state.isMarketActive}
              click={this.actionChoiceClickHandler(PENDING)}
            />
          </StyledActionChoice>

          <StyledOrderOptions>
            {options.map((opt, index) => {
              return (
                <OrderOption
                  key={index}
                  inputValue={this.state[opt.value]}
                  change={this.onChangeHandler(opt.value)}
                  {...opt}
                />
              );
            })}
          </StyledOrderOptions>

          <StyledOrderButton>
            <OrderButton
              action={currentAction.action}
              price={
                currentAction.action === orderAction.buy.action ? ask : bid
              }
              click={this.buttonClickHandler(currentAction.action)}
            />
          </StyledOrderButton>
        </StyledContentWrap>
      </div>
    );
  }
}

export default Order;
