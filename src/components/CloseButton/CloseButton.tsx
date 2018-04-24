import * as React from 'react';
import {Button} from './styles';

interface CloseButtonProps {
  onClose: any;
  top?: number;
  right?: number;
}

const CloseButton: React.SFC<CloseButtonProps> = ({onClose, top, right}) => (
  <Button href="#" onClick={onClose} top={top} right={right}>
    <span>&times;</span>
  </Button>
);

export default CloseButton;
