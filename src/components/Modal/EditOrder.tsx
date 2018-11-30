import * as React from 'react';
import {precisionCeil} from 'src/utils/math';
import {InstrumentModel, OrderModel, OrderType} from '../../models';
import Side from '../../models/side';
import {orderProps} from '../OrderForm';
import LimitOrder from '../OrderForm/LimitOrder';
import StopLimitOrder from '../OrderForm/StopLimitOrder';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  EditActionTitle,
  EditModal,
  EditOrderModalHeader,
  EditTitle
} from './styles';

export interface EditOrderProps {
  getInstrumentById: any;
  editOrder: any;
  availableBalances: any;
  order: OrderModel;
  onClose: () => void;
}

interface EditOrderState {
  pendingOrder: boolean;
  priceValue: string;
  quantityValue: string;
  percents: any[];
}

class EditOrder extends React.Component<EditOrderProps, EditOrderState> {
  handleModify = (values: any) => {
    const instrument: InstrumentModel = this.props.getInstrumentById(
      this.props.order.symbol
    );

    const body: any = {
      AssetId: instrument.baseAsset.id,
      AssetPairId: instrument.id,
      OrderAction: this.props.order.side,
      Volume: values.amount
    };

    switch (this.props.order.type) {
      case OrderType.Limit:
        body.Price = values.price;
      case OrderType.StopLimit:
        body.Price = values.price;
        body.StopPrice = values.stopPrice;
      default:
        break;
    }

    return this.props
      .editOrder(body, this.props.order.id, this.props.order.type)
      .then(this.props.onClose);
  };

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const {availableBalances: balances, order} = this.props;
    const instrument: InstrumentModel = this.props.getInstrumentById(
      order.symbol
    );
    const restOrderProps = orderProps(instrument, balances);
    restOrderProps.availableInBaseAsset += order.remainingVolume;
    restOrderProps.availableInQuoteAsset += precisionCeil(
      order.remainingVolume * order.price,
      instrument.quoteAsset.accuracy
    );

    return (
      <EditModal isSell={order.side === Side.Sell}>
        <EditOrderModalHeader>
          <ModalHeader onClick={this.handleClose}>
            <EditActionTitle isSell={order.side === Side.Sell}>
              {order.side}
            </EditActionTitle>
            <EditTitle>Edit order</EditTitle>
          </ModalHeader>
        </EditOrderModalHeader>
        {this.props.order.type === OrderType.Limit && (
          <LimitOrder
            {...order}
            amount={order.volume}
            instrument={instrument}
            {...restOrderProps}
            editing={true}
            onPlaceOrder={this.handleModify}
          />
        )}
        {order.type === OrderType.StopLimit && (
          <StopLimitOrder
            {...order}
            amount={order.volume}
            instrument={instrument}
            {...restOrderProps}
            editing={true}
            onPlaceOrder={this.handleModify}
          />
        )}
      </EditModal>
    );
  }
}

export default EditOrder;
