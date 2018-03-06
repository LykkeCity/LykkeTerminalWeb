const ModalMessages = {
  cancelOrder: (ids: string[]) =>
    `cancel ${ids.join(', ')} ${ids.length > 1 ? 'orders' : 'order'}`,
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
  }
};

export default ModalMessages;
