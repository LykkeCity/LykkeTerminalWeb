import {curry, pathOr} from 'rambda';
import * as React from 'react';
import {Percentage} from '../../constants/ordersPercentage';
import {AssetBalanceModel, OrderInputs, OrderModel} from '../../models';
import Side from '../../models/side';
import {
  DEFAULT_INPUT_VALUE,
  onArrowClick,
  onValueChange
} from '../../utils/inputNumber';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {bigToFixed, precisionFloor} from '../../utils/math';
import {
  getPercentOfValueForLimit,
  isAmountExceedLimitBalance,
  resetPercentage,
  setActivePercentage
} from '../../utils/order';
import OrderLimit from '../Order/OrderLimit';
import ModalHeader from './ModalHeader/ModalHeader';
import {EditActionTitle, EditModal, EditTitle} from './styles';

const percentage = Percentage.map((i: any) => {
  return {...i};
});

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
      priceValue: bigToFixed(
        order.price,
        this.accuracy.priceAccuracy
      ).toString(),
      quantityValue: bigToFixed(
        order.remainingVolume,
        this.accuracy.quantityAccuracy
      ).toString()
    };

    this.handlePriceArrowClick = curry(onArrowClick)(
      () => this.state.priceValue,
      () => this.accuracy.priceAccuracy,
      this.setPriceValueWithFixed
    );

    this.handleQuantityArrowClick = curry(onArrowClick)(
      () => this.state.quantityValue,
      () => this.accuracy.quantityAccuracy,
      this.setQuantityValueWithFixed
    );

    this.handlePriceChange = curry(onValueChange)(
      this.setPriceValue,
      () => this.accuracy.priceAccuracy
    );

    this.handleQuantityChange = curry(onValueChange)(
      this.setQuantityValue,
      () => this.accuracy.quantityAccuracy
    );

    this.handlePercentChangeForLimit = curry(getPercentOfValueForLimit)(
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

  setPriceValueWithFixed = (price: number | string) => {
    this.setState({
      priceValue: !price
        ? DEFAULT_INPUT_VALUE
        : bigToFixed(price, this.accuracy.priceAccuracy).toString()
    });
  };

  setQuantityValueWithFixed = (quantity: number | string) => {
    this.setState({
      quantityValue: !quantity
        ? DEFAULT_INPUT_VALUE
        : bigToFixed(quantity, this.accuracy.quantityAccuracy).toString()
    });
  };

  setPriceValue = (price: string) => this.setState({priceValue: price});
  setQuantityValue = (quantity: string) =>
    this.setState({quantityValue: quantity});

  handlePercentageChange = (index: number) => () => {
    if (!this.balance) {
      return;
    }

    const {updatedPercentage, percents} = setActivePercentage(
      percentage,
      index
    );

    this.setQuantityValueWithFixed(
      this.handlePercentChangeForLimit(percents, this.balance, this.action)
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
      .then(this.handleClose)
      .catch(() => this.toggleDisableBtn(false));
  };

  handleClose = () => {
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
    const roundedAmount = precisionFloor(
      parseFloat(this.state.quantityValue) * parseFloat(this.state.priceValue),
      this.accuracy.quoteAssetAccuracy
    );

    const isOrderInvalid =
      this.state.pendingOrder || !roundedAmount || this.isLimitInvalid();

    return (
      <EditModal isSell={this.isSellActive}>
        <ModalHeader onClick={this.handleClose}>
          <EditActionTitle isSell={this.isSellActive}>
            {this.action}
          </EditActionTitle>
          <EditTitle>Edit Limit Order</EditTitle>
        </ModalHeader>
        <OrderLimit
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
