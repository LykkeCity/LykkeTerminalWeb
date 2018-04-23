const userAgent = navigator.userAgent;

let isSupport: boolean = true;
if (userAgent.indexOf('Linux') !== -1 && userAgent.indexOf('Chrome') !== -1) {
  isSupport = false;
}
export const supportedDesignedIcons = isSupport;
