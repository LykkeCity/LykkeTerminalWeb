import {pathOr} from 'rambda';
import {AssetBalanceModel} from '../../models';
import withAuth from '../Auth/withAuth';
import {connect} from '../connect';
import Order from './Order';

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
    balanceListStore: {tradingWalletBalances: getBalance},
    orderBookStore: {bestAsk, bestBid},
    orderStore: {placeOrder},
    uiStore: {selectedInstrument: instrument, readOnlyMode, showDisclaimer},
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
    isLimitInvalid,
    isMarketInvalid,
    handlePercentageChange,
    handlePriceArrowClick,
    handleQuantityArrowClick,
    placeOrder,
    quoteAssetId: pathOr('', ['quoteAsset', 'id'], instrument),
    get baseAssetBalance() {
      const asset = getBalance.find((b: AssetBalanceModel) => {
        const baseAssetName = pathOr('', ['baseAsset', 'id'], instrument);
        return b.id === baseAssetName;
      });
      return asset && asset.available;
    },
    get quoteAssetBalance() {
      const asset = getBalance.find((b: AssetBalanceModel) => {
        const quoteAssetName = pathOr('', ['quoteAsset', 'id'], instrument);
        return b.id === quoteAssetName;
      });
      return asset && asset.available;
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
    showDisclaimer
  }),
  withAuth(Order)
);

export {ConnectedOrder as Order};
