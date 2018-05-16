import * as React from 'react';
import {StyledBackdrop} from './styles';

export interface BackdropProps {
  bg?: string;
  opacity?: number;
}

const Backdrop: React.SFC<BackdropProps> = props => {
  return <StyledBackdrop {...props} />;
};

export default Backdrop;
