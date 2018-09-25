export const TRADE_ROUTE =
  process.env.REACT_APP_ROOT_URL! || 'http://trade.lykke.com';
export const FUNDS_ROUTE =
  process.env.REACT_APP_WEBWALLET_ROOT_URL! || 'http://wallet.lykke.com';
export const SETTINGS_ROUTE =
  process.env.REACT_APP_SETTINGS_ROOT_URL! ||
  'https://wallet.lykke.com/profile';
export const LYKKE_STREAMS_ROUTE = 'https://streams.lykke.com/';
export const API_KEYS_ROUTE = `${process.env
  .REACT_APP_WEBWALLET_ROOT_URL!}wallets/hft`;
export const FEES_AND_LIMITS_ROUTE =
  'https://www.lykke.com/cp/wallet-fees-and-limits';
