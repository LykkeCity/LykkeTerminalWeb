import {Dialog} from '@lykkex/react-components';
import * as React from 'react';
import ModalModel from '../../models/modalModel';

const AssetDisclaimer: React.SFC<{modal: ModalModel}> = ({modal}) => {
  const renderDescription = (text: string) => (
    <div dangerouslySetInnerHTML={{__html: text}} />
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
      hasScroll={true}
    />
  );
};

export default AssetDisclaimer;
