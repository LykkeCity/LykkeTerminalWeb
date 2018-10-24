const ModalMessages = {
  cancelOrder: (ids: string[]) =>
    `cancel ${ids.join(', ')} ${ids.length > 1 ? 'orders' : 'order'}`,
  expired: {
    body:
      'You need to confirm your trade session by using the Lykke Wallet mobile application.',
    title: 'Confirm trade session'
  },
  qr: {
    body:
      'Please confirm your trade session by using the Lykke Wallet mobile application.',
    button: 'Continue in read-only mode',
    title: 'Confirm trade session'
  },
  tfa: {
    body:
      'Please confirm your trade session by using Google Authenticator or any other compatible app of your choice.',
    applyButton: 'Submit',
    cancelButton: 'Continue in read-only mode',
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
    body: `Lykke's web platform is being premiered exclusively for its active mobile users. In order to use the web platform, you need to have successfully passed our Know Your Customer (KYC) procedure and deposited funds in your Lykke Trading Wallet via Lykke Wallet Mobile Application. For more details about the release read our <a href="https://www.lykke.com/company/news/2018-05-web-terminal" target='_blank'>blogpost</a>.`,
    link: {
      appStore: 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
      playMarket:
        'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet',
      lykke: 'https://www.lykke.com/',
      blogpost: 'https://www.lykke.com/company/news/2018-05-web-terminal'
    },
    title: 'Dear user,'
  }
};

export default ModalMessages;
