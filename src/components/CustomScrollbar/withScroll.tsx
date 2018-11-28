import * as React from 'react';
import {ScrollbarProps} from 'react-custom-scrollbars';
import {CustomScrollbar} from '.';
import TrackedScrollbar, {TrackedScrollbarProps} from './TrackedScrollbar';

const withScroll = <P extends {}>(Component: React.ComponentType<P>) => (
  props: P & ScrollbarProps
) => (
  <CustomScrollbar>
    <Component {...props} />
  </CustomScrollbar>
);

export const withStyledScroll = (styles: object, autoHeight?: boolean) => <
  P extends {}
>(
  Component: React.ComponentType<P>
) => (props: P & ScrollbarProps) => (
  <CustomScrollbar styles={styles} autoHeight={autoHeight}>
    <Component {...props} />
  </CustomScrollbar>
);

export const withStyledTrackedScroll = (styles: object) => <P extends {}>(
  Component: React.ComponentType<P>
) => (props: P & ScrollbarProps & TrackedScrollbarProps) => (
  <TrackedScrollbar styles={styles}>
    <Component {...props} />
  </TrackedScrollbar>
);

export default withScroll;
