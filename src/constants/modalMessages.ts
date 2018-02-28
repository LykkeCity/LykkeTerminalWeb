import platforms from '../constants/platforms';

const ModalMessages = {
  expired: {
    body:
      'Your session has expired. Please, confirm your session with your phone',
    title: 'Please, confirm your session'
  },
  isMobile: (platform: string) => ({
    body:
      'You can get much better experience with the Lykke mobile app for your device',
    image: platform === platforms.ios ? 'app-store' : 'google-play',
    link:
      platform === platforms.ios
        ? 'https://itunes.apple.com/ru/app/lykke-wallet/id1112839581'
        : 'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet',
    title: 'Try Lykke mobile app'
  })
};

export default ModalMessages;
