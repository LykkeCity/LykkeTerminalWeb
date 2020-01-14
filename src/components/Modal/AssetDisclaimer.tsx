import {Dialog} from '@lykkex/react-components';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import styled from '../styled';

export const LongContent = styled.div`
  overflow-y: auto;
  max-height: 350px;
`;

const AssetDisclaimer: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const renderDescription = (text: string) => (
    <LongContent dangerouslySetInnerHTML={{__html: text}} />
  );

  const handleConfirm = () => {
    modal.close();
    modal.applyAction();
  };

  const handleCancel = () => {
    modal.close();
    modal.cancelAction();
  };

  return (
    <Dialog
      theme="dark"
      visible={true}
      title="Terms of Service"
      onCancel={handleCancel}
      cancelButton={{text: 'Cancel'}}
      onConfirm={handleConfirm}
      confirmButton={{text: 'I accept'}}
      shouldAccept={true}
      description={renderDescription(modal.message)}
    />
  );
};

export default AssetDisclaimer;
