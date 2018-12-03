import React, {Component} from 'react';
import {
  AssetBalanceModel,
  InstrumentModel,
  keys,
  OrderType,
  Side
} from '../../models';
import StorageUtils from '../../utils/storageUtils';
import ConfirmModal from '../Modal/ConfirmModal';
import {LimitOrder, MarketOrder, StopLimitOrder} from './';
import {OrderForm, Type} from './styles';

const confirmStorage = StorageUtils(keys.confirmReminder);

export interface OrderFormProps {
  type: OrderType;
  instrument?: InstrumentModel | null;
  balances: AssetBalanceModel[];
  initialPrice: number;
  baseAsset: string;
  quoteAsset: string;
  availableInBaseAsset: number;
  availableInQuoteAsset: number;
  onPlaceOrder: (values: any) => any;
  placeOrder: any;
}

// tslint:disable:jsx-no-lambda
export default class extends Component<OrderFormProps> {
  state = {
    type: this.props.type,
    showConfirm: false,
    placeOrder: () => Promise.resolve(),
    warnText: 'place the order'
  };

  handleChangeType = (type: OrderType) => () => {
    this.setState({type});
  };

  handlePlaceOrder = (values: any) => {
    const opts: any = {
      AssetId: this.props.instrument!.baseAsset.id,
      AssetPairId: this.props.instrument!.id,
      OrderAction: values.side,
      Volume: values.amount
    };
    switch (this.state.type) {
      case OrderType.Limit:
        opts.Price = values.price;
      case OrderType.StopLimit:
        opts.Price = values.price;
        opts.StopPrice = values.stopPrice;
      default:
        break;
    }
    if (JSON.parse(confirmStorage.get() || true.toString())) {
      this.setState({
        showConfirm: true,
        placeOrder: () => this.props.placeOrder(this.state.type, opts),
        warnText: `${Side[values.side].toLowerCase()} ${values.amount} ${
          this.props.instrument!.baseAsset.name
        }`
      });
    } else {
      return this.props.placeOrder(this.state.type, opts);
    }
  };

  hideConfirm = () => this.setState({showConfirm: false});

  componentWillReceiveProps(nextProps: OrderFormProps) {
    this.setState({type: nextProps.type});
  }

  render() {
    return this.props.instrument ? (
      <OrderForm>
        <Type>
          <Type.Option
            active={this.state.type === OrderType.Limit}
            onClick={this.handleChangeType(OrderType.Limit)}
          >
            Limit
          </Type.Option>
          <Type.Option
            active={this.state.type === OrderType.Market}
            onClick={this.handleChangeType(OrderType.Market)}
          >
            Market
          </Type.Option>
          <Type.Option
            active={this.state.type === OrderType.StopLimit}
            onClick={this.handleChangeType(OrderType.StopLimit)}
          >
            Stop-Limit
          </Type.Option>
        </Type>
        {this.state.type === OrderType.Limit && (
          <LimitOrder onPlaceOrder={this.handlePlaceOrder} />
        )}
        {this.state.type === OrderType.Market && (
          <MarketOrder onPlaceOrder={this.handlePlaceOrder} />
        )}
        {this.state.type === OrderType.StopLimit && (
          <StopLimitOrder onPlaceOrder={this.handlePlaceOrder} />
        )}
        {this.state.showConfirm && (
          <ConfirmModal
            onApply={() => {
              return this.state.placeOrder().then(this.hideConfirm);
            }}
            onClose={this.hideConfirm}
            message={this.state.warnText}
          />
        )}
      </OrderForm>
    ) : null;
  }
}
