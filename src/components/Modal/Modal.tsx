import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {ModalProps, Modals} from './index';

class Modal extends React.Component<ModalProps> {
  constructor(props: ModalProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.modals.map((modal: ModalModel, index: number) => {
          const CurrentModal = Modals[modal.type];
          return <CurrentModal key={index} modal={modal} />;
        })}
      </div>
    );
  }
}

export default Modal;
