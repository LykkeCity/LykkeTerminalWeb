import * as React from 'react';
import Name from './Name';
import {Br, NamesContainer} from './styled';

interface WalletNamesProps {
  wallets: string[];
  onChangeWallet: any;
  selectedIndex: number;
  total: number;
  baseAssetName: string;
  accuracy: number;
  tradingWalletBalance?: number;
  totalList: number[];
}

const NameList: React.SFC<WalletNamesProps> = ({
  wallets,
  onChangeWallet,
  selectedIndex,
  total,
  baseAssetName,
  accuracy,
  tradingWalletBalance,
  totalList
}) => {
  return (
    <NamesContainer>
      {wallets.map((name, index) => {
        return (
          <div key={index} onClick={onChangeWallet(index)}>
            <Name
              name={name}
              selectedIndex={index === selectedIndex}
              baseAssetName={baseAssetName}
              accuracy={accuracy}
              wallets={totalList[index]}
            />
            <Br />
          </div>
        );
      })}
    </NamesContainer>
  );
};

export default NameList;
