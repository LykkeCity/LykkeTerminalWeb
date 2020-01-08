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
export const PROFILE_ROUTE = buildWalletUrl('profile');
export const TFA_ROUTE = buildWalletUrl('profile/security');
export const LYKKE_STREAMS_ROUTE =
  process.env.REACT_APP_STREAMS_URL || 'https://streams.lykke.com/';
export const API_KEYS_ROUTE = buildWalletUrl('wallets/hft');
export const FEES_AND_LIMITS_ROUTE =
  process.env.REACT_APP_FEES_URL || buildSiteUrl('cp/wallet-fees-and-limits');
