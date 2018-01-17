import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';

class CustomScrollbar extends React.Component<{children?: any}> {
  render() {
    return (
      <Scrollbars autoHide={true} autoHeight={true} autoHeightMax={1000}>
        {this.props.children}
      </Scrollbars>
    );
  }
}
export default CustomScrollbar;
