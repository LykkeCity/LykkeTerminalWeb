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
    button: 'Continue in read only mode',
    title: 'Confirm trade session'
  },
  missedKyc: {
    body: `To offer you the advanced range of services we need you to confirm your
    identity and pass KYC (Know Your Customer) procedure. You can pass the
    KYC in the Lykke Wallet app.`,
    title: 'Attention!'
  }
};

export default ModalMessages;
