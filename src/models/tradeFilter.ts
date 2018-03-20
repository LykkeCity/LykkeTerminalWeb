enum TradeFilter {
  CurrentAsset = 'Current asset',
  All = 'All'
}

export const toOptions = () =>
  Object.keys(TradeFilter).map(x => ({
    value: TradeFilter[x],
    label: TradeFilter[x]
  }));

export default TradeFilter;
