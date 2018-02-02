const additionalActions = {
  orders: [
    {
      actionParams: {store: 'orderStore', method: 'cancelAll'},
      conditionsParams: [{store: 'orderListStore', getter: 'isOrderLength'}],
      title: 'Cancel all orders'
    }
  ]
};

export default additionalActions;
