import * as React from 'react';
import ReactDOM from 'react-dom';
import Backdrop from '../Backdrop/Backdrop';

const withModal = <P extends {}>(Component: React.ComponentType<P>) =>
  class WithModal extends React.Component<P> {
    root: HTMLDivElement;

    componentWillMount() {
      this.root = document.createElement('div');
      const style = this.root.style;
      style.setProperty('position', 'absolute');
      style.setProperty('width', '100%');
      style.setProperty('height', '100%');
      style.setProperty('top', '0');
      style.setProperty('left', '0');
      document.body.appendChild(this.root);
    }

    componentWillUnmount() {
      document.body.removeChild(this.root);
    }

    render() {
      return ReactDOM.createPortal(
        <React.Fragment>
          <Backdrop />
          <Component {...this.props} />
        </React.Fragment>,
        this.root
      );
    }
  };

export default withModal;
