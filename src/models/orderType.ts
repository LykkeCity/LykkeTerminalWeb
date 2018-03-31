enum OrderType {
  Market = 'Market',
  Limit = 'Limit',
  StopLimit = 'Stop Limit'
}

enum OrderInputs {
  Price = 'priceValue',
  Quantity = 'quantityValue'
}

enum OrderBookType {
  Cancelled = 'Cancelled',
  Matched = 'Matched',
  Placed = 'InOrderBook'
}

export {OrderType, OrderInputs, OrderBookType};
