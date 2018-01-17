import * as React from 'react';
import Scrollbars, {ScrollbarProps} from 'react-custom-scrollbars';

type WrappedComponentProps<P> = React.ComponentClass<P> | React.SFC<P>;
type HOC = <P extends ScrollbarProps>(
  C: WrappedComponentProps<P>
) => React.SFC<P>;

const withScroll: HOC = Component => props => (
  <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={1000}>
    <Component {...props} />
  </Scrollbars>
);

export default withScroll;
