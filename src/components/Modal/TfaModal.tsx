import {rem} from 'polished';
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
  codeInput: any;

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

  componentDidMount() {
    this.codeInput.focus();
  }

  render() {
    const message = this.props.modal.message;

    return (
      <SessionTfaConfirm>
        <ModalHeader onClick={this.handleCancel}>
          <ModalTitle>{message.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div style={{width: '300px', marginBottom: rem(16)}}>
            {message.body}
            <StyledText>2FA code</StyledText>
            <StyledInput
              id="code"
              type="text"
              // tslint:disable-next-line:jsx-no-lambda
              innerRef={(input: any) => {
                this.codeInput = input;
              }}
              value={this.state.code}
              autoComplete={'off'}
              onChange={this.handleChange}
              // tslint:disable-next-line:jsx-no-lambda
              onKeyDown={(e: any) => {
                switch (e.keyCode) {
                  case 13:
                    this.handleApply();
                    e.preventDefault();
                    break;
                }
              }}
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
