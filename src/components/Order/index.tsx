import {rem} from 'polished';
import {pathOr} from 'rambda';
import styled from 'styled-components';
import {AssetBalanceModel} from '../../models';
import withAuth from '../Auth/withAuth';
import {connect} from '../connect';
import Order from './Order';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export interface OrderState {
  isMarketActive: boolean;
  isLimitActive: boolean;
  isStopLimitActive: boolean;
  isSellActive: boolean;
  quantityValue: string;
  pendingOrder: boolean;
  priceValue: string;
  percents: any[];
}

export interface OrderProps {
  addModal: any;
  ask: number;
  bid: number;
  accuracy: {
    priceAccuracy: number;
    quantityAccuracy: number;
    baseAssetAccuracy: number;
    quoteAssetAccuracy: number;
  };
  currency: string;
  placeOrder: any;
  baseAssetName: string;
  baseAssetId: string;
  quoteAssetName: string;
  quoteAssetId: string;
  stateFns: any[];
  getAssetById: any;
  onArrowClick: any;
  onValueChange: any;
  fixedAmount: any;
  updatePriceFn: any;
  updateDepthFn: any;
  initPriceFn: any;
  baseAssetBalance: any;
  quoteAssetBalance: any;
  mid: number;
  handlePercentageChange: any;
  updatePercentageState: any;
  resetPercentage: any;
}

export interface OrderHeaderProps {
  orderCurrency: string;
  click: any;
}

export interface OrderChoiceButtonProps {
  title: string;
  click: any;
  isActive: boolean;
}

export interface OrderButtonProps {
  isDisable: boolean;
  type: string;
  message?: string;
}

export interface OrderActionProps {
  price: number;
  title: string;
  action: string;
  click: any;
  isActive: boolean;
}

export interface OrderFormProps {
  onChange: any;
  onArrowClick: any;
  isMarket: boolean;
  isDisable: boolean;
  action: string;
  onSubmit?: any;
  assetName: string;
  quantity: string;
  price: string;
  amount: string;
  buy?: string;
  sell?: string;
  quantityAccuracy?: number;
  priceAccuracy?: number;
}

export interface OrderBasicFormProps {
  action: string;
  baseAssetName: string;
  quoteAssetName: string;
  balance: number;
  isDisable: boolean;
  isSell: boolean;
  onArrowClick: any;
  onChange: any;
  onHandlePercentageChange: any;
  onReset?: any;
  onSubmit: any;
  percents: any[];
  quantity: string;
  quantityAccuracy: number;
  priceAccuracy: number;
}

export interface OrderMarketState {
  action: string;
}

export interface OrderMarketProps extends OrderBasicFormProps {
  onResetPercentage: any;
  onInvert: any;
}

export interface OrderLimitProps extends OrderBasicFormProps {
  amount?: string;
  price: string;
  buttonMessage: string;
  isEditForm?: boolean;
}

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
  margin-bottom: ${rem(10)};
`;

const StyledInputControl = styled.div`
  margin: ${rem(14)} 0 ${rem(8)} 0;
`;

const StyledReset = Flex.extend`
  color: rgb(3, 136, 239);
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  padding: ${rem(16)} 0;

  span:hover {
    cursor: pointer;
  }
`;

const StyledActionTitle = styled.div`
  font-size: ${rem(16)};
  font-weight: 600;
  &:first-letter {
    text-transform: capitalize;
  }
`;

const StyledTotalAmount = styled.div`
  padding-top: ${rem(1)};
  color: #8c94a0;
  font-size: ${rem(15)};
`;

const StyledAvailable = styled(StyledTotalAmount)`
  &:hover {
    cursor: pointer;
  }
`;

const StyledNote = styled.div`
  font-size: ${rem(14)};
  color: #fff;
`;

const ConnectedOrder = connect(
  ({
    balanceListStore: {availableBalance: getBalance},
    modalStore: {addModal},
    orderBookStore: {bestAsk, bestBid, mid},
    orderStore: {placeOrder, updatePriceFn, updateDepthFn},
    uiStore: {selectedInstrument: instrument, stateFns, initPriceFn},
    referenceStore,
    uiOrderStore: {
      onArrowClick,
      onValueChange,
      fixedAmount,
      handlePercentageChange,
      updatePercentageState,
      resetPercentage
    },
    authStore: {isAuth}
  }) => ({
    accuracy: {
      priceAccuracy: pathOr(2, ['accuracy'], instrument),
      get quantityAccuracy() {
        const asset = referenceStore.getAssetById(
          pathOr('', ['baseAsset', 'id'], instrument)
        );
        return asset ? asset.accuracy : 2;
      },
      baseAssetAccuracy: pathOr(2, ['baseAsset', 'accuracy'], instrument),
      quoteAssetAccuracy: pathOr(2, ['quoteAsset', 'accuracy'], instrument)
    },
    addModal,
    ask: bestAsk(),
    baseAssetId: pathOr('', ['baseAsset', 'id'], instrument),
    get baseAssetName() {
      return pathOr('', ['baseAsset', 'name'], instrument);
    },
    get quoteAssetName() {
      return pathOr('', ['quoteAsset', 'name'], instrument);
    },
    bid: bestBid(),
    currency: pathOr('', ['id'], instrument),
    fixedAmount,
    getAssetById: referenceStore.getAssetById,
    handlePercentageChange,
    initPriceFn,
    mid: mid(),
    onArrowClick,
    onValueChange,
    placeOrder,
    quoteAssetId: pathOr('', ['quoteAsset', 'id'], instrument),
    resetPercentage,
    stateFns,
    updateDepthFn,
    updatePercentageState,
    updatePriceFn,
    get baseAssetBalance() {
      const asset = getBalance.find((a: AssetBalanceModel) => {
        const baseAssetName = pathOr('', ['baseAsset', 'id'], instrument);
        return a.id === baseAssetName;
      });
      return asset && asset.available;
    },
    get quoteAssetBalance() {
      const asset = getBalance.find((a: AssetBalanceModel) => {
        const quoteAssetName = pathOr('', ['quoteAsset', 'id'], instrument);
        return a.id === quoteAssetName;
      });
      return asset && asset.available;
    },
    isAuth
  }),
  withAuth(Order)
);

export {ConnectedOrder as Order};
export {
  StyledActionTitle,
  StyledInputControl,
  StyledOrderButton,
  StyledReset,
  StyledAvailable,
  StyledNote,
  StyledTotalAmount
};
