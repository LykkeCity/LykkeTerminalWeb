import * as React from 'react';
import {ScrollbarProps} from 'react-custom-scrollbars';
import {CustomScrollbar} from '.';

const withScroll = <P extends {}>(Component: React.ComponentType<P>) => (
  props: P & ScrollbarProps
) => (
  <CustomScrollbar>
    <Component {...props} />
  </CustomScrollbar>
);

export const withStyledScroll = (styles: object) => <P extends {}>(
  Component: React.ComponentType<P>
) => (props: P & ScrollbarProps) => (
  <CustomScrollbar styles={styles}>
    <Component {...props} />
  </CustomScrollbar>
);

export default withScroll;
