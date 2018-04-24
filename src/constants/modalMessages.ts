const ModalMessages = {
  cancelOrder: (ids: string[]) =>
    `cancel ${ids.join(', ')} ${ids.length > 1 ? 'orders' : 'order'}`,
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
  },
  attention: (type: string, noFunds?: boolean, noKyc?: boolean) => {
    const modal = {
      body: '',
      link: {
        appStore: 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
        playMarket:
          'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet'
      },
      signOut: false,
      title: 'Attention!'
    };

    switch (type) {
      case 'manageWallets':
        modal.body =
          'You can manage your wallets in the Lykke mobile app. Please use the links below to install it.';
        break;
      case 'noFundsAndKyc': {
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
        modal.signOut = true;
        break;
      }
      default:
    }

    return modal;
  }
};

export default ModalMessages;
