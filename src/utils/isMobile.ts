import platforms from '../constants/platforms';

const isMobile = () => ({
  detectByUserAgent: () => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
    ) {
      if (navigator.userAgent.match(/Android/i)) {
        return platforms.android;
      } else {
        return platforms.ios;
      }
    } else {
      return platforms.desktop;
    }
  }
});

export default isMobile;
