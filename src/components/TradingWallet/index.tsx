import {connect} from '../connect';
import TradingWallet from './TradingWallet';

export interface TradingWalletProps {
  assets?: any;
  accuracy: number;
}

export interface TradingWalletItemProps {
  accuracy: number;
  balance: number;
  id: string;
  reserved: number;
}

const ConnectedTradingWallet = connect(
  ({balanceListStore: {tradingWalletAssets: assets}, referenceStore}) => ({
    accuracy: (referenceStore.getAssetById(referenceStore.baseAssetId) || {
      accuracy: 2
    })!.accuracy,
    assets
  }),
  TradingWallet
);

export {ConnectedTradingWallet as TradingWallet};
export {
  default as TradingWalletItem
} from './TradingWalletItem/TradingWalletItem';
