import * as React from 'react';
import Name from './Name';
import {Br, NamesContainer} from './styled';

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
    <NamesContainer>
      {wallets.map((name, index) => {
        return (
          <div key={index} onClick={onChangeWallet(index)}>
            <Name name={name} selectedIndex={index === selectedIndex} />
            <Br />
          </div>
        );
      })}
    </NamesContainer>
  );
};

export default NameList;
