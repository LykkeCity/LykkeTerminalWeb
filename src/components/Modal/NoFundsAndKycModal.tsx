import {inject} from 'mobx-react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {AuthStore} from '../../stores/index';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  GotButton,
  ImgLink,
  MarginedModalBody,
  ModalWrapper,
  Wrapper
} from './styles';

interface AttentionModalProps {
  authStore: AuthStore;
  modal: ModalModel;
}

@inject('authStore')
class NoFundsAndKycModal extends React.Component<AttentionModalProps> {
  render() {
    const goToLykke = () => this.close(this.props.modal.message.link.lykke);

    return (
      <ModalWrapper>
        <ModalHeader onClick={this.close}>Attention!</ModalHeader>
        <MarginedModalBody>{this.props.modal.message.body}</MarginedModalBody>
        <Wrapper>
          <ImgLink
            href={this.props.modal.message.link.appStore}
            target={'_blank'}
            onClick={this.close}
            image={'app-store'}
          />
          <ImgLink
            href={this.props.modal.message.link.playMarket}
            target={'_blank'}
            onClick={this.close}
            image={'google-play'}
          />
        </Wrapper>
        <GotButton onClick={goToLykke}>Got it!</GotButton>
      </ModalWrapper>
    );
  }

  private close = (redirect?: string) => {
    const link = typeof redirect === 'string' ? redirect : '';
    this.props.authStore.signOut(link);
  };
}

export default NoFundsAndKycModal;
