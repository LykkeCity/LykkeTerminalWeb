import {pathOr} from 'rambda';
import {RootStore} from '../../stores';
import {connect} from '../connect';
import InstrumentPerformance, {
  InstrumentPerformanceProps
} from './InstrumentPerformance';

const mapStoreToProps = ({priceStore}: RootStore) => ({
  lastPrice: priceStore.lastTradePrice,
  change: priceStore.dailyChange,
  high: priceStore.dailyHigh,
  low: priceStore.dailyLow,
  volume: priceStore.dailyVolume,
  instrumentAccuracy: pathOr(
    undefined,
    ['selectedInstrument', 'accuracy'],
    priceStore
  ),
  baseAssetAccuracy: pathOr(
    undefined,
    ['selectedInstrument', 'baseAsset', 'accuracy'],
    priceStore
  )
});

const ConnectedInstrumentPerformance = connect<InstrumentPerformanceProps>(
  mapStoreToProps,
  InstrumentPerformance
);

export {ConnectedInstrumentPerformance as InstrumentPerformance};
