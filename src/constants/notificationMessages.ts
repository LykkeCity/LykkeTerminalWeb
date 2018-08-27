const messages = {
  allOrdersCanceled: 'All orders have been canceled',
  defaultError: 'Something went wrong',
  editOrderSuccess: 'Order was edited successfully',
  expired: 'Your session has expired',
  allOrdersCancelled: 'All orders have been cancelled',
  allCurrentInstrumentOrdersCancelled: (instrumentName: string) =>
    `All ${instrumentName} orders have been cancelled`,
  orderCancelled: 'Order has been cancelled:',
  orderError: 'There is an error placing your order:',
  orderExecuted: (id: string) => `Order: ${id} was closed successfully`,
  orderExecutedPartially: (id: string, volume: number) =>
    `Order: ${id} was partially closed. Amount: ${volume}`,
  orderSuccess: 'Order has been placed successfully',
  pairNotFound: (id: string) =>
    `Asset pair ${id} was not found. You've been switched to the default instrument`,
  pairNotConfigured: (id: string) => `Asset pair ${id} is not configured`
};

export default messages;
