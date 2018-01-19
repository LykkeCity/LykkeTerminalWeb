import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';

class CustomScrollbar extends React.Component<{children?: any; styles?: any}> {
  render() {
    return (
      <Scrollbars autoHide={true} style={this.props.styles}>
        {this.props.children}
      </Scrollbars>
    );
  }
}
export default CustomScrollbar;
