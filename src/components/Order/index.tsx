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
  onArrowClick: any;
  onChange: any;
  onHandlePercentageChange: any;
  onReset?: any;
  onSubmit: any;
  percents: any[];
  quantity: string;
  quantityAccuracy: number;
  priceAccuracy: number;
  baseAssetAccuracy?: any;
  balanceAccuracy: number;
}

const ConnectedOrder = connect(
  ({
    balanceListStore: {tradingWalletBalances: getBalance},
    modalStore: {addModal},
    orderBookStore: {bestAsk, bestBid, mid},
    orderStore: {
      placeOrder,
      updatePriceFn,
      updateDepthFn,
      updateSideFn,
      updateTypeFn
    },
    uiStore: {selectedInstrument: instrument, stateFns, readOnlyMode},
    referenceStore,
    uiOrderStore: {
      onArrowClick,
      onPriceArrowClick,
      onQuantityArrowClick,
      onValueChange,
      handlePercentageChange,
      updatePercentageState,
      resetPercentage,
      setActivePercentage,
      isLimitInvalid,
      isMarketInvalid,
      getPriceAccuracy,
      getQuantityAccuracy,
      getPriceValue,
      getQuantityValue
    },
    authStore: {isAuth}
  }) => ({
    accuracy: {
      priceAccuracy: getPriceAccuracy(),
      quantityAccuracy: getQuantityAccuracy(),
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
    isLimitInvalid,
    isMarketInvalid,
    getAssetById: referenceStore.getAssetById,
    handlePercentageChange,
    setActivePercentage,
    mid: mid(),
    onArrowClick,
    onPriceArrowClick,
    onQuantityArrowClick,
    onValueChange,
    placeOrder,
    quoteAssetId: pathOr('', ['quoteAsset', 'id'], instrument),
    resetPercentage,
    stateFns,
    updateDepthFn,
    updatePercentageState,
    updatePriceFn,
    updateSideFn,
    updateTypeFn,
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
    priceValue: getPriceValue,
    quantityValue: getQuantityValue
  }),
  withAuth(Order)
);

export {ConnectedOrder as Order};
