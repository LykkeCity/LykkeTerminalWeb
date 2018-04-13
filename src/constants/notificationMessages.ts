const messages = {
  allOrdersCanceled: 'All orders have been canceled',
  defaultError: 'Something went wrong',
  editOrderSuccess: 'Order was edited successfully',
  expired: 'Your session has expired',
  orderCancelled: 'Order has been cancelled:',
  orderError: 'There is an error placing your order:',
  orderExecuted: (id: string) => `Order: ${id} was closed successfully`,
  orderExecutedPartially: (id: string, volume: number) =>
    `Order: ${id} was partially closed. Amount: ${volume}`,
  orderSuccess: 'Order was placed successfully',
  pairNotFound: (id: string) =>
    `Asset pair ${id} is not found. You have been switched to the default pair: BTCUSD`,
  pairNotConfigured: (id: string) => `Asset pair ${id} is not configured.`
};

export default messages;
