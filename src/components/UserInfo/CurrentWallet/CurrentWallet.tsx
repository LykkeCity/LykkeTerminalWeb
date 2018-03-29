import * as React from 'react';
import {walletNames} from '../../../constants/walletNames';

interface CurrentWalletProps {
  currentWallet: number;
}
export const CurrentWallet: React.SFC<CurrentWalletProps> = ({
  currentWallet
}) => {
  return <div>Current Wallet: {walletNames[currentWallet]}</div>;
};
export default CurrentWallet;
