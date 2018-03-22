import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IClickOutsideProps {
  onClickOutside?: () => void;
}

export class ClickOutside extends React.Component<IClickOutsideProps> {
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  handleDocumentClick = (e: MouseEvent | TouchEvent) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target as Node)) {
      if (this.props.onClickOutside) {
        this.props.onClickOutside();
      }
    }
  };

  render() {
    return this.props.children;
  }
}

export default ClickOutside;
