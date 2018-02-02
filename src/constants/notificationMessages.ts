const messages = {
  allOrdersCanceled: 'All orders have cancelled',
  defaultError: 'Something went wrong',
  expired: 'Your session has expired',
  orderCanceled: 'Order has canceled:',
  orderError: 'There is an error placing your order:',
  orderExecuted: (id: string) => `Order: ${id} was executed successfully`,
  orderSuccess: 'Order was placed successfully'
};

export default messages;
