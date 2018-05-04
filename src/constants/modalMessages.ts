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
  },
  manageWallets: {
    body:
      'The web trading wallet is currently under active development. It will be improved in the coming weeks, to eventually offer the same functionalities as our mobile Lykke Wallet. In the meantime, please use our mobile application to access all funds management functionalities.',
    link: {
      appStore: 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
      playMarket:
        'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet'
    }
  },
  NoFundsAndKyc: {
    body:
      "Lykke's web platform is being premiered exclusively for its active mobile users. In order to use the web platform, you need to have successfully passed our Know Your Customer (KYC) procedure and deposited funds in your Lykke Trading Wallet via Lykke Wallet Mobile Application. For more details about the release read our blogpost.",
    link: {
      appStore: 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
      playMarket:
        'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet',
      lykke: 'https://www.lykke.com/'
    },
    title: 'Dear user,'
  }
};

export default ModalMessages;
