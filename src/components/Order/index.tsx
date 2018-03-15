import {rem} from 'polished';
import {pathOr} from 'rambda';
import styled from 'styled-components';
import {AssetBalanceModel} from '../../models';
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
  accuracy: any;
  currency: string;
  placeOrder: any;
  baseName: string;
  quoteName: string;
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
  convertPartiallyBalance: any;
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
  action: string;
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
  baseName: string;
  quoteName: string;
  balance: number;
  isDisable: boolean;
  isSell: boolean;
  onArrowClick: any;
  onChange: any;
  onHandlePercentageChange: any;
  onReset: any;
  onSubmit: any;
  percents: any[];
  quantity: string;
  quantityAccuracy: number;
}

export interface OrderMarketState {
  action: string;
}

export interface OrderMarketProps extends OrderBasicFormProps {
  onResetPercentage: any;
}

export interface OrderLimitProps extends OrderBasicFormProps {
  amount: string;
  price: string;
  priceAccuracy: number;
}

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const StyledInputControl = styled.div`
  margin: 14px 0;
`;

const StyledReset = Flex.extend`
  padding: 17px 0;
  color: #0388ef;

  span:hover {
    cursor: pointer;
  }
`;

const StyledActionTitle = styled.div`
  &:first-letter {
    text-transform: capitalize;
  }
`;

const ConnectedOrder = connect(
  ({
    balanceListStore: {availableBalance: getBalance},
    modalStore: {addModal},
    orderBookStore: {bestAsk, bestBid},
    orderStore: {
      placeOrder,
      updatePriceFn,
      updateDepthFn,
      convertPartiallyBalance
    },
    uiStore: {selectedInstrument: instrument, stateFns, initPriceFn},
    referenceStore,
    uiOrderStore: {onArrowClick, onValueChange, fixedAmount}
  }) => ({
    accuracy: {
      priceAccuracy: pathOr(2, ['accuracy'], instrument),
      get quantityAccuracy() {
        const asset = referenceStore.getAssetById(
          pathOr('', ['name'], instrument).split('/')[0]
        );
        return asset ? asset.accuracy : 2;
      }
    },
    addModal,
    ask: bestAsk(),
    get baseName() {
      const name = pathOr('', ['name'], instrument);
      return name && name.split('/')[0];
    },
    get quoteName() {
      const name = pathOr('', ['name'], instrument);
      return name && name.split('/')[1];
    },
    bid: bestBid(),
    convertPartiallyBalance,
    currency: pathOr('', ['id'], instrument),
    fixedAmount,
    getAssetById: referenceStore.getAssetById,
    initPriceFn,
    onArrowClick,
    onValueChange,
    placeOrder,
    stateFns,
    updateDepthFn,
    updatePriceFn,
    get baseAssetBalance() {
      const asset = getBalance.find((a: AssetBalanceModel) => {
        const baseAssetName = pathOr('', ['name'], instrument).split('/')[0];
        return a.id === baseAssetName;
      });
      return asset && asset.available;
    },
    get quoteAssetBalance() {
      const asset = getBalance.find((a: AssetBalanceModel) => {
        const quoteAssetName = pathOr('', ['name'], instrument).split('/')[1];
        return a.id === quoteAssetName;
      });
      return asset && asset.available;
    }
  }),
  Order
);

export {ConnectedOrder as Order};
export {StyledActionTitle, StyledInputControl, StyledOrderButton, StyledReset};
