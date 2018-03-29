import * as React from 'react';
import {WalletModel} from '../../../models';
import {CurrentWalletName, StyledCurrentWallet} from './styles';

export interface CurrentWalletProps {
  wallet: WalletModel;
}

const CurrentWallet: React.SFC<CurrentWalletProps> = ({wallet}) =>
  (wallet && (
    <StyledCurrentWallet>
      <CurrentWalletName>{wallet.name}</CurrentWalletName>
      <small>Current Wallet</small>
    </StyledCurrentWallet>
  )) ||
  null;

export default CurrentWallet;
