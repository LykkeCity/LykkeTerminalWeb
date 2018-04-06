import * as React from 'react';
import {WalletModel} from '../../../models';
import {StyledCurrentWallet} from './styles';

export interface CurrentWalletProps {
  wallet: WalletModel;
}

const CurrentWallet: React.SFC<CurrentWalletProps> = ({wallet}) =>
  (wallet && (
    <StyledCurrentWallet>
      <span title={wallet.name}>{wallet.name}</span>
      <small>Current Wallet</small>
    </StyledCurrentWallet>
  )) ||
  null;

export default CurrentWallet;
