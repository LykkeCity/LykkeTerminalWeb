import {rem} from 'polished';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {dims} from '../styled';

const defaultHeight = `calc(100% - ${rem(dims.tileHeaderHeight)}`;

const CustomScrollbar: React.SFC<{styles?: any}> = ({children, styles}) => (
  <Scrollbars autoHide={true} style={{height: defaultHeight, ...styles}}>
    {children}
  </Scrollbars>
);

export default CustomScrollbar;
