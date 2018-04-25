const ModalMessages = {
  cancelOrder: (ids: string[]) =>
    `cancel ${ids.join(', ')} ${ids.length > 1 ? 'orders' : 'order'}`,
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
  },
  qr: {
    body: 'Please, scan QR code to start trading',
    button: 'Continue in view mode',
    title: 'Confirm trade session'
  }
};

export default ModalMessages;
