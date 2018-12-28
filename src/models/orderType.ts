enum OrderType {
  Market = 'Market',
  Limit = 'Limit',
  StopLimit = 'Stop Limit'
}

enum OrderInputs {
  Price = 'priceValue',
  Quantity = 'quantityValue'
}

enum OrderStatus {
  Cancelled = 'Cancelled',
  Matched = 'Matched',
  Placed = 'InOrderBook',
  Pending = 'Pending',
  Processing = 'Processing',
  Rejected = 'Rejected'
}

export {OrderType, OrderInputs, OrderStatus};
