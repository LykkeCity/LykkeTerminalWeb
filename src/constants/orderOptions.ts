const orderOptions = [
  {
    isMarketField: false,
    isOptional: false,
    title: 'Price',
    tumblerValues: ['Price', 'Pips'],
    value: 'priceValue'
  },
  {
    isMarketField: false,
    isOptional: true,
    title: 'Stop Loss',
    tumblerValues: ['Price', 'Pips'],
    value: 'stopLoss'
  },
  {
    isMarketField: false,
    isOptional: true,
    title: 'Take Profit',
    tumblerValues: ['Price', 'Pips'],
    value: 'takeProfit'
  },
  {
    isMarketField: true,
    isOptional: false,
    title: 'Quantity',
    tumblerValues: ['Manual', '%Risk'],
    value: 'quantityValue'
  }
];

export default orderOptions;
