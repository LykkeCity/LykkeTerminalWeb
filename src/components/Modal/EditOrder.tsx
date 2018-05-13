import {pathOr} from 'rambda';
import * as React from 'react';
import {Percentage} from '../../constants/ordersPercentage';
import {AssetBalanceModel, OrderInputs, OrderModel} from '../../models';
import Side from '../../models/side';
import {onArrowClick, onValueChange} from '../../utils/inputNumber';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {precisionFloor} from '../../utils/math';
import {
  getPercentOfValueForLimit,
  isAmountExceedLimitBalance,
  resetPercentage,
  setActivePercentage
} from '../../utils/order';
import EditOrderForm from '../Order/EditOrderForm/EditOrderForm';
import ModalHeader from './ModalHeader/ModalHeader';
import {EditActionTitle, EditModal, EditTitle} from './styles';

const percentage = Percentage.map((i: any) => {
  return {...i};
});

export interface EditOrderProps {
  orders: OrderModel[];
  getInstrumentById: any;
  onValueChange: any;
  editOrder: any;
  handlePercentageChange: any;
  availableBalances: any;
  isLimitInvalid: (
    isSell: boolean,
    quantityValue: string,
    priceValue: string,
    baseAssetBalance: number,
    quoteAssetBalance: number,
    priceAccuracy: number,
    quantityAccuracy: number
  ) => boolean;
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
  private assetAccuracy: number;
  private handlePriceArrowClick: any;
  private handleQuantityArrowClick: any;
  private handlePriceChange: any;
  private handleQuantityChange: any;
  private handlePercentChangeForLimit: any;

  constructor(props: EditOrderProps) {
    super(props);

    const {order} = this.props;
    const currentInstrument = this.props.getInstrumentById(order.symbol);

    this.accuracy = {
      priceAccuracy: pathOr(2, ['accuracy'], currentInstrument),
      quantityAccuracy: pathOr(2, ['baseAsset', 'accuracy'], currentInstrument),
      quoteAssetAccuracy: pathOr(
        2,
        ['quoteAsset', 'accuracy'],
        currentInstrument
      )
    };

    this.state = {
      pendingOrder: false,
      percents: percentage,
      priceValue: order.price.toFixed(this.accuracy.priceAccuracy),
      quantityValue: order.volume.toFixed(this.accuracy.quantityAccuracy)
    };

    this.handlePriceArrowClick = onArrowClick(
      () => this.state.priceValue,
      () => this.accuracy.priceAccuracy,
      this.setPriceValue
    );

    this.handleQuantityArrowClick = onArrowClick(
      () => this.state.quantityValue,
      () => this.accuracy.quantityAccuracy,
      this.setQuantityValue
    );

    this.handlePriceChange = onValueChange(
      this.setPriceValueByHand,
      () => this.accuracy.priceAccuracy
    );

    this.handleQuantityChange = onValueChange(
      this.setQuantityValueByHand,
      () => this.accuracy.quantityAccuracy
    );

    this.handlePercentChangeForLimit = getPercentOfValueForLimit(
      () => this.state.priceValue,
      () => this.accuracy.quantityAccuracy
    );

    this.baseAssetName = currentInstrument.baseAsset.name;
    this.quoteAssetName = currentInstrument.quoteAsset.name;
    this.baseAssetId = currentInstrument.baseAsset.id;
    this.quoteAssetId = currentInstrument.quoteAsset.id;
    this.action = order.side;
    this.currency = currentInstrument.id;
    this.isSellActive = this.action === Side.Sell;

    const assetId = this.isSellActive ? this.baseAssetId : this.quoteAssetId;
    const asset: AssetBalanceModel = this.props.availableBalances.find(
      (b: AssetBalanceModel) => {
        return b.id === assetId;
      }
    );
    const reserved = this.isSellActive
      ? order.volume
      : order.volume * order.price;
    this.assetAccuracy = this.isSellActive
      ? this.accuracy.quantityAccuracy
      : pathOr(2, ['quoteAsset', 'accuracy'], currentInstrument);
    this.balance = asset.available + reserved;
  }

  setPriceValue = (price: number) => {
    this.setState({
      priceValue: price.toFixed(this.accuracy.priceAccuracy)
    });
  };

  setQuantityValue = (quantity: number) => {
    this.setState({
      quantityValue: quantity.toFixed(this.accuracy.quantityAccuracy)
    });
  };

  setPriceValueByHand = (price: string) => this.setState({priceValue: price});
  setQuantityValueByHand = (quantity: string) =>
    this.setState({quantityValue: quantity});

  handlePercentageChange = (index: number) => async (isInverted?: boolean) => {
    if (!this.balance) {
      return;
    }

    const {updatedPercentage, value} = setActivePercentage(percentage, index);

    this.setQuantityValue(
      this.handlePercentChangeForLimit(value, this.balance, this.action)
    );
    this.setState({
      percents: updatedPercentage
    });
  };

  updatePercentageState = (field: string) => {
    const tempObj: any = {};
    if (field === OrderInputs.Quantity) {
      resetPercentage(percentage);
      tempObj.percents = percentage;
    }
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
      .editOrder(body, this.props.order.id)
      .then(this.handleCancel)
      .catch(() => this.toggleDisableBtn(false));
  };

  handleCancel = () => {
    resetPercentage(percentage);
    this.props.onClose();
  };

  isLimitInvalid = () => {
    const {quantityValue, priceValue} = this.state;
    const {
      accuracy: {priceAccuracy, quantityAccuracy},
      isSellActive,
      balance
    } = this;

    return (
      !+quantityValue ||
      !+priceValue ||
      isAmountExceedLimitBalance(
        isSellActive,
        quantityValue,
        priceValue,
        +balance,
        +balance,
        priceAccuracy,
        quantityAccuracy
      )
    );
  };

  render() {
    const isOrderInvalid = this.state.pendingOrder || this.isLimitInvalid();

    const roundedAmount = precisionFloor(
      parseFloat(this.state.quantityValue) * parseFloat(this.state.priceValue),
      this.accuracy.quoteAssetAccuracy
    );

    return (
      <EditModal isSell={this.action === Side.Sell.toLowerCase()}>
        <ModalHeader onClick={this.handleCancel}>
          <EditActionTitle isSell={this.action === Side.Sell.toLowerCase()}>
            {this.action}
          </EditActionTitle>
          <EditTitle>Edit Limit Order</EditTitle>
        </ModalHeader>
        <EditOrderForm
          action={this.action}
          onSubmit={this.handleEditOrder}
          quantity={this.state.quantityValue}
          price={this.state.priceValue}
          quantityAccuracy={this.accuracy.quantityAccuracy}
          priceAccuracy={this.accuracy.priceAccuracy}
          onPriceChange={this.handlePriceChange}
          onQuantityChange={this.handleQuantityChange}
          onQuantityArrowClick={this.handleQuantityArrowClick}
          onPriceArrowClick={this.handlePriceArrowClick}
          percents={this.state.percents}
          onHandlePercentageChange={this.handlePercentageChange}
          baseAssetName={this.baseAssetName}
          quoteAssetName={this.quoteAssetName}
          isSell={this.isSellActive}
          isDisable={isOrderInvalid}
          amount={formattedNumber(
            roundedAmount || 0,
            this.accuracy.quoteAssetAccuracy
          )}
          balance={this.balance}
          buttonMessage={'Modify'}
          isEditForm={true}
          balanceAccuracy={this.assetAccuracy}
          updatePercentageState={this.updatePercentageState}
        />
      </EditModal>
    );
  }
}

export default EditOrder;
