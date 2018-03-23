import * as React from 'react';
import {WalletNamesProps} from './index';
import WalletName from './WalletName';

const WalletNames: React.SFC<WalletNamesProps> = ({
  wallets,
  onChangeWallet,
  selectedIndex
}) => {
  return (
    <div>
      {wallets.map((name, index) => {
        return (
          <div key={index} onClick={onChangeWallet(index)}>
            <WalletName name={name} selectedIndex={index === selectedIndex} />
          </div>
        );
      })}
    </div>
  );
};

export default WalletNames;
