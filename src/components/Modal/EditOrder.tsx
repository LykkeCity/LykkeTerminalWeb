import rem from 'polished/lib/helpers/rem';
import {pathOr} from 'rambda';
import * as React from 'react';
import styled from 'styled-components';
import {Percentage} from '../../constants/ordersPercentage';
import {AssetBalanceModel, OrderInputs} from '../../models';
import Side from '../../models/side';
import EditOrderForm from '../Order/EditOrderForm/EditOrderForm';
import {EditOrderProps, EditOrderState} from './index';
import ModalHeader from './ModalHeader/ModalHeader';

const percentage = Percentage.map((i: any) => {
  return {...i};
});

const StyledEditModal = styled.div.attrs({
  style: (props: any) => ({
    borderTop: `${rem(6)} solid ${props.isSell ? '#ab00ff' : '#fb8f01'}`
  })
})`
  border-radius: ${rem(6)};
  font-family: Proxima Nova;
  position: absolute;
  padding: ${rem(20)} ${rem(24)};
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 31;
  width: ${rem(360)};
  font-size: ${rem(14)};
` as any;

const StyledActionTitle = styled.div.attrs({
  style: (props: any) => ({
    color: props.isSell ? '#d070ff' : '#fb8f01'
  })
})`
  text-transform: uppercase;
  font-size: ${rem(12)};
  letter-spacing: ${rem(1.5)};
` as any;

const StyledTitle = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 0.67;
  margin-top: ${rem(12)};
  margin-bottom: ${rem(12)};
`;

class EditOrder extends React.Component<EditOrderProps, EditOrderState> {
  private readonly action: string;
  private readonly accuracy: {
    priceAccuracy: number;
    quantityAccuracy: number;
    quoteAssetAccuracy: number;
  };
  private readonly baseAssetName: string = '';
  private readonly quoteAssetName: string = '';
  private readonly baseAssetId: string = '';
  private readonly quoteAssetId: string = '';
  private readonly currency: string = '';
  private readonly isSellActive: boolean;
  private readonly balance: number = 0;

  constructor(props: EditOrderProps) {
    super(props);

    const {modal} = this.props;
    const currentInstrument = this.props.getInstrumentById(modal.config.symbol);

    this.state = {
      pendingOrder: false,
      percents: percentage,
      priceValue: `${modal.config.price}`,
      quantityValue: `${modal.config.volume}`
    };

    this.accuracy = {
      priceAccuracy: pathOr(2, ['accuracy'], currentInstrument),
      quantityAccuracy: pathOr(2, ['baseAsset', 'accuracy'], currentInstrument),
      quoteAssetAccuracy: pathOr(
        2,
        ['quoteAsset', 'accuracy'],
        currentInstrument
      )
    };
    this.baseAssetName = currentInstrument.baseAsset.name;
    this.quoteAssetName = currentInstrument.quoteAsset.name;
    this.baseAssetId = currentInstrument.baseAsset.id;
    this.quoteAssetId = currentInstrument.quoteAsset.id;
    this.action = modal.config.side.toLowerCase();
    this.currency = currentInstrument.id;
    this.isSellActive = this.action === Side.Sell.toLowerCase();

    const assetId = this.isSellActive ? this.baseAssetId : this.quoteAssetId;
    const asset = this.props.getBalance.find((a: AssetBalanceModel) => {
      return a.id === assetId;
    });
    const reserved = this.isSellActive
      ? modal.config.volume
      : modal.config.price;
    this.balance = (asset.available + reserved).toFixed(asset.accuracy);
  }

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    const {
      accuracy: {quantityAccuracy, priceAccuracy},
      baseAssetId,
      quoteAssetId
    } = this;

    if (!this.balance) {
      return;
    }

    const tempObj = await this.props.handlePercentageChange({
      balance: this.balance,
      baseAssetId,
      index,
      isInverted,
      isSellActive: this.isSellActive,
      percentage,
      priceAccuracy,
      quantityAccuracy,
      quoteAssetId,
      currentPrice: this.state.priceValue
    });

    this.setState(tempObj);
  };

  updatePercentageState = (field: string) => {
    const tempObj: any = {};
    if (this.isSellActive && field === OrderInputs.Quantity) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    } else if (!this.isSellActive && field === OrderInputs.Price) {
      this.props.resetPercentage(percentage);
      tempObj.percents = percentage;
    }
    this.setState(tempObj);
  };

  onChange = (accuracy: number) => (field: string) => (e: any) => {
    const tempObj = this.props.onValueChange({
      accuracy,
      field,
      value: e.target.value
    });

    this.updatePercentageState(field);
    this.setState(tempObj);
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

    this.updatePercentageState(field);
    this.setState(tempObj);
  };

  toggleDisableBtn = (value: boolean) => {
    this.setState({
      pendingOrder: value
    });
  };

  handleEditOrder = () => {
    this.toggleDisableBtn(true);
    const body: any = {
      AssetId: this.baseAssetId,
      AssetPairId: this.currency,
      OrderAction: this.action,
      Price: parseFloat(this.state.priceValue),
      Volume: parseFloat(this.state.quantityValue)
    };

    this.props
      .editOrder(body, this.props.modal.config.id)
      .then(this.handleCancel)
      .catch(() => this.toggleDisableBtn(false));
  };

  handleCancel = () => {
    this.props.resetPercentage(percentage);
    this.props.modal.close();
  };

  render() {
    const {quantityValue, priceValue} = this.state;

    const {
      accuracy: {priceAccuracy, quantityAccuracy},
      isSellActive,
      balance
    } = this;
    const isOrderInvalid =
      this.state.pendingOrder ||
      this.props.isLimitInvalid(
        isSellActive,
        quantityValue,
        priceValue,
        +balance,
        +balance,
        priceAccuracy,
        quantityAccuracy
      );
    return (
      <StyledEditModal isSell={this.action === Side.Sell.toLowerCase()}>
        <ModalHeader onClick={this.handleCancel}>
          <StyledActionTitle isSell={this.action === Side.Sell.toLowerCase()}>
            {this.action}
          </StyledActionTitle>
          <StyledTitle>Edit Limit Order</StyledTitle>
        </ModalHeader>
        <EditOrderForm
          action={this.action}
          onSubmit={this.handleEditOrder}
          quantity={this.state.quantityValue}
          price={this.state.priceValue}
          quantityAccuracy={this.accuracy.quantityAccuracy}
          priceAccuracy={this.accuracy.priceAccuracy}
          onChange={this.onChange}
          onArrowClick={this.onArrowClick}
          percents={this.state.percents}
          onHandlePercentageChange={this.handlePercentageChange}
          baseAssetName={this.baseAssetName}
          quoteAssetName={this.quoteAssetName}
          isSell={this.isSellActive}
          isDisable={isOrderInvalid}
          amount={this.props.fixedAmount(
            this.state.priceValue,
            this.state.quantityValue,
            this.accuracy.quoteAssetAccuracy
          )}
          balance={this.balance}
          buttonMessage={'Modify'}
          isEditForm={true}
        />
      </StyledEditModal>
    );
  }
}

export default EditOrder;
