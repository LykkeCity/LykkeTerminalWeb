import * as React from 'react';
import CloseButton from '../../CloseButton/CloseButton';
import {CloseBtnPosition, ModalHeaderTitle} from '../styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const ModalHeader: React.SFC<{
  title?: string;
  onClick: any;
  children?: any;
}> = ({title, onClick, children}) => {
  return (
    <Flex justify={'space-between'}>
      <ModalHeaderTitle>{title ? title : children}</ModalHeaderTitle>
      <CloseButton
        onClose={onClick}
        top={CloseBtnPosition.top}
        right={CloseBtnPosition.right}
      />
    </Flex>
  );
};

export default ModalHeader;
