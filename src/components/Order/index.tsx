import {pathOr} from 'rambda';
import {AssetBalanceModel} from '../../models';
import withAuth from '../Auth/withAuth';
import {connect} from '../connect';
import {withKyc} from '../Kyc';
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
  onQuantityChange: (value: string) => void;
  updatePercentageState: (field: string) => void;
}

const ConnectedOrder = connect(
  ({
    balanceListStore: {
      tradingWallet: {balances: balances}
    },
    orderBookStore: {bestAskPrice, bestBidPrice},
    orderStore: {placeOrder},
    uiStore: {
      selectedInstrument: instrument,
      readOnlyMode,
      isDisclaimerShown,
      disclaimedAssets
    },
    referenceStore: {getBaseAsset, getInstrumentById},
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
      resetOrder,
      marketTotalPrice,
      isEnoughLiquidity,
      setMarketTotal,
      resetMarketTotal,
      handleMarketQuantityArrowClick
    },
    authStore: {isAuth, isKycPassed},
    marketStore: {convert}
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
    handleMarketQuantityArrowClick,
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
    isKycPassed,
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
    disclaimedAssets,
    setMarketTotal,
    marketTotalPrice,
    isEnoughLiquidity,
    resetMarketTotal,
    convert,
    baseAsset: getBaseAsset,
    getInstrumentById
  }),
  withAuth(withKyc(Order))
);

export {ConnectedOrder as Order};
