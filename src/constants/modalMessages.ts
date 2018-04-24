const ModalMessages = {
  cancelOrder: (ids: string[]) =>
    `cancel ${ids.join(', ')} ${ids.length > 1 ? 'orders' : 'order'}`,
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
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
  NoFundsAndKyc: (noFunds?: boolean, noKyc?: boolean) => {
    const modal = {
      body: '',
      link: {
        appStore: 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
        playMarket:
          'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet',
        lykke: 'https://www.lykke.com/'
      },
      title: 'Attention!'
    };

    if (noFunds && !noKyc) {
      modal.body =
        'There should be some funds in your wallets to start trading. Please refill your account.';
    }
    if (!noFunds && noKyc) {
      modal.body =
        'You should pass KYC (Know Your Client) procedure to start trading. You can pass the KYC in the Lykke mobile app.';
    }
    if (noFunds && noKyc) {
      modal.body = `
        You should pass KYC (Know Your Client) procedure and have some funds in your wallets to start trading.
        Please use Lykke mobile app to do it.
      `;
    }

    return modal;
  }
};

export default ModalMessages;
