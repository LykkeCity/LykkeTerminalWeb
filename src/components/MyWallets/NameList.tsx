import * as React from 'react';
import {WalletModel} from '../../models';
import Name from './Name';
import {Br, WalletNames} from './styles';

interface WalletNamesProps {
  wallets: WalletModel[];
  onChangeWallet: any;
  selectedIndex: number;
  baseAssetName: string;
  accuracy: number;
}

const NameList: React.SFC<WalletNamesProps> = ({
  wallets,
  onChangeWallet,
  selectedIndex,
  baseAssetName,
  accuracy
}) => {
  const handleChangeWallet = (idx: number) => () => onChangeWallet(idx);
  return (
    <WalletNames>
      {wallets.map((wallet, index) => (
        <div key={index} onClick={handleChangeWallet(index)}>
          <Name
            name={wallet.name}
            selectedIndex={index === selectedIndex}
            baseAssetName={baseAssetName}
            accuracy={accuracy}
            totalBalance={wallet.totalBalance}
          />
          <Br />
        </div>
      ))}
    </WalletNames>
  );
};

export default NameList;
