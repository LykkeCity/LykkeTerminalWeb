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
    orderStore: {placeOrder, updatePriceFn, updateDepthFn},
    uiStore: {
      selectedInstrument: instrument,
      stateFns,
      initPriceFn,
      readOnlyMode
    },
    referenceStore,
    uiOrderStore: {
      onArrowClick,
      onValueChange,
      handlePercentageChange,
      updatePercentageState,
      resetPercentage,
      setActivePercentage,
      isLimitInvalid,
      isMarketInvalid
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
    isLimitInvalid,
    isMarketInvalid,
    getAssetById: referenceStore.getAssetById,
    handlePercentageChange,
    setActivePercentage,
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
    instrument
  }),
  withAuth(Order)
);

export {ConnectedOrder as Order};
