import {pathOr} from 'rambda';
import * as React from 'react';
import {OrderState} from '../Order';
import EditOrderForm from '../Order/EditOrderForm/EditOrderForm';
import {EditOrderProps, StyledExpiredModal} from './index';
import ModalHeader from './ModalHeader/ModalHeader';

class EditOrder extends React.Component<EditOrderProps, OrderState> {
  private action: string;
  private accuracy: {priceValue: number; quantityValue: number};
  private assetName: string = '';

  constructor(props: EditOrderProps) {
    super(props);

    const {modal} = this.props;
    const currentInstrument = this.props.getInstrumentById(modal.config.symbol);

    this.state = {
      isMarketActive: false,
      isSellActive: true,
      pendingOrder: false,
      priceValue: `${modal.config.price}`,
      quantityValue: `${modal.config.volume}`
    };

    this.accuracy = {
      priceValue: pathOr(2, ['accuracy'], currentInstrument),
      quantityValue: pathOr(2, ['baseAsset', 'accuracy'], currentInstrument)
    };
    this.assetName = pathOr(2, ['name'], currentInstrument);
    this.action = modal.config.side;
  }

  onChange = (field: string) => (e: any) => {
    this.setState(
      this.props.onValueChange({
        accuracy: this.accuracy[field],
        field,
        value: e.target.value
      })
    );
  };

  onArrowClick = (operation: string, field: string) => (e: any) => {
    this.setState(
      this.props.onArrowClick({
        accuracy: this.accuracy[field],
        field,
        operation,
        value: this.state[field]
      })
    );
  };

  isInvalidValues = () => {
    return !+this.state.quantityValue || !+this.state.priceValue;
  };

  // tslint:disable-next-line:no-empty
  handleEditOrder = () => {};

  handleCancel = () => {
    this.props.modal.cancelAction();
    this.props.modal.close();
  };

  render() {
    return (
      <StyledExpiredModal>
        <ModalHeader title={'Edit Order'} onClick={this.handleCancel} />
        <EditOrderForm
          assetName={this.assetName}
          onChange={this.onChange}
          onArrowClick={this.onArrowClick}
          price={this.state.priceValue}
          isDisable={this.isInvalidValues()}
          isMarket={false}
          action={this.action}
          quantity={this.state.quantityValue}
          amount={this.props.fixedAmount(
            +this.state.priceValue,
            this.state.quantityValue,
            this.accuracy.priceValue
          )}
          onSubmit={this.handleEditOrder}
          onCancel={this.handleCancel}
        />
      </StyledExpiredModal>
    );
  }
}

export default EditOrder;
