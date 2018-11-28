import {rem} from 'polished';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {dims} from '../styled';

const defaultHeight = `calc(100% - ${rem(dims.tileHeaderHeight)}`;

const CustomScrollbar: React.SFC<{autoHeight?: boolean; styles?: any}> = ({
  children,
  autoHeight,
  styles
}) => (
  <Scrollbars
    autoHeight={autoHeight}
    autoHide={true}
    style={{height: defaultHeight, ...styles}}
  >
    {children}
  </Scrollbars>
);

export default CustomScrollbar;
