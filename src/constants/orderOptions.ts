const orderOptions = [
  {
    isMarketField: false,
    isOptional: false,
    title: 'Price',
    tumblerValues: ['Price', 'Pips'],
    value: 'priceValue'
  },
  {
    isMarketField: true,
    isOptional: false,
    title: 'Quantity',
    tumblerValues: ['Manual', 'Risk'],
    value: 'quantityValue'
  }
];

export default orderOptions;
