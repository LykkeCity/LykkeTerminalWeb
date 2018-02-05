const orderOptions = [
  {
    isAmountable: false,
    isMarketField: false,
    title: 'Price',
    tumblerValues: ['Price', 'Pips'],
    value: 'priceValue'
  },
  {
    isAmountable: true,
    isMarketField: true,
    title: 'Quantity',
    tumblerValues: ['Manual', 'Risk'],
    value: 'quantityValue'
  }
];

export default orderOptions;
