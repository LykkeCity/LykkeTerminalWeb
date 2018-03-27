import {connect} from '../connect';
import MyWallets from './MyWallets';

const connectedMyWallets = connect(
  ({balanceListStore: {tradingWalletTotal: total}}) => ({
    total
  }),
  MyWallets
);

export {connectedMyWallets as MyWallets};
export {default as MyWalletNameList} from './MyWallets';
export {default as MyWalletName} from './Name';
