const messages = {
  allOrdersCanceled: 'All orders have cancelled',
  defaultError: 'Something went wrong',
  expired: 'Your session has expired',
  orderCanceled: 'Order has canceled:',
  orderError: 'There is an error placing your order:',
  orderExecuted: (id: string) => `Order: ${id} was closed successfully`,
  orderExecutedPartially: (id: string, volume: number) =>
    `Order: ${id} was partially closed. Amount: ${volume}`,
  orderSuccess: 'Order was placed successfully'
};

export default messages;
