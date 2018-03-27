import * as React from 'react';
import Name from './Name';

interface WalletNamesProps {
  wallets: string[];
  onChangeWallet: any;
  selectedIndex: number;
}

const NameList: React.SFC<WalletNamesProps> = ({
  wallets,
  onChangeWallet,
  selectedIndex
}) => {
  return (
    <div>
      {wallets.map((name, index) => {
        return (
          <div key={index} onClick={onChangeWallet(index)}>
            <Name name={name} selectedIndex={index === selectedIndex} />
          </div>
        );
      })}
    </div>
  );
};

export default NameList;
