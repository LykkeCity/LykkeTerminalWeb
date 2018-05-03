import {inject} from 'mobx-react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {AuthStore} from '../../stores/index';
import ModalHeader from './ModalHeader/ModalHeader';
import {
  MarginedModalBody,
  MobileAppLink,
  ModalContentWrapper,
  ModalWrapper,
  OkButton
} from './styles';

interface NoFundsAndKycModalProps {
  authStore: AuthStore;
  modal: ModalModel;
}

@inject('authStore')
class NoFundsAndKycModal extends React.Component<NoFundsAndKycModalProps> {
  render() {
    const goToLykke = () => this.close(this.props.modal.message.link.lykke);

    return (
      <ModalWrapper>
        <ModalHeader onClick={this.close}>
          {this.props.modal.message.title}
        </ModalHeader>
        <MarginedModalBody>{this.props.modal.message.body}</MarginedModalBody>
        <ModalContentWrapper>
          <MobileAppLink
            href={this.props.modal.message.link.appStore}
            target={'_blank'}
            onClick={this.close}
            image={'app-store'}
          />
          <MobileAppLink
            href={this.props.modal.message.link.playMarket}
            target={'_blank'}
            onClick={this.close}
            image={'google-play'}
          />
        </ModalContentWrapper>
        <OkButton onClick={goToLykke}>Got it!</OkButton>
      </ModalWrapper>
    );
  }

  private close = (redirect?: string) => {
    const link = typeof redirect === 'string' ? redirect : '';
    this.props.authStore.signOut(link);
  };
}

export default NoFundsAndKycModal;
