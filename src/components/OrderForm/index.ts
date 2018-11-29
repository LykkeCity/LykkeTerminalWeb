import {AssetBalanceModel, InstrumentModel} from 'src/models';
import {RootStore} from 'src/stores';
import {connect} from '../connect';
import LimitOrder from './LimitOrder';
import MarketOrder from './MarketOrder';
import OrderForm, {OrderFormProps} from './OrderForm';
import StopLimitOrder from './StopLimitOrder';

const plainOrderProps = (
  instrument: InstrumentModel,
  balances: AssetBalanceModel[]
) => {
  const baseAsset = instrument.baseAsset.name;
  const quoteAsset = instrument.quoteAsset.name;

  const balanceInBaseAsset = balances.find(
    b => b.id === instrument.baseAsset.id
  );
  const balanceInQuoteAsset = balances.find(
    b => b.id === instrument.quoteAsset.id
  );
  const availableInBaseAsset = balanceInBaseAsset
    ? balanceInBaseAsset.available
    : 0;
  const availableInQuoteAsset = balanceInQuoteAsset
    ? balanceInQuoteAsset.available
    : 0;

  return {
    baseAsset,
    quoteAsset,
    availableInBaseAsset,
    availableInQuoteAsset
  };
};

const mapStoreToProps = ({balanceListStore, uiStore}: RootStore) => ({
  instrument: uiStore.selectedInstrument,
  balances: balanceListStore.tradingWallet.balances,
  price: uiStore.selectedPrice,
  amount: uiStore.selectedAmount,
  side: uiStore.selectedSide,
  onReset: uiStore.resetOrderForm,
  ...plainOrderProps(
    uiStore.selectedInstrument!,
    balanceListStore.tradingWallet.balances
  )
});

const ConnectedOrderForm = connect<OrderFormProps>(
  ({orderStore, uiStore}) => ({
    instrument: uiStore.selectedInstrument,
    placeOrder: orderStore.placeOrder,
    type: uiStore.selectedOrderType
  }),
  OrderForm
);

const ConnectedLimitOrder = connect<OrderFormProps>(
  (store: RootStore) => ({
    initialPrice: store.uiStore.initialPrice,
    ...mapStoreToProps(store)
  }),
  LimitOrder
);

const ConnectedMarketOrder = connect<OrderFormProps>(
  (store: RootStore) => ({
    ask: store.orderBookStore.bestAskPrice,
    ...mapStoreToProps(store)
  }),
  MarketOrder
);

const ConnectedStopLimitOrder = connect<OrderFormProps>(
  (store: RootStore) => ({
    initialPrice: store.uiStore.initialPrice,
    ...mapStoreToProps(store)
  }),
  StopLimitOrder
);

export {ConnectedOrderForm as OrderForm};
export {ConnectedLimitOrder as LimitOrder};
export {ConnectedMarketOrder as MarketOrder};
export {ConnectedStopLimitOrder as StopLimitOrder};
