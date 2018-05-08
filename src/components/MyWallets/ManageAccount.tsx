import React from 'react';
import ModalMessages from '../../constants/modalMessages';
import Types from '../../models/modals';
import {ManageAccountLink} from './styles';

export interface ManageAccountProps {
  addModal: any;
}

const ManageAccount: React.SFC<ManageAccountProps> = ({addModal}) => {
  const handleManageWallets = () =>
    addModal(ModalMessages.manageWallets, null, null, Types.ManageFunds);

  return (
    <ManageAccountLink onClick={handleManageWallets}>
      Manage funds
    </ManageAccountLink>
  );
};

export default ManageAccount;
