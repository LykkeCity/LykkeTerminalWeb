import * as React from 'react';
import Scrollbars, {ScrollbarProps} from 'react-custom-scrollbars';

const withScroll = <P extends {}>(Component: React.ComponentType<P>) => (
  props: P & ScrollbarProps
) => (
  <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={1000}>
    <Component {...props} />
  </Scrollbars>
);

export default withScroll;
