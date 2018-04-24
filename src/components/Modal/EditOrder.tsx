import {pathOr} from 'rambda';
import * as React from 'react';
import {Percentage} from '../../constants/ordersPercentage';
import {AssetBalanceModel, OrderInputs, OrderModel} from '../../models';
import ModalModel from '../../models/modalModel';
import Side from '../../models/side';
import EditOrderForm from '../Order/EditOrderForm/EditOrderForm';
import ModalHeader from './ModalHeader/ModalHeader';
import {EditActionTitle, EditModal, EditTitle} from './styles';

const percentage = Percentage.map((i: any) => {
  return {...i};
});

interface EditOrderProps {
  modal: ModalModel;
  orders: OrderModel[];
  getInstrumentById: any;
  onArrowClick: any;
  onValueChange: any;
  fixedAmount: any;
  editOrder: any;
  resetPercentage: any;
  handlePercentageChange: any;
  setActivePercentage: (
    percentage: any[],
    index?: number
  ) => {value: number; updatedPercentage: any[]};
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
    const asset: AssetBalanceModel = this.props.availableBalances.find(
      (b: AssetBalanceModel) => {
        return b.id === assetId;
      }
    );
    const reserved = this.isSellActive
      ? modal.config.volume
      : modal.config.price;
    const assetAccuracy = this.isSellActive
      ? this.accuracy.quantityAccuracy
      : pathOr(2, ['quoteAsset', 'accuracy'], currentInstrument);
    this.balance = (asset.balance + reserved).toFixed(assetAccuracy);
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

    const {updatedPercentage, value} = this.props.setActivePercentage(
      percentage,
      index
    );

    const tempObj = await this.props.handlePercentageChange({
      balance: this.balance,
      baseAssetId,
      index,
      isInverted,
      isSellActive: this.isSellActive,
      value,
      priceAccuracy,
      quantityAccuracy,
      quoteAssetId,
      currentPrice: this.state.priceValue
    });

    tempObj.percents = updatedPercentage;

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
      </EditModal>
    );
  }
}

export default EditOrder;
