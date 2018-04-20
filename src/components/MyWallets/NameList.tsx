import React from 'react';
import {WalletModel} from '../../models';
import {HBar} from '../Bar';
import {WalletItem} from './';
import {WalletNameList} from './styles';

export interface WalletListProps {
  wallets: WalletModel[];
}

const WalletList: React.SFC<WalletListProps> = ({wallets}) => (
  <WalletNameList>
    {wallets.map((wallet, index) => (
      <React.Fragment>
        <WalletItem key={wallet.id} {...wallet} />
        <HBar style={{opacity: 0.4}} />
      </React.Fragment>
    ))}
  </WalletNameList>
);

export default WalletList;
