import {buildUrl} from '../utils/url';

const buildTerminalUrl = buildUrl(
  process.env.REACT_APP_ROOT_URL || 'https://trade.lykke.com'
);

const buildWalletUrl = buildUrl(
  process.env.REACT_APP_WEBWALLET_ROOT_URL || 'https://wallet.lykke.com'
);

const buildSiteUrl = buildUrl(
  process.env.REACT_APP_WEBSITE_ROOT_URL || 'https://lykke.com'
);

export const TRADE_ROUTE = buildTerminalUrl();
export const FUNDS_ROUTE = buildWalletUrl();
export const SETTINGS_ROUTE = buildWalletUrl('profile');
export const LYKKE_STREAMS_ROUTE = 'https://streams.lykke.com/';
export const API_KEYS_ROUTE = buildWalletUrl('wallets/hft');
export const FEES_AND_LIMITS_ROUTE = buildSiteUrl('cp/wallet-fees-and-limits');
