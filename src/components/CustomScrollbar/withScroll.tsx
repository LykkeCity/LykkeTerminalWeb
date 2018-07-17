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

export const withStyledScroll = (styles: object) => <P extends {}>(
  Component: React.ComponentType<P>
) => (props: P & ScrollbarProps) => (
  <CustomScrollbar styles={styles}>
    <Component {...props} />
  </CustomScrollbar>
);

export const withStyledTrackedScroll = (styles: object) => <P extends {}>(
  Component: React.ComponentType<P>
) => (props: P & ScrollbarProps & TrackedScrollbarProps) => (
  <TrackedScrollbar
    styles={styles}
    setLastScrollPosition={props.setLastScrollPosition}
    getLastScrollPosition={props.getLastScrollPosition}
  >
    <Component {...props} />
  </TrackedScrollbar>
);

export default withScroll;
