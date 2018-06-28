import {pathOr} from 'rambda';
import {AssetBalanceModel} from '../../models';
import withAuth from '../Auth/withAuth';
import {connect} from '../connect';
import Order from './Order';

const DEFAULT_BALANCE = 0;

export interface OrderBasicFormProps {
  action: string;
  baseAssetName: string;
  quoteAssetName: string;
  balance: number;
  isDisable: boolean;
  isSell: boolean;
  onHandlePercentageChange: any;
  onReset?: any;
  onSubmit: any;
  percents: any[];
  quantity: string;
  quantityAccuracy: number;
  priceAccuracy: number;
  baseAssetAccuracy?: any;
  balanceAccuracy: number;
  onQuantityArrowClick: (operation: string) => void;
  onQuantityChange: (value: string) => void;
  updatePercentageState: (field: string) => void;
}

const ConnectedOrder = connect(
  ({
    balanceListStore: {tradingWalletBalances: balances},
    orderBookStore: {bestAskPrice, bestBidPrice},
    orderStore: {placeOrder},
    uiStore: {
      selectedInstrument: instrument,
      readOnlyMode,
      isDisclaimerShown,
      disclaimedAssets
    },
    referenceStore,
    uiOrderStore: {
      handlePriceArrowClick,
      handleQuantityArrowClick,
      handlePriceChange,
      handleQuantityChange,
      handlePercentageChange,
      isLimitInvalid,
      isMarketInvalid,
      getPriceAccuracy,
      getQuantityAccuracy,
      getComputedPriceValue,
      getComputedQuantityValue,
      currentMarket,
      isCurrentSideSell,
      setMarket,
      setSide,
      resetOrder
    },
    authStore: {isAuth}
  }) => ({
    accuracy: {
      priceAccuracy: getPriceAccuracy(),
      quantityAccuracy: getQuantityAccuracy(),
      baseAssetAccuracy: pathOr(2, ['baseAsset', 'accuracy'], instrument),
      quoteAssetAccuracy: pathOr(2, ['quoteAsset', 'accuracy'], instrument)
    },
    ask: bestAskPrice,
    baseAssetId: pathOr('', ['baseAsset', 'id'], instrument),
    get baseAssetName() {
      return pathOr('', ['baseAsset', 'name'], instrument);
    },
    get quoteAssetName() {
      return pathOr('', ['quoteAsset', 'name'], instrument);
    },
    bid: bestBidPrice,
    currency: pathOr('', ['id'], instrument),
    isLimitInvalid,
    isMarketInvalid,
    handlePercentageChange,
    handlePriceArrowClick,
    handleQuantityArrowClick,
    placeOrder,
    quoteAssetId: pathOr('', ['quoteAsset', 'id'], instrument),
    get baseAssetBalance() {
      const asset = balances.find((b: AssetBalanceModel) => {
        const baseAssetId = pathOr('', ['baseAsset', 'id'], instrument);
        return b.id === baseAssetId;
      });
      return asset ? asset.available : DEFAULT_BALANCE;
    },
    get quoteAssetBalance() {
      const asset = balances.find((b: AssetBalanceModel) => {
        const quoteAssetId = pathOr('', ['quoteAsset', 'id'], instrument);
        return b.id === quoteAssetId;
      });
      return asset ? asset.available : DEFAULT_BALANCE;
    },
    isAuth,
    readOnlyMode,
    instrument,
    priceValue: getComputedPriceValue,
    quantityValue: getComputedQuantityValue,
    handlePriceChange,
    handleQuantityChange,
    resetOrder,
    currentMarket,
    isCurrentSideSell,
    setMarket,
    setSide,
    isDisclaimerShown,
    disclaimedAssets
  }),
  withAuth(Order)
);

export {ConnectedOrder as Order};
