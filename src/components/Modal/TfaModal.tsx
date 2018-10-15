import * as React from 'react';
import ModalModel from '../../models/modalModel';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  ModalBody,
  ModalTitle,
  SessionTfaConfirm,
  StyledInput,
  StyledText,
  TfaCancelButton,
  TfaOkButton
} from './styles';
import withModal from './withModal';

interface TfaModalProps {
  modal: ModalModel;
}

interface TfaModalState {
  code: string;
}

class TfaModal extends React.Component<TfaModalProps, TfaModalState> {
  constructor(props: TfaModalProps) {
    super(props);
    this.state = {
      code: ''
    };
  }

  handleChange = (e: any) => {
    this.setState({
      code: e.target.value
    });
  };

  handleApply = async () => {
    this.props.modal.applyAction(this.state.code);
  };

  handleCancel = () => {
    this.props.modal.cancelAction();
  };

  render() {
    const message = this.props.modal.message;

    return (
      <SessionTfaConfirm>
        <ModalHeader onClick={this.handleCancel}>
          <ModalTitle>{message.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div style={{width: '300px'}}>
            {message.body}
            <StyledText>2FA code</StyledText>
            <StyledInput
              id="code"
              type="text"
              value={this.state.code}
              autoComplete={'off'}
              onChange={this.handleChange}
              // tslint:disable-next-line:jsx-no-lambda
              name="code"
            />
          </div>
        </ModalBody>
        <TfaOkButton onClick={this.handleApply}>
          {message.applyButton}
        </TfaOkButton>
        <TfaCancelButton onClick={this.handleCancel}>
          {message.cancelButton}
        </TfaCancelButton>
      </SessionTfaConfirm>
    );
  }
}

export default withModal<TfaModalProps>(TfaModal);
