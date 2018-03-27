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
}

const NameList: React.SFC<WalletNamesProps> = ({
  wallets,
  onChangeWallet,
  selectedIndex,
  total,
  baseAssetName,
  accuracy,
  tradingWalletBalance
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
              wallets={
                name === 'Trading wallet'
                  ? tradingWalletBalance ? tradingWalletBalance : 0
                  : total
              }
            />
            <Br />
          </div>
        );
      })}
    </NamesContainer>
  );
};

export default NameList;
