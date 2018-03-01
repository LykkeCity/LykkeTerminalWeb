import platforms from '../constants/platforms';

const ModalMessages = {
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
  },
  isMobile: (platform: string) => ({
    body:
      'To offer you the advanced range of services we need you to confirm your identity and pass KYC (Know Your Client) procedure. You can pass the KYC in the Lykke Wallet app.',
    link:
      platform === platforms.desktop
        ? {
            appStore:
              'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581',
            playMarket:
              'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet'
          }
        : platform === platforms.ios
          ? 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581'
          : 'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet',
    mobileApp: platform === platforms.ios ? 'lykke://' : 'lykke://',
    title: 'Attention!'
  })
};

export default ModalMessages;
